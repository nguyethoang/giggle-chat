import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star, Settings, Check, X, Clock } from "lucide-react";
import { AddFriendDialog } from "./AddFriendDialog";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy";
  lastMessage?: string;
  isFavorite?: boolean;
}

interface PendingRequest {
  id: string;
  friendshipId: string;
  name: string;
  avatar: string;
}

interface UserProfile {
  name: string;
  avatar: string;
}

interface FriendsListProps {
  friends: Friend[];
  pendingRequests: PendingRequest[];
  sentRequests: PendingRequest[];
  selectedFriend: string | null;
  onSelectFriend: (id: string) => void;
  userProfile: UserProfile;
  onEditAvatar: () => void;
  onFriendsRefresh?: () => void;
  onAcceptRequest?: (friendshipId: string) => void;
  onDeclineRequest?: (friendshipId: string) => void;
}

const statusColors = {
  online: "bg-mint",
  offline: "bg-muted-foreground",
  busy: "bg-peach",
};

export const FriendsList = ({ 
  friends, 
  pendingRequests,
  sentRequests,
  selectedFriend, 
  onSelectFriend, 
  userProfile, 
  onEditAvatar, 
  onFriendsRefresh,
  onAcceptRequest,
  onDeclineRequest,
}: FriendsListProps) => {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const handleFriendAdded = () => {
    onFriendsRefresh?.();
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* User Profile Header */}
      <div className="p-4 gradient-header">
        <div className="flex items-center gap-3">
          <button
            onClick={onEditAvatar}
            className="relative group"
          >
            <img
              src={userProfile.avatar}
              alt="My avatar"
              className="w-14 h-14 rounded-full border-3 border-white/50 shadow-soft group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/20 flex items-center justify-center transition-all">
              <Settings className="w-5 h-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-mint border-2 border-card" />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-primary-foreground">
              {userProfile.name}
            </h2>
            <button 
              onClick={onEditAvatar}
              className="text-xs text-primary-foreground/80 hover:text-primary-foreground underline"
            >
              Change avatar ✨
            </button>
          </div>
        </div>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <>
          <div className="px-4 py-2 border-b border-border bg-primary/5">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <span>📬</span>
              <span>Friend Requests ({pendingRequests.length})</span>
            </h3>
          </div>
          <div className="p-2 space-y-1 border-b border-border">
            {pendingRequests.map((request) => (
              <div
                key={request.friendshipId}
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/10"
              >
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-10 h-10 rounded-full border-2 border-primary/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate text-sm">
                    {request.name}
                  </p>
                  <p className="text-xs text-muted-foreground">wants to be friends!</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onAcceptRequest?.(request.friendshipId)}
                    className="p-2 rounded-full bg-mint hover:bg-mint/80 text-white transition-colors"
                    title="Accept"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeclineRequest?.(request.friendshipId)}
                    className="p-2 rounded-full bg-peach hover:bg-peach/80 text-white transition-colors"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sent Requests Section */}
      {sentRequests.length > 0 && (
        <>
          <div className="px-4 py-2 border-b border-border">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Pending ({sentRequests.length})</span>
            </h3>
          </div>
          <div className="p-2 space-y-1 border-b border-border">
            {sentRequests.map((request) => (
              <div
                key={request.friendshipId}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 opacity-70"
              >
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-10 h-10 rounded-full border-2 border-secondary"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate text-sm">
                    {request.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Request sent...</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Friends Label */}
      <div className="px-4 py-2 border-b border-border">
        <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <span>💬</span>
          <span>My Friends</span>
        </h3>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {friends.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No friends yet. Add some! ✨
          </p>
        )}
        {friends.map((friend) => (
          <button
            key={friend.id}
            onClick={() => onSelectFriend(friend.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
              "hover:bg-secondary active:scale-[0.98]",
              selectedFriend === friend.id && "bg-secondary shadow-soft"
            )}
          >
            {/* Avatar with status */}
            <div className="relative">
              <img
                src={friend.avatar}
                alt={friend.name}
                className={cn(
                  "w-12 h-12 rounded-full border-2 transition-all",
                  selectedFriend === friend.id 
                    ? "border-primary" 
                    : "border-secondary"
                )}
              />
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card",
                  statusColors[friend.status]
                )}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground truncate">
                  {friend.name}
                </span>
                {friend.isFavorite && (
                  <Star className="w-4 h-4 fill-primary text-primary" />
                )}
              </div>
              {friend.lastMessage && (
                <p className="text-xs text-muted-foreground truncate">
                  {friend.lastMessage}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Add Friend Button */}
      <div className="p-3 border-t border-border">
        <button 
          onClick={() => setShowAddFriend(true)}
          className="w-full py-3 rounded-xl gradient-button text-primary-foreground font-bold shadow-soft hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          + Add Friend
        </button>
      </div>

      {/* Add Friend Dialog */}
      <AddFriendDialog
        open={showAddFriend}
        onOpenChange={setShowAddFriend}
        onFriendAdded={handleFriendAdded}
      />
    </div>
  );
};
