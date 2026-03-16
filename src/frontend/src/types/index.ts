export interface Circle {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberIds: string[];
  createdAt: number;
  emoji?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorAvatar?: string;
  type: "text" | "photo";
  text?: string;
  photoUrl?: string;
  timestamp: number;
  reactions: Record<string, string[]>;
  comments: Comment[];
  isReported?: boolean;
  isHidden?: boolean;
}

export interface Notification {
  id: string;
  type:
    | "newPost"
    | "newComment"
    | "circleInvite"
    | "friendRequest"
    | "reaction";
  message: string;
  isRead: boolean;
  timestamp: number;
  referenceId?: string;
  circleId?: string;
  postId?: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  initials: string;
}

export interface FriendRequest {
  id: string;
  fromId: string;
  fromName: string;
  fromInitials: string;
  toId: string;
  status: "pending" | "accepted" | "declined";
  timestamp: number;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  initials: string;
  since: number;
}

export type Page =
  | "login"
  | "onboarding"
  | "home"
  | "circles"
  | "circle"
  | "notifications"
  | "profile"
  | "settings"
  | "friends"
  | "legal";

export type LegalPage = "privacy" | "terms" | "guidelines";
