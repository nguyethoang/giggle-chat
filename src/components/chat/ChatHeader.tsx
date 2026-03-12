import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  friendName: string;
  friendAvatar: string;
  friendStatus: "online" | "offline" | "busy";
  onBack?: () => void;
}

const statusText = {
  online: "Online ✨",
  offline: "Offline",
  busy: "Busy 🎮",
};

export const ChatHeader = ({ friendName, friendAvatar, friendStatus, onBack }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 gradient-header shadow-soft">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        <img
          src={friendAvatar}
          alt={friendName}
          className="w-11 h-11 rounded-full border-2 border-white/50"
        />
        
        <div>
          <h3 className="font-bold text-primary-foreground text-lg">
            {friendName}
          </h3>
          <span className="text-xs text-primary-foreground/80">
            {statusText[friendStatus]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground"
        >
          <Phone className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground"
        >
          <Video className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
