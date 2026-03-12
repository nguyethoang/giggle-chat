import { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

// Fun avatar options using DiceBear API with different seeds and styles
const AVATAR_OPTIONS = [
  // Adventurer style (cute illustrated characters)
  { seed: "Luna", bg: "ffd5dc", style: "adventurer" },
  { seed: "Star", bg: "e8d4f4", style: "adventurer" },
  { seed: "Rainbow", bg: "d4e8f4", style: "adventurer" },
  { seed: "Sunny", bg: "ffecd4", style: "adventurer" },
  { seed: "Cookie", bg: "d4f4dd", style: "adventurer" },
  { seed: "Sparkle", bg: "f4d4e8", style: "adventurer" },
  { seed: "Bubble", bg: "d4f4f4", style: "adventurer" },
  { seed: "Dreamy", bg: "f4e8d4", style: "adventurer" },
  // Fun emojis style
  { seed: "Happy", bg: "ffd5dc", style: "fun-emoji" },
  { seed: "Joy", bg: "e8d4f4", style: "fun-emoji" },
  { seed: "Love", bg: "d4e8f4", style: "fun-emoji" },
  { seed: "Cool", bg: "ffecd4", style: "fun-emoji" },
  { seed: "Cute", bg: "d4f4dd", style: "fun-emoji" },
  { seed: "Sweet", bg: "f4d4e8", style: "fun-emoji" },
  // Lorelei style (cute minimal faces)
  { seed: "Lily", bg: "ffd5dc", style: "lorelei" },
  { seed: "Rose", bg: "e8d4f4", style: "lorelei" },
  { seed: "Daisy", bg: "d4e8f4", style: "lorelei" },
  { seed: "Violet", bg: "ffecd4", style: "lorelei" },
  { seed: "Poppy", bg: "d4f4dd", style: "lorelei" },
  { seed: "Iris", bg: "f4d4e8", style: "lorelei" },
];

const getAvatarUrl = (option: typeof AVATAR_OPTIONS[0]) => 
  `https://api.dicebear.com/7.x/${option.style}/svg?seed=${option.seed}&backgroundColor=${option.bg}`;

const STYLE_LABELS: Record<string, { emoji: string; label: string }> = {
  "adventurer": { emoji: "🧑‍🎨", label: "Adventurer" },
  "fun-emoji": { emoji: "😊", label: "Emoji" },
  "lorelei": { emoji: "✨", label: "Cute" },
};

export const AvatarPicker = ({ currentAvatar, onSelect, onClose }: AvatarPickerProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [activeStyle, setActiveStyle] = useState("adventurer");

  const filteredAvatars = AVATAR_OPTIONS.filter(opt => opt.style === activeStyle);
  const styles = Object.keys(STYLE_LABELS);

  const handleSave = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-bounce-in">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-card border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 gradient-header">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
            <span className="font-bold text-primary-foreground text-lg">Pick Your Avatar!</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </Button>
        </div>

        {/* Current Avatar Preview */}
        <div className="flex flex-col items-center py-6 bg-muted/50">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt="Your avatar"
              className="w-24 h-24 rounded-full border-4 border-primary shadow-soft animate-float"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full gradient-button flex items-center justify-center shadow-soft">
              <span className="text-lg">✨</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            This is you!
          </p>
        </div>

        {/* Style Tabs */}
        <div className="flex gap-2 px-4 py-3 border-b border-border">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setActiveStyle(style)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                activeStyle === style
                  ? "gradient-button text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              )}
            >
              <span>{STYLE_LABELS[style].emoji}</span>
              <span>{STYLE_LABELS[style].label}</span>
            </button>
          ))}
        </div>

        {/* Avatar Grid */}
        <ScrollArea className="h-56">
          <div className="grid grid-cols-4 gap-3 p-4">
            {filteredAvatars.map((option) => {
              const url = getAvatarUrl(option);
              const isSelected = selectedAvatar === url;
              
              return (
                <button
                  key={`${option.style}-${option.seed}`}
                  onClick={() => setSelectedAvatar(url)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden transition-all",
                    "hover:scale-110 active:scale-95",
                    isSelected && "ring-4 ring-primary ring-offset-2 ring-offset-card"
                  )}
                >
                  <img
                    src={url}
                    alt={option.seed}
                    className="w-full h-full"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Save Button */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleSave}
            className="w-full py-6 rounded-xl gradient-button text-primary-foreground font-bold text-lg shadow-soft hover:opacity-90 transition-opacity"
          >
            Save My Avatar! 🎉
          </Button>
        </div>
      </div>
    </div>
  );
};
