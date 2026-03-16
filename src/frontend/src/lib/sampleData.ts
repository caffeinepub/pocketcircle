import type { Circle, Notification, Post } from "../types";

export const DEMO_USER_ID = "demo-user-main";
export const DEMO_USER_2 = "demo-user-sarah";
export const DEMO_USER_3 = "demo-user-mike";
export const DEMO_USER_4 = "demo-user-jade";

export const SAMPLE_CIRCLES: Circle[] = [
  {
    id: "circle-family",
    name: "Family",
    description: "Keeping the whole family connected 💕",
    adminId: DEMO_USER_ID,
    memberIds: [DEMO_USER_ID, DEMO_USER_2, DEMO_USER_3],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    emoji: "🏡",
  },
  {
    id: "circle-bestfriends",
    name: "Best Friends",
    description: "The ride-or-dies 🌟",
    adminId: DEMO_USER_2,
    memberIds: [DEMO_USER_ID, DEMO_USER_2, DEMO_USER_4],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    emoji: "✨",
  },
  {
    id: "circle-workcrew",
    name: "Work Crew",
    description: "The team that ships together, stays together 🚀",
    adminId: DEMO_USER_3,
    memberIds: [DEMO_USER_ID, DEMO_USER_3, DEMO_USER_4],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    emoji: "🚀",
  },
];

export const SAMPLE_POSTS: Post[] = [
  {
    id: "post-1",
    circleId: "circle-bestfriends",
    authorId: DEMO_USER_2,
    authorName: "Sarah Chen",
    authorInitials: "SC",
    type: "photo",
    photoUrl: "/assets/generated/post-beach-sunset.dim_800x500.jpg",
    text: "Golden hour at Malibu Beach last weekend 🌅 Miss you all, wish you were here!",
    timestamp: Date.now() - 1000 * 60 * 47,
    reactions: {
      "❤️": [DEMO_USER_ID, DEMO_USER_4],
      "😮": [DEMO_USER_3],
    },
    comments: [
      {
        id: "comment-1",
        postId: "post-1",
        authorId: DEMO_USER_ID,
        authorName: "You",
        authorInitials: "YO",
        content:
          "This is absolutely stunning! When are we doing a beach trip together? 🏖️",
        timestamp: Date.now() - 1000 * 60 * 30,
      },
      {
        id: "comment-2",
        postId: "post-1",
        authorId: DEMO_USER_4,
        authorName: "Jade Kim",
        authorInitials: "JK",
        content: "Okay I'm booking flights right now 😭✈️",
        timestamp: Date.now() - 1000 * 60 * 15,
      },
    ],
  },
  {
    id: "post-2",
    circleId: "circle-family",
    authorId: DEMO_USER_3,
    authorName: "Mike Torres",
    authorInitials: "MT",
    type: "photo",
    photoUrl: "/assets/generated/post-birthday-cake.dim_800x500.jpg",
    text: "Surprise birthday party for Mom was a SUCCESS 🎂🎉 She had no idea!",
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    reactions: {
      "❤️": [DEMO_USER_ID, DEMO_USER_2],
      "😂": [DEMO_USER_4],
      "👍": [DEMO_USER_ID],
    },
    comments: [
      {
        id: "comment-3",
        postId: "post-2",
        authorId: DEMO_USER_2,
        authorName: "Sarah Chen",
        authorInitials: "SC",
        content: "I can't believe I missed it 😭 This looks amazing though!!",
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
    ],
  },
  {
    id: "post-3",
    circleId: "circle-workcrew",
    authorId: DEMO_USER_4,
    authorName: "Jade Kim",
    authorInitials: "JK",
    type: "text",
    text: "Just shipped the new feature we've been working on for 3 months 🚀 Couldn't have done it without this amazing team. Drinks on me tonight! 🍻",
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    reactions: {
      "👍": [DEMO_USER_ID, DEMO_USER_3],
      "❤️": [DEMO_USER_3],
      "😂": [DEMO_USER_ID],
    },
    comments: [],
  },
  {
    id: "post-4",
    circleId: "circle-bestfriends",
    authorId: DEMO_USER_4,
    authorName: "Jade Kim",
    authorInitials: "JK",
    type: "photo",
    photoUrl: "/assets/generated/post-hiking-trail.dim_800x500.jpg",
    text: "Weekend hike at Griffith Park 🥾 The views were unreal. We're doing this every month now, I've decided.",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    reactions: {
      "❤️": [DEMO_USER_2],
      "👍": [DEMO_USER_ID, DEMO_USER_2],
    },
    comments: [
      {
        id: "comment-4",
        postId: "post-4",
        authorId: DEMO_USER_ID,
        authorName: "You",
        authorInitials: "YO",
        content: "Next time I'm coming!! Count me in 🙋",
        timestamp: Date.now() - 1000 * 60 * 60 * 20,
      },
    ],
  },
  {
    id: "post-5",
    circleId: "circle-family",
    authorId: DEMO_USER_2,
    authorName: "Sarah Chen",
    authorInitials: "SC",
    type: "text",
    text: "Family dinner this Sunday at my place! 🍜 Making Grandma's dumplings recipe. Please RSVP so I know how much to make! Who's in? 🥟",
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    reactions: {
      "❤️": [DEMO_USER_ID, DEMO_USER_3],
      "👍": [DEMO_USER_3],
    },
    comments: [
      {
        id: "comment-5",
        postId: "post-5",
        authorId: DEMO_USER_3,
        authorName: "Mike Torres",
        authorInitials: "MT",
        content: "We'll be there! Bringing dessert 🍰",
        timestamp: Date.now() - 1000 * 60 * 60 * 35,
      },
    ],
  },
  {
    id: "post-6",
    circleId: "circle-workcrew",
    authorId: DEMO_USER_3,
    authorName: "Mike Torres",
    authorInitials: "MT",
    type: "text",
    text: "Team lunch tomorrow at Nobu? 🍣 We've been grinding so hard this sprint, we deserve it. My treat! Let me know by EOD.",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    reactions: {
      "❤️": [DEMO_USER_ID, DEMO_USER_4],
      "😂": [DEMO_USER_4],
    },
    comments: [],
  },
];

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "newPost",
    message: "Sarah Chen shared a new photo in Best Friends 📸",
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 47,
    referenceId: "circle-bestfriends",
  },
  {
    id: "notif-2",
    type: "newComment",
    message: "Jade Kim commented on your post in Best Friends",
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 15,
    referenceId: "post-1",
  },
  {
    id: "notif-3",
    type: "circleInvite",
    message: "Mike Torres invited you to join Work Crew 🚀",
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    referenceId: "circle-workcrew",
  },
  {
    id: "notif-4",
    type: "newPost",
    message: "Jade Kim shared a post in Work Crew",
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    referenceId: "circle-workcrew",
  },
];
