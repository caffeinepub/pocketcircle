import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  DEMO_USER_ID,
  SAMPLE_CIRCLES,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_POSTS,
} from "../lib/sampleData";
import type {
  Circle,
  Comment,
  LegalPage,
  Notification,
  Page,
  Post,
  UserProfile,
} from "../types";

const STORAGE_KEY = "pocketcircle_v1";

interface AppState {
  circles: Circle[];
  posts: Post[];
  notifications: Notification[];
  currentUser: UserProfile | null;
  isSeeded: boolean;
}

type AppAction =
  | { type: "SEED_DATA"; state: AppState }
  | { type: "SET_USER"; user: UserProfile }
  | { type: "CLEAR_USER" }
  | { type: "ADD_CIRCLE"; circle: Circle }
  | { type: "ADD_POST"; post: Post }
  | { type: "ADD_COMMENT"; postId: string; comment: Comment }
  | { type: "TOGGLE_REACTION"; postId: string; emoji: string; userId: string }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "ADD_NOTIFICATION"; notification: Notification };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SEED_DATA":
      return action.state;
    case "SET_USER":
      return { ...state, currentUser: action.user };
    case "CLEAR_USER":
      return { ...state, currentUser: null };
    case "ADD_CIRCLE":
      return { ...state, circles: [action.circle, ...state.circles] };
    case "ADD_POST":
      return { ...state, posts: [action.post, ...state.posts] };
    case "ADD_COMMENT":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.postId
            ? { ...p, comments: [...p.comments, action.comment] }
            : p,
        ),
      };
    case "TOGGLE_REACTION": {
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== action.postId) return p;
          const current = p.reactions[action.emoji] || [];
          const hasReacted = current.includes(action.userId);
          return {
            ...p,
            reactions: {
              ...p.reactions,
              [action.emoji]: hasReacted
                ? current.filter((id) => id !== action.userId)
                : [...current, action.userId],
            },
          };
        }),
      };
    }
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, isRead: true } : n,
        ),
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };
    default:
      return state;
  }
}

interface NavigationState {
  currentPage: Page;
  selectedCircleId: string | null;
  selectedPostId: string | null;
  legalSubpage: LegalPage | null;
}

interface AppContextValue {
  state: AppState;
  nav: NavigationState;
  navigate: (
    page: Page,
    circleId?: string,
    postId?: string,
    legalPage?: LegalPage,
  ) => void;
  dispatch: (action: AppAction) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

function saveState(state: AppState) {
  try {
    const toSave = {
      circles: state.circles,
      posts: state.posts,
      notifications: state.notifications,
      isSeeded: state.isSeeded,
      currentUser: state.currentUser,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

const defaultSeedState: AppState = {
  circles: SAMPLE_CIRCLES,
  posts: SAMPLE_POSTS,
  notifications: SAMPLE_NOTIFICATIONS,
  currentUser: null,
  isSeeded: true,
};

function getInitialState(): AppState {
  const saved = loadState();
  if (saved?.isSeeded) return { ...saved, currentUser: null };
  return defaultSeedState;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const [nav, setNav] = useReducer(
    (_: NavigationState, next: NavigationState) => next,
    {
      currentPage: "login",
      selectedCircleId: null,
      selectedPostId: null,
      legalSubpage: null,
    },
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const navigate = useCallback(
    (page: Page, circleId?: string, postId?: string, legalPage?: LegalPage) => {
      setNav({
        currentPage: page,
        selectedCircleId: circleId || null,
        selectedPostId: postId || null,
        legalSubpage: legalPage || null,
      });
    },
    [],
  );

  return (
    <AppContext.Provider value={{ state, nav, navigate, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useCurrentUser() {
  const { state } = useApp();
  return state.currentUser;
}

export function useDemoUserId() {
  const { state } = useApp();
  return state.currentUser?.userId || DEMO_USER_ID;
}
