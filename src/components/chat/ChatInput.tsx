import { useState } from "react";
import { Send, Smile, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GifPicker } from "./GifPicker";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendGif: (gifUrl: string) => void;
}

const QUICK_EMOJIS = [
  "😊", "😂", "❤️", "🎉", "👍", "🌈", "✨", "🦄",
  "🥰", "😜", "🤗", "😇", "🥳", "😻", "💕", "🌸",
  "🍭", "🎀", "⭐", "💫", "🐱", "🐰", "🦋", "🌷",
];

export const ChatInput = ({ onSendMessage, onSendGif }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiBar(false);
  };

  const handleGifSelect = (gifUrl: string) => {
    onSendGif(gifUrl);
    setShowGifPicker(false);
  };

  return (
    <div className="relative p-3 bg-card border-t border-border">
      {/* GIF Picker */}
      {showGifPicker && (
        <GifPicker 
          onSelect={handleGifSelect} 
          onClose={() => setShowGifPicker(false)} 
        />
      )}

      {/* Quick Emoji Bar */}
      {showEmojiBar && (
        <div className="absolute bottom-full left-0 right-0 mb-2 mx-3 p-3 bg-card rounded-xl shadow-card border border-border animate-slide-up">
          <div className="grid grid-cols-8 gap-2">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:scale-125 transition-transform active:scale-90 flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Emoji Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowEmojiBar(!showEmojiBar);
            setShowGifPicker(false);
          }}
          className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          <Smile className="w-6 h-6" />
        </Button>

        {/* GIF Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowGifPicker(!showGifPicker);
            setShowEmojiBar(false);
          }}
          className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          <Image className="w-6 h-6" />
        </Button>

        {/* Input */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... ✨"
          className="flex-1 rounded-full bg-muted border-0 px-4 py-6 text-base focus-visible:ring-primary"
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="rounded-full w-12 h-12 gradient-button shadow-soft hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
        >
          <Send className="w-5 h-5 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
};
