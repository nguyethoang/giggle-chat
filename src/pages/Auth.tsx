import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AVATAR_STYLES = [
  { name: "Adventurer", seed: "adventurer" },
  { name: "Emoji", seed: "emoji" },
  { name: "Cute", seed: "lorelei" },
];

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${Date.now()}&backgroundColor=ffd5dc`
  );
  const [loading, setLoading] = useState(false);

  const generateRandomAvatar = (style: string) => {
    const randomSeed = Math.random().toString(36).substring(7);
    const colors = ["ffd5dc", "d4f4dd", "e8d4f4", "ffecd4", "d4e8f4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${randomSeed}&backgroundColor=${randomColor}`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: displayName || "New Friend ✨",
              avatar_url: selectedAvatar,
            },
          },
        });

        if (error) throw error;
        toast.success("Welcome! 🎉 You're all set to chat!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Welcome back! 💫");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender via-background to-sky p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">💬✨</div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            {isSignUp ? "Join the Fun! 🎉" : "Welcome Back! 💫"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account to start chatting" : "Sign in to continue chatting"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="bg-card rounded-3xl p-6 shadow-card space-y-4">
          {isSignUp && (
            <>
              {/* Avatar Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Pick Your Avatar! 🦄</label>
                <div className="flex justify-center">
                  <img
                    src={selectedAvatar}
                    alt="Selected avatar"
                    className="w-24 h-24 rounded-full border-4 border-primary shadow-soft"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  {AVATAR_STYLES.map((style) => (
                    <Button
                      key={style.seed}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAvatar(generateRandomAvatar(style.seed))}
                      className="rounded-full text-xs"
                    >
                      {style.name} 🎲
                    </Button>
                  ))}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Your Name ✨</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Luna 🌙"
                  className="rounded-full"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Email 📧</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="rounded-full"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Password 🔐</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-full"
              required
              minLength={6}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full gradient-button text-primary-foreground font-bold py-6 shadow-soft"
          >
            {loading ? "Loading... ⏳" : isSignUp ? "Create Account! 🚀" : "Sign In! ✨"}
          </Button>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
