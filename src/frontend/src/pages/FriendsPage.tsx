import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Search,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Friend, FriendRequest } from "../types";

const SUGGESTED_USERS = [
  {
    id: "sug-1",
    name: "Alex Chen",
    username: "alexc",
    initials: "AC",
    mutual: 3,
  },
  {
    id: "sug-2",
    name: "Maya Rivera",
    username: "mayar",
    initials: "MR",
    mutual: 1,
  },
  {
    id: "sug-3",
    name: "Sam Torres",
    username: "samt",
    initials: "ST",
    mutual: 5,
  },
  {
    id: "sug-4",
    name: "Jordan Lee",
    username: "jordanl",
    initials: "JL",
    mutual: 2,
  },
  {
    id: "sug-5",
    name: "Riley Park",
    username: "rileyp",
    initials: "RP",
    mutual: 0,
  },
  {
    id: "sug-6",
    name: "Morgan Kim",
    username: "morgank",
    initials: "MK",
    mutual: 4,
  },
];

const INITIAL_REQUESTS: FriendRequest[] = [
  {
    id: "req-1",
    fromId: "user-sarah",
    fromName: "Sarah Chen",
    fromInitials: "SC",
    toId: "demo-user-main",
    status: "pending",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "req-2",
    fromId: "user-mike",
    fromName: "Mike Torres",
    fromInitials: "MT",
    toId: "demo-user-main",
    status: "pending",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
];

const INITIAL_FRIENDS: Friend[] = [
  {
    id: "friend-1",
    name: "Jade Kim",
    username: "jadek",
    initials: "JK",
    since: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: "friend-2",
    name: "Noah Williams",
    username: "noahw",
    initials: "NW",
    since: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<FriendRequest[]>(INITIAL_REQUESTS);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SUGGESTED_USERS.filter(
      (u) => u.username.includes(q) || u.name.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const displaySuggested = searchQuery.trim() ? searchResults : SUGGESTED_USERS;

  function handleSendRequest(userId: string, name: string) {
    setSentRequests((prev) => new Set(prev).add(userId));
    toast.success(`Friend request sent to ${name}!`);
  }

  function handleAccept(reqId: string, fromName: string) {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "accepted" } : r)),
    );
    setFriends((prev) => [
      {
        id: req.fromId,
        name: fromName,
        username: fromName.toLowerCase().replace(" ", ""),
        initials: req.fromInitials,
        since: Date.now(),
      },
      ...prev,
    ]);
    toast.success(`You and ${fromName} are now friends!`);
  }

  function handleDecline(reqId: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "declined" } : r)),
    );
  }

  function handleRemoveFriend(friendId: string, name: string) {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    toast.success(`Removed ${name} from friends`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center">
            <Users size={18} className="text-accent" />
          </div>
          <h1 className="font-display font-bold text-2xl gradient-text">
            Friends
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {friends.length} friend{friends.length !== 1 ? "s" : ""} ·{" "}
          {pendingRequests.length} pending request
          {pendingRequests.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      <Tabs defaultValue="discover">
        <TabsList className="w-full glass border border-border/40 mb-5 p-1 h-auto">
          <TabsTrigger
            data-ocid="friends.discover_tab"
            value="discover"
            className="flex-1 text-sm py-2"
          >
            Discover
          </TabsTrigger>
          <TabsTrigger
            data-ocid="friends.requests_tab"
            value="requests"
            className="flex-1 text-sm py-2 relative"
          >
            Requests
            {pendingRequests.length > 0 && (
              <Badge className="ml-1.5 h-4 px-1 py-0 text-[10px] bg-accent text-accent-foreground">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            data-ocid="friends.my_friends_tab"
            value="my-friends"
            className="flex-1 text-sm py-2"
          >
            My Friends
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="friends.search_input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="pl-9 h-11 bg-muted/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            {!searchQuery.trim() && (
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground px-1 mb-3">
                Suggested
              </p>
            )}
            <AnimatePresence>
              {displaySuggested.map((user, i) => (
                <motion.div
                  key={user.id}
                  data-ocid={`friends.suggest_item.${i + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl p-4 flex items-center gap-3"
                >
                  <Avatar className="w-11 h-11 border border-primary/20">
                    <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                    {user.mutual > 0 && (
                      <p className="text-xs text-accent mt-0.5">
                        {user.mutual} mutual friend
                        {user.mutual !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <Button
                    data-ocid="friends.add_button"
                    size="sm"
                    variant={sentRequests.has(user.id) ? "ghost" : "default"}
                    className={`gap-1.5 ${sentRequests.has(user.id) ? "text-muted-foreground" : "glow-sm"}`}
                    disabled={
                      sentRequests.has(user.id) ||
                      friends.some((f) => f.id === user.id)
                    }
                    onClick={() => handleSendRequest(user.id, user.name)}
                  >
                    {sentRequests.has(user.id) ? (
                      <>
                        <Check size={13} /> Sent
                      </>
                    ) : friends.some((f) => f.id === user.id) ? (
                      <>
                        <UserCheck size={13} /> Friends
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} /> Add
                      </>
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {searchQuery.trim() && displaySuggested.length === 0 && (
              <div
                data-ocid="friends.discover_empty_state"
                className="py-12 text-center"
              >
                <p className="font-semibold text-foreground/70">
                  No users found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different username
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div
              data-ocid="friends.requests_empty_state"
              className="py-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-2xl">
                🤝
              </div>
              <p className="font-semibold text-foreground/70">
                No pending requests
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Share your profile to connect with friends
              </p>
            </div>
          ) : (
            pendingRequests.map((req, i) => (
              <motion.div
                key={req.id}
                data-ocid={`friends.request_item.${i + 1}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-11 h-11 border border-primary/20">
                    <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                      {req.fromInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{req.fromName}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent {timeAgo(req.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    data-ocid="friends.accept_button"
                    size="sm"
                    className="flex-1 gap-1.5 glow-sm"
                    onClick={() => handleAccept(req.id, req.fromName)}
                  >
                    <Check size={13} /> Accept
                  </Button>
                  <Button
                    data-ocid="friends.decline_button"
                    size="sm"
                    variant="ghost"
                    className="flex-1 gap-1.5 text-muted-foreground"
                    onClick={() => handleDecline(req.id)}
                  >
                    <X size={13} /> Decline
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </TabsContent>

        {/* My Friends Tab */}
        <TabsContent value="my-friends" className="space-y-3">
          {friends.length === 0 ? (
            <div
              data-ocid="friends.my_friends_empty_state"
              className="py-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-2xl">
                💫
              </div>
              <p className="font-semibold text-foreground/70">No friends yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Discover people in the Discover tab
              </p>
            </div>
          ) : (
            friends.map((friend, i) => (
              <motion.div
                key={friend.id}
                data-ocid={`friends.friend_item.${i + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-2xl p-4 flex items-center gap-3"
              >
                <Avatar className="w-11 h-11 border border-primary/20">
                  <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                    {friend.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {friend.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{friend.username} · Friends since {timeAgo(friend.since)}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="friends.remove_button"
                  onClick={() => handleRemoveFriend(friend.id, friend.name)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <UserMinus size={15} />
                </button>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
