import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Edit2, Loader2, Settings, Users } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { toast } from "sonner";
import { useApp, useDemoUserId } from "../context/AppContext";
import { useStorageUpload } from "../hooks/useStorageUpload";

export default function ProfilePage() {
  const { state, navigate, dispatch } = useApp();
  const currentUserId = useDemoUserId();
  const { currentUser, circles, posts } = state;
  const { uploadImage, isUploading } = useStorageUpload();
  const avatarRef = useRef<HTMLInputElement>(null);

  const myCircles = circles.filter((c) => c.memberIds.includes(currentUserId));
  const myPosts = posts.filter((p) => p.authorId === currentUserId);

  const displayName = currentUser?.displayName || "Demo User";
  const username = currentUser?.username || "you";
  const bio = currentUser?.bio || "Welcome to PocketCircle! 🌟";
  const initials = currentUser?.initials || "DU";
  const avatarUrl = currentUser?.avatarUrl;

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    try {
      const url = await uploadImage(file);
      dispatch({ type: "SET_USER", user: { ...currentUser, avatarUrl: url } });
      toast.success("Profile photo updated!");
    } catch {
      toast.error("Failed to upload photo");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl gradient-text">
          Profile
        </h1>
        <Button
          data-ocid="profile.edit_button"
          onClick={() => navigate("settings")}
          variant="outline"
          size="sm"
          className="gap-2 border-border/50"
        >
          <Edit2 size={14} />
          Edit
        </Button>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          {/* Clickable avatar */}
          <div className="relative flex-shrink-0">
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              data-ocid="profile.upload_button"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="relative block rounded-full focus:outline-none focus:ring-2 focus:ring-primary/60"
              aria-label="Change profile photo"
            >
              <Avatar className="w-16 h-16 border-2 border-primary/30">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Upload overlay */}
              {isUploading ? (
                <span className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <Loader2 size={20} className="text-white animate-spin" />
                </span>
              ) : (
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                  <Camera size={11} className="text-white" />
                </span>
              )}
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-xl">{displayName}</h2>
            <p className="text-sm text-muted-foreground">@{username}</p>
            {bio && (
              <p className="text-sm mt-2 leading-relaxed text-foreground/80">
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-border/30">
          {[
            { label: "Circles", value: myCircles.length },
            { label: "Posts", value: myPosts.length },
            {
              label: "Friends",
              value: new Set(myCircles.flatMap((c) => c.memberIds)).size - 1,
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-2xl gradient-text">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* My circles */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Users size={14} />
          My Circles
        </h3>
        <div className="space-y-2">
          {myCircles.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No circles yet
            </p>
          ) : (
            myCircles.map((c) => (
              <div
                key={c.id}
                className="glass rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-xl">{c.emoji || "✨"}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.memberIds.length} members
                  </p>
                </div>
                {c.adminId === currentUserId && (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/30 text-primary"
                  >
                    Admin
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings link */}
      <button
        type="button"
        onClick={() => navigate("settings")}
        className="w-full glass rounded-xl p-4 flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings size={18} />
        <span className="text-sm">Account Settings</span>
      </button>
    </div>
  );
}
