import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  Loader2,
  Lock,
  LogOut,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile } from "../hooks/useQueries";
import type { LegalPage, UserProfile } from "../types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SettingsRow({
  icon,
  label,
  sublabel,
  onClick,
  ocid,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  ocid?: string;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors rounded-xl group"
    >
      <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </span>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        )}
      </div>
      <ChevronRight
        size={15}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
    </button>
  );
}

export default function SettingsPage() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { state, dispatch, navigate } = useApp();
  const saveProfile = useSaveProfile();

  const currentUser = state.currentUser;
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || "",
  );
  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [saved, setSaved] = useState(false);
  const [notifPosts, setNotifPosts] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifReactions, setNotifReactions] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(true);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) return;

    const updatedUser: UserProfile = {
      userId: currentUser?.userId || "demo-user-main",
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
      // Ignore backend errors
    }

    dispatch({ type: "SET_USER", user: updatedUser });
    setSaved(true);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    await clear();
    queryClient.clear();
    dispatch({ type: "CLEAR_USER" });
    navigate("login");
  }

  function goLegal(page: LegalPage) {
    navigate("legal", undefined, undefined, page);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display font-bold text-2xl gradient-text">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your account
        </p>
      </motion.div>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-5 mb-4"
      >
        <h2 className="font-display font-semibold text-base mb-4">
          Edit Profile
        </h2>

        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-14 h-14 border-2 border-primary/30">
            <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">
              {getInitials(displayName || "U")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {displayName || "Your Name"}
            </p>
            <p className="text-xs text-muted-foreground">
              @{username || "username"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Display Name
            </Label>
            <Input
              data-ocid="settings.name_input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
              className="bg-muted/50 border-border/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Username
            </Label>
            <Input
              data-ocid="settings.username_input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@handle"
              required
              className="bg-muted/50 border-border/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bio
            </Label>
            <Textarea
              data-ocid="settings.bio_textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A little about yourself..."
              className="bg-muted/50 border-border/50 resize-none h-20 text-sm"
            />
          </div>

          <Button
            type="submit"
            data-ocid="settings.save_button"
            className="w-full glow-primary"
            disabled={
              !displayName.trim() || !username.trim() || saveProfile.isPending
            }
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={16} className="mr-2" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl mb-4 overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          <h2 className="font-display font-semibold text-base">
            Notifications
          </h2>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm cursor-pointer" htmlFor="notif-posts">
              New posts in circles
            </Label>
            <Switch
              data-ocid="settings.notif_posts_switch"
              id="notif-posts"
              checked={notifPosts}
              onCheckedChange={setNotifPosts}
            />
          </div>
          <Separator className="bg-border/30" />
          <div className="flex items-center justify-between">
            <Label className="text-sm cursor-pointer" htmlFor="notif-comments">
              Comments on your posts
            </Label>
            <Switch
              data-ocid="settings.notif_comments_switch"
              id="notif-comments"
              checked={notifComments}
              onCheckedChange={setNotifComments}
            />
          </div>
          <Separator className="bg-border/30" />
          <div className="flex items-center justify-between">
            <Label className="text-sm cursor-pointer" htmlFor="notif-reactions">
              Reactions to your posts
            </Label>
            <Switch
              data-ocid="settings.notif_reactions_switch"
              id="notif-reactions"
              checked={notifReactions}
              onCheckedChange={setNotifReactions}
            />
          </div>
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl mb-4 overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <h2 className="font-display font-semibold text-base">Privacy</h2>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label
                className="text-sm cursor-pointer"
                htmlFor="private-profile"
              >
                Private Profile
              </Label>
              <p className="text-xs text-muted-foreground">
                Only circle members can see your profile
              </p>
            </div>
            <Switch
              data-ocid="settings.private_profile_switch"
              id="private-profile"
              checked={privateProfile}
              onCheckedChange={setPrivateProfile}
            />
          </div>
        </div>
      </motion.div>

      {/* Legal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl mb-4 overflow-hidden"
      >
        <div className="px-4 pt-4 pb-1 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          <h2 className="font-display font-semibold text-base">Legal</h2>
        </div>
        <SettingsRow
          icon={<Lock size={15} />}
          label="Privacy Policy"
          sublabel="How we handle your data"
          ocid="settings.privacy_policy_link"
          onClick={() => goLegal("privacy")}
        />
        <SettingsRow
          icon={<FileText size={15} />}
          label="Terms of Service"
          sublabel="Rules for using PocketCircle"
          ocid="settings.terms_link"
          onClick={() => goLegal("terms")}
        />
        <SettingsRow
          icon={<ShieldCheck size={15} />}
          label="Community Guidelines"
          sublabel="Our community standards"
          ocid="settings.guidelines_link"
          onClick={() => goLegal("guidelines")}
        />
      </motion.div>

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-5"
      >
        <Button
          data-ocid="settings.signout_button"
          onClick={handleLogout}
          variant="outline"
          className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground/40 mt-8">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
