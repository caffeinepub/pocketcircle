import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import type { Notification } from "../types";

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

const NOTIF_ICONS: Record<Notification["type"], string> = {
  newPost: "\uD83D\uDCF8",
  newComment: "\uD83D\uDCAC",
  circleInvite: "\uD83D\uDD17",
  friendRequest: "\uD83E\uDD1D",
  reaction: "\u2764\uFE0F",
};

export default function NotificationsPage() {
  const { state, dispatch, navigate } = useApp();
  const { notifications } = state;

  const sorted = [...notifications].sort((a, b) => b.timestamp - a.timestamp);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
  }

  function handleNotifClick(notif: Notification) {
    dispatch({ type: "MARK_NOTIFICATION_READ", id: notif.id });

    if (notif.circleId) {
      navigate("circle", notif.circleId, notif.postId);
      if (notif.postId) {
        const postId = notif.postId;
        setTimeout(() => {
          const el = document.getElementById(postId);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl gradient-text">
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            data-ocid="notifications.mark_all_button"
            onClick={markAllRead}
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 text-xs"
          >
            <Check size={14} />
            Mark all read
          </Button>
        )}
      </div>

      <div data-ocid="notifications.list" className="space-y-2">
        {sorted.length === 0 ? (
          <div
            data-ocid="notifications.empty_state"
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
              <BellOff size={28} className="text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          </div>
        ) : (
          sorted.map((notif, i) => (
            <motion.button
              key={notif.id}
              data-ocid={`notifications.item.${i + 1}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleNotifClick(notif)}
              className={`w-full text-left glass rounded-xl p-4 flex items-start gap-3 transition-all hover:border-primary/20 ${
                !notif.isRead ? "border-primary/20 bg-primary/5" : ""
              } ${notif.circleId ? "cursor-pointer" : ""}`}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">
                {NOTIF_ICONS[notif.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${!notif.isRead ? "font-semibold" : "text-muted-foreground"}`}
                >
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {timeAgo(notif.timestamp)}
                </p>
                {notif.circleId && (
                  <p className="text-xs text-primary mt-0.5 font-medium">
                    Tap to view \u2192
                  </p>
                )}
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </motion.button>
          ))
        )}
      </div>

      {notifications.length > 0 && unreadCount === 0 && (
        <p className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <Bell size={12} />
          You're all caught up
        </p>
      )}
    </div>
  );
}
