import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Profile } from "./useProfile";

export interface Friend extends Profile {
  friendship_id: string;
  is_favorite: boolean;
  last_message?: string;
}

export interface PendingRequest extends Profile {
  friendship_id: string;
  sender_id: string;
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    if (!user) {
      setFriends([]);
      setPendingRequests([]);
      setSentRequests([]);
      setLoading(false);
      return;
    }

    // Get all friendships involving this user
    const { data: friendships, error: friendshipsError } = await supabase
      .from("friendships")
      .select("id, user_id, friend_id, is_favorite, status")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (friendshipsError) {
      console.error("Error fetching friendships:", friendshipsError);
      setLoading(false);
      return;
    }

    if (!friendships || friendships.length === 0) {
      setFriends([]);
      setPendingRequests([]);
      setSentRequests([]);
      setLoading(false);
      return;
    }

    // Separate accepted, pending received, and pending sent
    const acceptedFriendships = friendships.filter((f) => f.status === "accepted");
    const pendingReceived = friendships.filter(
      (f) => f.status === "pending" && f.friend_id === user.id
    );
    const pendingSent = friendships.filter(
      (f) => f.status === "pending" && f.user_id === user.id
    );

    // Get all unique user IDs we need profiles for
    const allUserIds = new Set<string>();
    friendships.forEach((f) => {
      allUserIds.add(f.user_id === user.id ? f.friend_id : f.user_id);
    });

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", Array.from(allUserIds));

    if (profilesError) {
      console.error("Error fetching friend profiles:", profilesError);
      setLoading(false);
      return;
    }

    // Build accepted friends list with last messages
    const friendsWithMessages: Friend[] = await Promise.all(
      acceptedFriendships.map(async (friendship) => {
        const friendUserId = friendship.user_id === user.id ? friendship.friend_id : friendship.user_id;
        const profile = profiles?.find((p) => p.user_id === friendUserId);
        
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("content, is_gif")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendUserId}),and(sender_id.eq.${friendUserId},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...(profile as Profile),
          friendship_id: friendship.id,
          is_favorite: friendship.is_favorite,
          last_message: lastMessage?.is_gif ? "Sent a GIF 🎬" : lastMessage?.content,
        };
      })
    );

    // Build pending received requests
    const pendingRequestsList: PendingRequest[] = pendingReceived.map((friendship) => {
      const senderProfile = profiles?.find((p) => p.user_id === friendship.user_id);
      return {
        ...(senderProfile as Profile),
        friendship_id: friendship.id,
        sender_id: friendship.user_id,
      };
    });

    // Build pending sent requests
    const sentRequestsList: PendingRequest[] = pendingSent.map((friendship) => {
      const receiverProfile = profiles?.find((p) => p.user_id === friendship.friend_id);
      return {
        ...(receiverProfile as Profile),
        friendship_id: friendship.id,
        sender_id: friendship.user_id,
      };
    });

    setFriends(friendsWithMessages);
    setPendingRequests(pendingRequestsList);
    setSentRequests(sentRequestsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  const toggleFavorite = async (friendshipId: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from("friendships")
      .update({ is_favorite: !isFavorite })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }

    setFriends((prev) =>
      prev.map((f) =>
        f.friendship_id === friendshipId ? { ...f, is_favorite: !isFavorite } : f
      )
    );
  };

  const removeFriend = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (error) {
      console.error("Error removing friend:", error);
      throw error;
    }

    setFriends((prev) => prev.filter((f) => f.friendship_id !== friendshipId));
    setPendingRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId));
    setSentRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId));
  };

  const acceptRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error accepting request:", error);
      throw error;
    }

    // Refresh to move from pending to friends
    await fetchFriends();
  };

  const declineRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (error) {
      console.error("Error declining request:", error);
      throw error;
    }

    setPendingRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId));
  };

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    toggleFavorite,
    removeFriend,
    acceptRequest,
    declineRequest,
    refetch: fetchFriends,
  };
};
