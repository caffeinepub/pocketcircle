import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile } from "../hooks/useQueries";
import type { UserProfile } from "../types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function OnboardingPage() {
  const { identity } = useInternetIdentity();
  const { dispatch, navigate } = useApp();
  const saveProfile = useSaveProfile();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) return;

    const userId = identity?.getPrincipal().toString() || `user-${Date.now()}`;

    const userProfile: UserProfile = {
      userId,
      displayName: displayName.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, "_"),
      bio: bio.trim(),
      initials: getInitials(displayName.trim()),
    };

    try {
      await saveProfile.mutateAsync({
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatarBlobId: undefined,
      });
    } catch {
      // Ignore backend errors for now - local state is primary
    }

    dispatch({ type: "SET_USER", user: userProfile });
    toast.success(`Welcome to PocketCircle, ${displayName}!`);
    navigate("home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "oklch(0.65 0.22 290)",
            top: "-10%",
            right: "-10%",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl gradient-text">
            Set up your profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            Let your circles know who you are
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-5 space-y-4"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="displayName"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              required
              className="bg-muted/50 border-border/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="username"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@yourhandle"
              required
              className="bg-muted/50 border-border/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="bio"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Bio <span className="normal-case font-normal">(optional)</span>
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A little about yourself..."
              className="bg-muted/50 border-border/50 resize-none text-sm h-20"
            />
          </div>

          <Button
            type="submit"
            data-ocid="onboarding.submit_button"
            className="w-full glow-primary"
            disabled={
              !displayName.trim() || !username.trim() || saveProfile.isPending
            }
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Setting up...
              </>
            ) : (
              "Enter PocketCircle ✨"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
