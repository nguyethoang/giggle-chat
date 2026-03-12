import { useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  message: string;
  isSent: boolean;
  timestamp: string;
  isGif?: boolean;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

interface ChatWindowProps {
  friend: Friend;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onSendGif: (gifUrl: string) => void;
  onBack?: () => void;
}

export const ChatWindow = ({ 
  friend, 
  messages, 
  onSendMessage, 
  onSendGif,
  onBack 
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-background">
      <ChatHeader
        friendName={friend.name}
        friendAvatar={friend.avatar}
        friendStatus={friend.status}
        onBack={onBack}
      />

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Decorative elements */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              ✨ Chat started today ✨
            </div>
          </div>

          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.message}
              isSent={msg.isSent}
              timestamp={msg.timestamp}
              avatar={!msg.isSent ? friend.avatar : undefined}
              senderName={!msg.isSent ? friend.name : undefined}
              isGif={msg.isGif}
            />
          ))}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={onSendMessage} onSendGif={onSendGif} />
    </div>
  );
};
