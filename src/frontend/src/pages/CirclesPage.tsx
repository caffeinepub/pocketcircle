import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ModalPortal from "../components/ModalPortal";
import { useApp, useDemoUserId } from "../context/AppContext";
import type { Circle } from "../types";

const CIRCLE_EMOJIS = [
  "🏡",
  "✨",
  "🚀",
  "🎯",
  "💎",
  "🌊",
  "🔥",
  "🌸",
  "🎉",
  "🌙",
];

function CircleCard({ circle, index }: { circle: Circle; index: number }) {
  const { state, navigate } = useApp();
  const currentUserId = useDemoUserId();
  const posts = state.posts.filter((p) => p.circleId === circle.id);
  const isAdmin = circle.adminId === currentUserId;
  const ocidIndex = index + 1;

  return (
    <motion.button
      data-ocid={`circles.item.${ocidIndex}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => navigate("circle", circle.id)}
      className="glass rounded-2xl p-5 text-left hover:border-primary/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] w-full group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-2xl group-hover:glow-sm transition-all">
          {circle.emoji || "✨"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base truncate">
              {circle.name}
            </h3>
            {isAdmin && (
              <Badge
                variant="outline"
                className="text-[10px] border-primary/30 text-primary py-0 h-4"
              >
                Admin
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {circle.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={11} />
              {circle.memberIds.length} member
              {circle.memberIds.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function CirclesPage() {
  const { state, dispatch, navigate } = useApp();
  const currentUserId = useDemoUserId();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(CIRCLE_EMOJIS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const myCircles = state.circles.filter((c) =>
    c.memberIds.includes(currentUserId),
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);

    setTimeout(() => {
      const circle: Circle = {
        id: `circle-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        adminId: currentUserId,
        memberIds: [currentUserId],
        createdAt: Date.now(),
        emoji: selectedEmoji,
      };
      dispatch({ type: "ADD_CIRCLE", circle });
      toast.success(`"${name}" circle created!`);
      setShowCreate(false);
      setName("");
      setDescription("");
      setIsCreating(false);
      navigate("circle", circle.id);
    }, 400);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl gradient-text">
            My Circles
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {myCircles.length} private circle{myCircles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          data-ocid="circles.create_button"
          onClick={() => setShowCreate(true)}
          size="sm"
          className="gap-2 glow-sm"
        >
          <Plus size={16} />
          New Circle
        </Button>
      </div>

      {/* Circles list */}
      <div data-ocid="circles.list" className="space-y-3">
        {myCircles.length === 0 ? (
          <div
            data-ocid="circles.empty_state"
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl">
              ✨
            </div>
            <div>
              <p className="font-semibold">No circles yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first circle!
              </p>
            </div>
          </div>
        ) : (
          myCircles.map((circle, i) => (
            <CircleCard key={circle.id} circle={circle} index={i} />
          ))
        )}
      </div>

      {/* Create circle modal — rendered in modal-root via portal */}
      {showCreate && (
        <ModalPortal onClose={() => setShowCreate(false)}>
          <motion.div
            initial={{ y: 60, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 60, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-strong w-full max-w-md rounded-3xl md:rounded-2xl overflow-hidden shadow-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <h2 className="font-display font-bold text-xl">
                Create a Circle
              </h2>
              <button
                type="button"
                data-ocid="circles.create_modal_close"
                onClick={() => setShowCreate(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Emoji picker */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Circle Icon
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {CIRCLE_EMOJIS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-14 h-14 rounded-2xl text-2xl transition-all ${
                        selectedEmoji === emoji
                          ? "bg-primary/20 border-2 border-primary/50 scale-110 shadow-sm"
                          : "glass hover:bg-muted/60 border border-border/30"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Circle Name
                </Label>
                <Input
                  data-ocid="circles.name_input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunday Squad"
                  required
                  className="h-12 bg-muted/50 border-border/50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  data-ocid="circles.description_input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this circle about?"
                  className="bg-muted/50 border-border/50 resize-none h-24 text-sm"
                />
              </div>

              <Button
                type="submit"
                data-ocid="circles.create_submit_button"
                className="w-full h-12 glow-primary text-base font-semibold"
                disabled={!name.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "✨ Create Circle"
                )}
              </Button>
            </form>
          </motion.div>
        </ModalPortal>
      )}
    </div>
  );
}
