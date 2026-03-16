import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ImageIcon, Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp, useDemoUserId } from "../context/AppContext";
import { useStorageUpload } from "../hooks/useStorageUpload";
import type { Post } from "../types";
import ModalPortal from "./ModalPortal";

interface CameraPostModalProps {
  onClose: () => void;
  initialCircleId?: string;
}

type Step = "capture" | "compose";

export default function CameraPostModal({
  onClose,
  initialCircleId,
}: CameraPostModalProps) {
  const { dispatch, state } = useApp();
  const currentUserId = useDemoUserId();
  const { uploadImage, isUploading } = useStorageUpload();
  const [step, setStep] = useState<Step>("capture");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCircleId, setSelectedCircleId] = useState(
    initialCircleId || state.circles[0]?.id || "",
  );

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const user = state.currentUser;
  const authorName = user?.displayName || "You";
  const authorInitials = user?.initials || "YO";

  const myCircles = state.circles.filter((c) =>
    c.memberIds.includes(currentUserId),
  );

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    const url = await uploadImage(file, (pct) => setUploadProgress(pct));
    setPhotoUrl(url);
    setUploadProgress(100);
    setStep("compose");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoUrl || !selectedCircleId) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const postId = `post-${Date.now()}`;
      const post: Post = {
        id: postId,
        circleId: selectedCircleId,
        authorId: currentUserId,
        authorName,
        authorInitials,
        type: "photo",
        text: caption.trim() || undefined,
        photoUrl,
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
          message: "You shared a new photo in the circle",
          isRead: true,
          timestamp: Date.now(),
          circleId: selectedCircleId,
          postId,
        },
      });

      toast.success("Photo shared!");
      setIsSubmitting(false);
      onClose();
    }, 400);
  }

  return (
    <ModalPortal onClose={onClose}>
      <motion.div
        data-ocid="camera.post_modal"
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-strong w-full max-w-lg rounded-3xl md:rounded-2xl overflow-hidden shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div className="flex items-center gap-2">
            {step === "compose" && (
              <button
                type="button"
                onClick={() => setStep("capture")}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                ← Back
              </button>
            )}
            <h2 className="font-display font-bold text-lg">
              {step === "capture" ? "Add Photo" : "Share Moment"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {step === "capture" ? (
          <div className="p-6 space-y-4">
            {/* Hidden file inputs */}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelected}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />

            {/* Upload progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Uploading photo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            {/* Camera option */}
            <button
              type="button"
              data-ocid="camera.take_photo_button"
              onClick={() => cameraRef.current?.click()}
              disabled={isUploading}
              className="w-full flex flex-col items-center gap-4 py-10 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all group disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                <Camera size={28} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Take a Photo</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use your camera
                </p>
              </div>
            </button>

            {/* Gallery option */}
            <button
              type="button"
              data-ocid="camera.gallery_button"
              onClick={() => galleryRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-all border border-border/40 hover:border-border/70 disabled:opacity-50"
            >
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                <ImageIcon size={20} className="text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Upload from Gallery</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose an existing photo
                </p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Photo preview */}
            {photoUrl && (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-full max-h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl(null);
                    setStep("capture");
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Caption
              </Label>
              <Textarea
                data-ocid="camera.caption_input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="min-h-[80px] bg-muted/50 border-border/50 resize-none text-sm"
              />
            </div>

            {/* Circle selector */}
            {myCircles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Share to Circle
                </Label>
                <select
                  data-ocid="camera.circle_select"
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

            <Button
              type="submit"
              data-ocid="camera.share_button"
              className="w-full h-12 glow-primary text-base font-semibold"
              disabled={!photoUrl || !selectedCircleId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Sharing...
                </>
              ) : (
                "Share to Circle"
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </ModalPortal>
  );
}
