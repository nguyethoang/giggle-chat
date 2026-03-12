import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isSent: boolean;
  timestamp: string;
  avatar?: string;
  senderName?: string;
  isGif?: boolean;
}

export const ChatBubble = ({ 
  message, 
  isSent, 
  timestamp, 
  avatar, 
  senderName,
  isGif 
}: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex gap-2 mb-4 animate-slide-up",
        isSent ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isSent && avatar && (
        <img
          src={avatar}
          alt={senderName}
          className="w-10 h-10 rounded-full border-2 border-secondary shadow-soft"
        />
      )}
      
      <div className={cn("flex flex-col max-w-[70%]", isSent ? "items-end" : "items-start")}>
        {!isSent && senderName && (
          <span className="text-xs font-semibold text-muted-foreground mb-1 px-2">
            {senderName}
          </span>
        )}
        
        <div
          className={cn(
            "px-4 py-3 rounded-bubble shadow-bubble transition-all hover:scale-[1.02]",
            isSent 
              ? "bubble-sent rounded-br-md" 
              : "bubble-received rounded-bl-md",
            isGif && "p-2 bg-transparent shadow-none"
          )}
        >
          {isGif ? (
            <img 
              src={message} 
              alt="GIF" 
              className="rounded-lg max-w-full max-h-48 object-contain"
            />
          ) : (
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          )}
        </div>
        
        <span className="text-[10px] text-muted-foreground mt-1 px-2">
          {timestamp}
        </span>
      </div>
    </div>
  );
};
