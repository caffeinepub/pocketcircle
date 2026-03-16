import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Flag,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Send,
  ShieldOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp, useDemoUserId } from "../context/AppContext";
import type { Comment, Post } from "../types";

const REACTIONS = [
  "\u2764\uFE0F",
  "\uD83D\uDD25",
  "\uD83D\uDE02",
  "\uD83D\uDC4D",
  "\uD83D\uDE2E",
  "\uD83C\uDF89",
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface BigReactionProps {
  emoji: string;
  onDone: () => void;
}

function BigReaction({ emoji, onDone }: BigReactionProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-[100px] select-none"
        initial={{ scale: 0.2, y: 100, opacity: 0 }}
        animate={{ scale: 1.5, y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "backOut" }}
        onAnimationComplete={() => {
          setTimeout(onDone, 1400);
        }}
      />
      <motion.span
        className="text-[100px] select-none absolute"
        initial={{ scale: 1.5, y: 0, opacity: 1 }}
        animate={{ scale: 3, y: -200, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeIn", delay: 0.4 }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
}

function PhotoImage({ src }: { src: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="w-full overflow-hidden rounded-none">
      {errored ? (
        <div className="w-full h-48 flex flex-col items-center justify-center gap-2 bg-muted/30 text-muted-foreground">
          <ImageIcon size={28} />
          <span className="text-xs">Photo unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt="Shared moment"
          className="w-full h-64 object-cover"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const { dispatch } = useApp();
  const currentUserId = useDemoUserId();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [bigReactionEmoji, setBigReactionEmoji] = useState<string | null>(null);
  const [bigReactionKey, setBigReactionKey] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ocidIndex = index + 1;

  const handleReaction = useCallback(
    (emoji: string) => {
      dispatch({
        type: "TOGGLE_REACTION",
        postId: post.id,
        emoji,
        userId: currentUserId,
      });
    },
    [dispatch, post.id, currentUserId],
  );

  function triggerBigReaction(emoji: string) {
    setBigReactionEmoji(emoji);
    setBigReactionKey((k) => k + 1);
    handleReaction(emoji);
    setShowReactionPicker(false);
  }

  function handleReactionPointerDown(emoji: string) {
    longPressTimer.current = setTimeout(() => {
      triggerBigReaction(emoji);
    }, 500);
  }

  function handleReactionPointerUp() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      authorId: currentUserId,
      authorName: "You",
      authorInitials: "YO",
      content: commentText.trim(),
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_COMMENT", postId: post.id, comment });
    setCommentText("");
    setIsSubmitting(false);
  }

  function handleReport() {
    setIsReported(true);
    setShowMenu(false);
    toast.success("Post reported and hidden. Circle admin has been notified.");
  }

  function handleBlock() {
    setShowMenu(false);
    toast.success(`Blocked ${post.authorName}`);
  }

  const totalReactions = Object.values(post.reactions).reduce(
    (acc, ids) => acc + ids.length,
    0,
  );

  if (isReported) {
    return (
      <div
        data-ocid={`home.post_card.item.${ocidIndex}`}
        className="glass rounded-2xl p-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Post hidden after report.
        </p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {bigReactionEmoji && (
          <BigReaction
            key={bigReactionKey}
            emoji={bigReactionEmoji}
            onDone={() => setBigReactionEmoji(null)}
          />
        )}
      </AnimatePresence>

      {/* Reaction picker overlay */}
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReactionPicker(false)}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
              }}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative glass-strong rounded-3xl p-5 shadow-glass"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs text-muted-foreground text-center mb-4 font-semibold uppercase tracking-widest">
                Hold for BIG reaction
              </p>
              <div className="flex gap-3">
                {REACTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    data-ocid="post.big_reaction_button"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onPointerDown={() => handleReactionPointerDown(emoji)}
                    onPointerUp={handleReactionPointerUp}
                    onPointerLeave={handleReactionPointerUp}
                    onClick={() => {
                      handleReaction(emoji);
                      setShowReactionPicker(false);
                    }}
                    className="text-4xl w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-primary/20 transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.article
        id={post.id}
        data-ocid={`home.post_card.item.${ocidIndex}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="glass rounded-2xl overflow-hidden shadow-glass"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <Avatar className="w-10 h-10 border border-primary/20">
            {post.authorAvatar && (
              <img src={post.authorAvatar} alt={post.authorName} />
            )}
            <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
              {post.authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {timeAgo(post.timestamp)}
            </p>
          </div>
          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              data-ocid="post.menu_button"
              onClick={() => setShowMenu((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: -4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-44 glass-strong rounded-2xl shadow-glass overflow-hidden z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    data-ocid="post.report_button"
                    onClick={handleReport}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/80 hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    <Flag size={14} className="text-muted-foreground" />
                    Report Post
                  </button>
                  <button
                    type="button"
                    data-ocid="post.block_button"
                    onClick={handleBlock}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <ShieldOff size={14} />
                    Block User
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        {post.text && (
          <p className="px-4 pb-3 text-sm leading-relaxed text-foreground/90">
            {post.text}
          </p>
        )}

        {/* Photo */}
        {post.photoUrl && <PhotoImage src={post.photoUrl} />}

        {/* Reactions */}
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {REACTIONS.map((emoji) => {
              const users = post.reactions[emoji] || [];
              const hasReacted = users.includes(currentUserId);
              return (
                <button
                  type="button"
                  key={emoji}
                  data-ocid="post.reaction_button"
                  onClick={() => handleReaction(emoji)}
                  className={`reaction-pill ${hasReacted ? "active" : ""}`}
                >
                  <span>{emoji}</span>
                  {users.length > 0 && (
                    <span
                      className={`text-xs font-medium ${hasReacted ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {users.length}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              data-ocid="post.reaction_picker_button"
              onClick={() => setShowReactionPicker(true)}
              className="reaction-pill text-muted-foreground hover:text-foreground text-base leading-none"
            >
              +
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {totalReactions > 0 &&
                `${totalReactions} reaction${totalReactions !== 1 ? "s" : ""}`}
            </span>
            <button
              type="button"
              data-ocid="post.comment_toggle"
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle size={14} />
              <span>
                {post.comments.length} comment
                {post.comments.length !== 1 ? "s" : ""}
              </span>
              {showComments ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
          </div>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/30"
            >
              <div className="p-4 space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                        {comment.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="glass rounded-xl px-3 py-2">
                        <p className="text-xs font-semibold mb-0.5">
                          {comment.authorName}
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">
                        {timeAgo(comment.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
                  <Input
                    data-ocid="post.comment_input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 h-8 text-xs bg-muted/50 border-border/50"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    data-ocid="post.comment_submit_button"
                    className="h-8 w-8 p-0"
                    disabled={!commentText.trim() || isSubmitting}
                  >
                    <Send size={13} />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </>
  );
}
