import { useState } from "react";
import { FriendsList } from "@/components/chat/FriendsList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { AvatarPicker } from "@/components/chat/AvatarPicker";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useFriends } from "@/hooks/useFriends";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";

const Index = () => {
  const { profile, updateProfile } = useProfile();
  const { 
    friends, 
    pendingRequests, 
    sentRequests, 
    loading: friendsLoading, 
    refetch,
    acceptRequest,
    declineRequest,
  } = useFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Get the selected friend's user_id for messages
  const selectedFriend = friends.find((f) => f.user_id === selectedFriendId);
  const { messages, sendMessage } = useMessages(selectedFriendId);

  const handleSelectFriend = (userId: string) => {
    setSelectedFriendId(userId);
    setShowChat(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedFriendId) return;
    try {
      await sendMessage(message, false);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleSendGif = async (gifUrl: string) => {
    if (!selectedFriendId) return;
    try {
      await sendMessage(gifUrl, true);
    } catch (error) {
      toast.error("Failed to send GIF");
    }
  };

  const handleAvatarSelect = async (avatar: string) => {
    try {
      await updateProfile({ avatar_url: avatar });
      toast.success("Avatar updated! ✨");
    } catch (error) {
      toast.error("Failed to update avatar");
    }
  };

  // Format friends for FriendsList component
  const formattedFriends = friends.map((f) => ({
    id: f.user_id,
    name: f.display_name,
    avatar: f.avatar_url,
    status: f.status,
    lastMessage: f.last_message,
    isFavorite: f.is_favorite,
  }));

  // Format pending requests
  const formattedPendingRequests = pendingRequests.map((r) => ({
    id: r.user_id,
    friendshipId: r.friendship_id,
    name: r.display_name,
    avatar: r.avatar_url,
  }));

  // Format sent requests
  const formattedSentRequests = sentRequests.map((r) => ({
    id: r.user_id,
    friendshipId: r.friendship_id,
    name: r.display_name,
    avatar: r.avatar_url,
  }));

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      await acceptRequest(friendshipId);
      toast.success("Friend request accepted! 🎉");
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      await declineRequest(friendshipId);
      toast.info("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  const userProfile = profile
    ? { name: profile.display_name, avatar: profile.avatar_url }
    : { name: "Me ✨", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=default&backgroundColor=ffd5dc" };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Friends Sidebar */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border flex-shrink-0",
          "md:block",
          showChat ? "hidden" : "block"
        )}
      >
        <FriendsList
          friends={formattedFriends}
          pendingRequests={formattedPendingRequests}
          sentRequests={formattedSentRequests}
          selectedFriend={selectedFriendId}
          onSelectFriend={handleSelectFriend}
          userProfile={userProfile}
          onEditAvatar={() => setShowAvatarPicker(true)}
          onFriendsRefresh={refetch}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
        />
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          "flex-1 min-w-0",
          "md:block",
          !showChat ? "hidden md:block" : "block"
        )}
      >
        {selectedFriend ? (
          <ChatWindow
            friend={{
              id: selectedFriend.user_id,
              name: selectedFriend.display_name,
              avatar: selectedFriend.avatar_url,
              status: selectedFriend.status,
            }}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendGif={handleSendGif}
            onBack={() => setShowChat(false)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4 animate-float">💬</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {friendsLoading ? "Loading friends..." : friends.length === 0 ? "No friends yet!" : "Pick a friend to chat!"}
            </h2>
            <p className="text-muted-foreground">
              {friends.length === 0
                ? "Add some friends to start chatting ✨"
                : "Choose someone from your friends list to start chatting ✨"}
            </p>
          </div>
        )}
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPicker
          currentAvatar={userProfile.avatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
};

export default Index;
