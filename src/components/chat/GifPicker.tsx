import { useState } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GifPickerProps {
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
}

// Fun sample GIFs organized by category
const FUNNY_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDRyZXJ0ZHE5OW5wdXVyZ3hqNXRiZjB1Ynp6OHNhZHJxMGxsYTBtZyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif",
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
  "https://media.giphy.com/media/l0HlQXkh1wx1RjtUA/giphy.gif",
  "https://media.giphy.com/media/3ohs7O2afZDtxSgfGU/giphy.gif",
  "https://media.giphy.com/media/l4KhPbIIDgO3sMw0w/giphy.gif",
  "https://media.giphy.com/media/ZqlvCTNHpqrio/giphy.gif",
  "https://media.giphy.com/media/3oEjHI8WJv4x6UPDB6/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/l2JhtKtDWYNKdRpoA/giphy.gif",
  "https://media.giphy.com/media/3oEdv6sy3ulljPMGdy/giphy.gif",
];

const PARTY_GIFS = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
  "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif",
  "https://media.giphy.com/media/s2qXK8wAvkHTO/giphy.gif",
  "https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif",
  "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif",
  "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif",
  "https://media.giphy.com/media/g5R9dok94mrIvplmZd/giphy.gif",
  "https://media.giphy.com/media/l46CbAuxFk2Cz0s2A/giphy.gif",
  "https://media.giphy.com/media/l0HlN5Y28D9MzzcRy/giphy.gif",
  "https://media.giphy.com/media/26BGIqWh2R1fi6JDa/giphy.gif",
  "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif",
];

const LOVE_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGN0OXl0MW5ranI1ZHV6anVkNDRyYWttcjRkN3Z6eG9rZGF2cG9pZyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/xUPGcyi4YBbRxgXqMg/giphy.gif",
  "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif",
  "https://media.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif",
  "https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif",
  "https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/l3V0B6ICVWbg8Xi5q/giphy.gif",
  "https://media.giphy.com/media/26vUxJ9rqfwuIEkTu/giphy.gif",
  "https://media.giphy.com/media/3ohhwoWSCtJzznXbuo/giphy.gif",
  "https://media.giphy.com/media/l0HlxJMw7rkPTN8sg/giphy.gif",
];

const GREETING_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnRyY3dxcHkxMTZnNGxldzB1NnY1M2tzbmFhc2NhOGVvMDloeTQ0cCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3ornk57KwDXf81rjWM/giphy.gif",
  "https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif",
  "https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif",
  "https://media.giphy.com/media/3oEdv07JHz7FFIwpyg/giphy.gif",
  "https://media.giphy.com/media/xT9IgBwI5SLzZGV2PC/giphy.gif",
  "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
  "https://media.giphy.com/media/3o7TKU8RvQuomFfUUU/giphy.gif",
  "https://media.giphy.com/media/Vbtc9VG51NtzT1Qnv1/giphy.gif",
  "https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.gif",
  "https://media.giphy.com/media/l0MYryZTmQgvHI5kA/giphy.gif",
];

const SAD_GIFS = [
  "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif",
  "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
  "https://media.giphy.com/media/l2JhtKtDWYNKdRpoA/giphy.gif",
  "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif",
  "https://media.giphy.com/media/k61nOBRRBMxva/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif",
  "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
  "https://media.giphy.com/media/3o6wrvdHFbwBrUFenu/giphy.gif",
  "https://media.giphy.com/media/YLgIOmtIMUACY/giphy.gif",
  "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
  "https://media.giphy.com/media/l41YtZOb9EUABnuqA/giphy.gif",
];

const EXCITED_GIFS = [
  "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/IwAZ6dvvvaTtdI8SD5/giphy.gif",
  "https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif",
  "https://media.giphy.com/media/l0HlN5Y28D9MzzcRy/giphy.gif",
  "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif",
  "https://media.giphy.com/media/yoJC2GnSClbPOkV0eA/giphy.gif",
  "https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif",
  "https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif",
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
  "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif",
  "https://media.giphy.com/media/31lPv5L3aIvTi/giphy.gif",
];

const CATEGORIES = [
  { emoji: "😂", label: "Funny", gifs: FUNNY_GIFS },
  { emoji: "🎉", label: "Party", gifs: PARTY_GIFS },
  { emoji: "💖", label: "Love", gifs: LOVE_GIFS },
  { emoji: "👋", label: "Hi!", gifs: GREETING_GIFS },
  { emoji: "😢", label: "Sad", gifs: SAD_GIFS },
  { emoji: "🤩", label: "Excited", gifs: EXCITED_GIFS },
];

export const GifPicker = ({ onSelect, onClose }: GifPickerProps) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const displayGifs = search 
    ? CATEGORIES
        .filter(cat => cat.label.toLowerCase().includes(search.toLowerCase()))
        .flatMap(cat => cat.gifs)
    : CATEGORIES[activeCategory].gifs;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border gradient-header">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
          <span className="font-bold text-primary-foreground">GIFs</span>
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

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for GIFs..."
            className="pl-10 rounded-full bg-muted border-0 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Categories */}
      {!search && (
        <div className="flex gap-2 px-3 pb-2 overflow-x-auto">
          {CATEGORIES.map((cat, index) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(index)}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold
                transition-all whitespace-nowrap
                ${activeCategory === index 
                  ? "gradient-button text-primary-foreground shadow-soft" 
                  : "bg-muted text-muted-foreground hover:bg-secondary"
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* GIF Grid */}
      <ScrollArea className="h-64">
        <div className="grid grid-cols-3 gap-2 p-3">
          {displayGifs.map((gif, index) => (
            <button
              key={index}
              onClick={() => onSelect(gif)}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted hover:scale-105 transition-transform active:scale-95"
            >
              <img
                src={gif}
                alt="GIF"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
