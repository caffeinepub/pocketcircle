import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { Post } from "../types";
import PostCard from "./PostCard";

interface MemoryTimelineProps {
  posts: Post[];
}

function groupByMonth(posts: Post[]): Record<string, Post[]> {
  const groups: Record<string, Post[]> = {};
  for (const post of posts) {
    const date = new Date(post.timestamp);
    const key = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }
  return groups;
}

export default function MemoryTimeline({ posts }: MemoryTimelineProps) {
  const sorted = useMemo(
    () => [...posts].sort((a, b) => b.timestamp - a.timestamp),
    [posts],
  );
  const groups = useMemo(() => groupByMonth(sorted), [sorted]);
  const months = Object.keys(groups);

  if (months.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
        <Calendar size={32} className="opacity-40" />
        <p className="text-sm">No memories yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {months.map((month, mi) => (
        <motion.div
          key={month}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: mi * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Calendar size={14} className="text-primary" />
            </div>
            <h3 className="font-display font-bold text-sm text-primary">
              {month}
            </h3>
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-muted-foreground">
              {groups[month].length} moment
              {groups[month].length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            {groups[month].map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
