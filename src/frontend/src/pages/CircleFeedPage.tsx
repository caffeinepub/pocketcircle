import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Copy,
  Loader2,
  Plus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CreatePostModal from "../components/CreatePostModal";
import MemoryTimeline from "../components/MemoryTimeline";
import ModalPortal from "../components/ModalPortal";
import PostCard from "../components/PostCard";
import { useApp } from "../context/AppContext";
import { useGenerateInviteCode } from "../hooks/useQueries";

export default function CircleFeedPage() {
  const { state, nav, navigate } = useApp();
  const generateCode = useGenerateInviteCode();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");

  const circleId = nav.selectedCircleId;
  const circle = state.circles.find((c) => c.id === circleId);

  const circlePosts = useMemo(
    () =>
      state.posts
        .filter((p) => p.circleId === circleId)
        .sort((a, b) => b.timestamp - a.timestamp),
    [state.posts, circleId],
  );

  async function handleGenerateInvite() {
    try {
      const code = await generateCode.mutateAsync();
      const link = `${window.location.origin}?invite=${code}`;
      setInviteLink(link);
    } catch {
      const link = `${window.location.origin}?invite=DEMO-${Date.now()}`;
      setInviteLink(link);
    }
  }

  async function handleCopyLink() {
    const link =
      inviteLink || `${window.location.origin}?invite=DEMO-${circle?.id}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    toast.success("Invite link copied!");
  }

  // Demo: search against all circle members
  const searchResults = useMemo(() => {
    if (!usernameSearch.trim() || !circle) return [];
    const query = usernameSearch.toLowerCase();
    // Simulate some demo users
    const demoUsers = [
      { id: "user-alex", name: "Alex Chen", username: "alexc" },
      { id: "user-maya", name: "Maya Rivera", username: "mayar" },
      { id: "user-sam", name: "Sam Torres", username: "samt" },
      { id: "user-jordan", name: "Jordan Lee", username: "jordanl" },
    ];
    return demoUsers.filter(
      (u) =>
        (u.username.includes(query) || u.name.toLowerCase().includes(query)) &&
        !circle.memberIds.includes(u.id),
    );
  }, [usernameSearch, circle]);

  if (!circle) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground">Circle not found.</p>
        <Button
          onClick={() => navigate("circles")}
          variant="ghost"
          className="mt-4"
        >
          Back to Circles
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <button
          type="button"
          onClick={() => navigate("circles")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-3xl">
              {circle.emoji || "✨"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl">{circle.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {circle.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs border-border/50">
                  <Users size={10} className="mr-1" />
                  {circle.memberIds.length} members
                </Badge>
                <Badge variant="outline" className="text-xs border-border/50">
                  {circlePosts.length} posts
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              data-ocid="circle.create_post_button"
              onClick={() => setShowCreatePost(true)}
              size="sm"
              className="flex-1 gap-2 glow-sm"
            >
              <Plus size={14} />
              Share
            </Button>
            <Button
              data-ocid="circle.invite_button"
              onClick={() => {
                setShowInvite(true);
                handleGenerateInvite();
              }}
              size="sm"
              variant="outline"
              className="gap-2 border-border/50"
            >
              <UserPlus size={14} />
              Invite
            </Button>
            <Button
              data-ocid="circle.timeline_toggle"
              onClick={() => setShowTimeline((v) => !v)}
              size="sm"
              variant={showTimeline ? "default" : "outline"}
              className={`gap-2 border-border/50 ${
                showTimeline ? "glow-sm" : ""
              }`}
            >
              <Calendar size={14} />
              Timeline
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {showTimeline ? (
        <MemoryTimeline posts={circlePosts} />
      ) : (
        <div className="space-y-4">
          {circlePosts.length === 0 ? (
            <div
              data-ocid="circle.feed_empty_state"
              className="flex flex-col items-center gap-4 py-16 text-center"
            >
              <div className="text-4xl">{circle.emoji || "✨"}</div>
              <div>
                <p className="font-semibold">No moments yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to share something!
                </p>
              </div>
              <Button
                onClick={() => setShowCreatePost(true)}
                size="sm"
                className="gap-2 glow-sm"
              >
                <Plus size={14} />
                Share First Moment
              </Button>
            </div>
          ) : (
            circlePosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))
          )}
        </div>
      )}

      {/* Create post modal */}
      {showCreatePost && (
        <CreatePostModal
          circleId={circle.id}
          onClose={() => setShowCreatePost(false)}
        />
      )}

      {/* Invite friends modal */}
      {showInvite && (
        <ModalPortal onClose={() => setShowInvite(false)}>
          <motion.div
            data-ocid="circle.invite_modal"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-strong w-full max-w-md rounded-3xl md:rounded-2xl overflow-hidden shadow-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border/30">
              <h2 className="font-display font-bold text-lg">Invite Friends</h2>
              <button
                type="button"
                data-ocid="circle.invite_modal_close"
                onClick={() => setShowInvite(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <Tabs defaultValue="link">
                <TabsList className="w-full mb-5">
                  <TabsTrigger
                    value="link"
                    className="flex-1"
                    data-ocid="circle.invite_link_tab"
                  >
                    Invite Link
                  </TabsTrigger>
                  <TabsTrigger
                    value="username"
                    className="flex-1"
                    data-ocid="circle.invite_username_tab"
                  >
                    Add by Username
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Share this link with friends to invite them to{" "}
                    <strong>{circle.name}</strong>.
                  </p>

                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={
                        inviteLink ||
                        (generateCode.isPending
                          ? "Generating link..."
                          : `${window.location.origin}?invite=DEMO-${circle.id}`)
                      }
                      className="flex-1 h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs text-muted-foreground focus:outline-none"
                    />
                    <Button
                      data-ocid="circle.copy_link_button"
                      onClick={handleCopyLink}
                      size="sm"
                      className="h-11 px-4 gap-2 glow-sm"
                      disabled={generateCode.isPending}
                    >
                      {generateCode.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Copy size={14} />
                      )}
                      Copy
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="username" className="space-y-4">
                  <div className="relative">
                    <Input
                      data-ocid="circle.username_search_input"
                      value={usernameSearch}
                      onChange={(e) => setUsernameSearch(e.target.value)}
                      placeholder="Search by username or name..."
                      className="h-12 bg-muted/50 border-border/50 pl-4"
                    />
                  </div>

                  <div className="space-y-2">
                    {usernameSearch.trim() === "" ? (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        Type a username to search
                      </p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        No users found
                      </p>
                    ) : (
                      searchResults.map((user, i) => (
                        <div
                          key={user.id}
                          data-ocid={`circle.search_result.item.${i + 1}`}
                          className="flex items-center gap-3 p-3 rounded-xl glass"
                        >
                          <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{user.username}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 border-primary/30 text-primary"
                            onClick={() => {
                              toast.success(`Invite sent to ${user.name}!`);
                              setUsernameSearch("");
                            }}
                          >
                            Invite
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </ModalPortal>
      )}
    </div>
  );
}
