import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader2, Type, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp, useDemoUserId } from "../context/AppContext";
import type { Post } from "../types";
import ModalPortal from "./ModalPortal";

interface CreatePostModalProps {
  circleId?: string;
  onClose: () => void;
}

export default function CreatePostModal({
  circleId: initialCircleId,
  onClose,
}: CreatePostModalProps) {
  const { dispatch, state } = useApp();
  const currentUserId = useDemoUserId();
  const [postType, setPostType] = useState<"text" | "photo">("text");
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCircleId, setSelectedCircleId] = useState(
    initialCircleId || state.circles[0]?.id || "",
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const user = state.currentUser;
  const authorName = user?.displayName || "You";
  const authorInitials = user?.initials || "YO";

  const myCircles = state.circles.filter((c) =>
    c.memberIds.includes(currentUserId),
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const url = URL.createObjectURL(file);
    setTimeout(() => {
      setPhotoUrl(url);
      setIsUploading(false);
    }, 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !photoUrl) return;
    if (!selectedCircleId) return;

    const postId = `post-${Date.now()}`;
    const post: Post = {
      id: postId,
      circleId: selectedCircleId,
      authorId: currentUserId,
      authorName,
      authorInitials,
      type: postType,
      text: text.trim() || undefined,
      photoUrl: photoUrl || undefined,
      timestamp: Date.now(),
      reactions: {},
      comments: [],
    };

    dispatch({ type: "ADD_POST", post });
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `notif-${Date.now()}`,
        type: "newPost",
        message: `You shared a new ${postType === "photo" ? "photo" : "post"} in the circle`,
        isRead: true,
        timestamp: Date.now(),
        referenceId: selectedCircleId,
        circleId: selectedCircleId,
        postId,
      },
    });

    toast.success("Post shared!");
    onClose();
  }

  return (
    <ModalPortal onClose={onClose}>
      <motion.div
        data-ocid="post.create_modal"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-strong w-full max-w-lg rounded-3xl md:rounded-2xl overflow-hidden shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="font-display font-bold text-lg">Share a moment</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Circle selector (only if not pre-selected) */}
          {!initialCircleId && myCircles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Share to Circle
              </Label>
              <select
                value={selectedCircleId}
                onChange={(e) => setSelectedCircleId(e.target.value)}
                className="w-full h-12 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {myCircles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Post type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPostType("text")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                postType === "text"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Type size={14} />
              Text
            </button>
            <button
              type="button"
              onClick={() => setPostType("photo")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                postType === "photo"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Image size={14} />
              Photo
            </button>
          </div>

          {/* Text area */}
          <Textarea
            data-ocid="post.text_input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              postType === "photo"
                ? "Add a caption..."
                : "What's on your mind? Share with your circle..."
            }
            className="min-h-[100px] bg-muted/50 border-border/50 resize-none text-sm"
          />

          {/* Photo upload */}
          {postType === "photo" && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full max-h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="post.upload_button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-8 border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Upload size={24} />
                  )}
                  <span className="text-sm">
                    {isUploading ? "Uploading..." : "Tap to upload a photo"}
                  </span>
                </button>
              )}
            </div>
          )}

          <Button
            type="submit"
            data-ocid="post.submit_button"
            className="w-full h-12 glow-primary text-base font-semibold"
            disabled={
              (!text.trim() && !photoUrl) || isUploading || !selectedCircleId
            }
          >
            Share with circle
          </Button>
        </form>
      </motion.div>
    </ModalPortal>
  );
}
