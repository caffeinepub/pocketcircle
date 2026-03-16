import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import CameraPostModal from "../components/CameraPostModal";
import PostCard from "../components/PostCard";
import { useApp } from "../context/AppContext";

export default function HomePage() {
  const { state } = useApp();
  const { posts, circles, currentUser } = state;
  const [showCamera, setShowCamera] = useState(false);

  const myCircleIds = useMemo(() => {
    const userId = currentUser?.userId || "demo-user-main";
    return circles.filter((c) => c.memberIds.includes(userId)).map((c) => c.id);
  }, [circles, currentUser]);

  const feedPosts = useMemo(
    () =>
      posts
        .filter((p) => myCircleIds.includes(p.circleId))
        .sort((a, b) => b.timestamp - a.timestamp),
    [posts, myCircleIds],
  );

  const circleName = (id: string) =>
    circles.find((c) => c.id === id)?.name || "Unknown";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-primary" />
          <h1 className="font-display font-bold text-2xl gradient-text">
            {currentUser
              ? `Hey, ${currentUser.displayName.split(" ")[0]}!`
              : "Home Feed"}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {feedPosts.length} moment{feedPosts.length !== 1 ? "s" : ""} from your
          circles
        </p>
      </motion.div>

      {/* Feed */}
      {feedPosts.length === 0 ? (
        <div
          data-ocid="home.feed_list"
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
            <Sparkles size={28} className="text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold text-foreground/80">No posts yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Join circles and start sharing moments!
            </p>
          </div>
        </div>
      ) : (
        <div data-ocid="home.feed_list" className="space-y-4">
          {feedPosts.map((post, index) => (
            <div key={post.id}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 px-1 font-semibold">
                {circleName(post.circleId)}
              </p>
              <PostCard post={post} index={index} />
            </div>
          ))}
        </div>
      )}

      {/* Floating camera button — always visible, bottom right */}
      <motion.button
        type="button"
        data-ocid="home.fab_button"
        onClick={() => setShowCamera(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 300 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-[5.5rem] right-5 z-40 w-14 h-14 rounded-full bg-primary shadow-xl shadow-primary/40 flex items-center justify-center text-white"
      >
        <Camera size={24} />
      </motion.button>

      {/* Camera post modal */}
      {showCamera && <CameraPostModal onClose={() => setShowCamera(false)} />}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-16 h-2" />
            </div>
          </div>
          <Skeleton className="w-full h-20" />
        </div>
      ))}
    </div>
  );
}
