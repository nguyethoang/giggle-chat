import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_gif: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  isSent: boolean;
  timestamp: string;
  isGif?: boolean;
}

export const useMessages = (friendUserId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const formatMessages = useCallback(
    (rawMessages: Message[]): ChatMessage[] => {
      return rawMessages.map((msg) => ({
        id: msg.id,
        message: msg.content,
        isSent: msg.sender_id === user?.id,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isGif: msg.is_gif,
      }));
    },
    [user?.id]
  );

  const fetchMessages = useCallback(async () => {
    if (!user || !friendUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${friendUserId}),and(sender_id.eq.${friendUserId},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(formatMessages(data as Message[]));
    }
    setLoading(false);
  }, [user, friendUserId, formatMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user || !friendUserId) return;

    const channel = supabase
      .channel(`messages-${user.id}-${friendUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Filter: only process messages for this conversation
          const isRelevant =
            (newMessage.sender_id === user.id && newMessage.receiver_id === friendUserId) ||
            (newMessage.sender_id === friendUserId && newMessage.receiver_id === user.id);
          
          if (!isRelevant) return;

          const formattedMessage: ChatMessage = {
            id: newMessage.id,
            message: newMessage.content,
            isSent: newMessage.sender_id === user.id,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isGif: newMessage.is_gif,
          };
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === formattedMessage.id)) return prev;
            return [...prev, formattedMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, friendUserId]);

  const sendMessage = async (content: string, isGif: boolean = false) => {
    if (!user || !friendUserId) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: friendUserId,
      content,
      is_gif: isGif,
    });

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  return { messages, loading, sendMessage };
};
