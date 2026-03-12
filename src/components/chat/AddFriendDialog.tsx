import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFriendAdded: () => void;
}

interface SearchResult {
  user_id: string;
  display_name: string;
  avatar_url: string;
  status: string;
}

export const AddFriendDialog = ({ open, onOpenChange, onFriendAdded }: AddFriendDialogProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [adding, setAdding] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;

    setSearching(true);
    setResults([]);

    try {
      // Search profiles by display_name (case-insensitive partial match)
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, status")
        .neq("user_id", user.id)
        .ilike("display_name", `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      // Filter out existing friends and pending requests (in both directions)
      const { data: existingFriendships } = await supabase
        .from("friendships")
        .select("user_id, friend_id")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      const existingUserIds = new Set<string>();
      existingFriendships?.forEach((f) => {
        existingUserIds.add(f.user_id);
        existingUserIds.add(f.friend_id);
      });

      const filteredResults = (data || []).filter(
        (profile) => !existingUserIds.has(profile.user_id)
      );

      setResults(filteredResults);

      if (filteredResults.length === 0) {
        toast.info("No users found with that name");
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (friendUserId: string) => {
    if (!user) return;

    setAdding(friendUserId);

    try {
      const { error } = await supabase.from("friendships").insert({
        user_id: user.id,
        friend_id: friendUserId,
      });

      if (error) throw error;

      toast.success("Friend request sent! 📨");
      setResults((prev) => prev.filter((r) => r.user_id !== friendUserId));
      onFriendAdded();
    } catch (error: any) {
      console.error("Add friend error:", error);
      toast.error("Failed to add friend");
    } finally {
      setAdding(null);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Add a Friend! 🌟
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 rounded-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="rounded-full"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.length === 0 && !searching && (
              <p className="text-center text-muted-foreground text-sm py-4">
                Search for friends by their display name ✨
              </p>
            )}

            {results.map((profile) => (
              <div
                key={profile.user_id}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-10 h-10 rounded-full border-2 border-primary/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">
                    {profile.display_name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profile.status}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddFriend(profile.user_id)}
                  disabled={adding === profile.user_id}
                  className="rounded-full"
                >
                  {adding === profile.user_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
