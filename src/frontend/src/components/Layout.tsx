import {
  Bell,
  Heart,
  Home,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import type { Page } from "../types";

interface NavItem {
  page: Page;
  icon: ReactNode;
  label: string;
  ocid: string;
  badge?: number;
}

function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { navigate } = useApp();
  return (
    <button
      type="button"
      data-ocid={item.ocid}
      onClick={() => navigate(item.page)}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200 group min-w-[52px] ${
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span
        className={`p-2 rounded-xl transition-all duration-200 ${
          isActive ? "bg-primary/20 glow-sm" : "group-hover:bg-muted/50"
        }`}
      >
        {item.icon}
      </span>
      <span className="text-[10px] font-semibold tracking-wide">
        {item.label}
      </span>
      {(item.badge ?? 0) > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-[9px] font-bold rounded-full flex items-center justify-center text-white">
          {item.badge}
        </span>
      )}
      {isActive && (
        <motion.span
          layoutId="nav-dot"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
        />
      )}
    </button>
  );
}

function SidebarNavItem({
  item,
  isActive,
}: { item: NavItem; isActive: boolean }) {
  const { navigate } = useApp();
  return (
    <button
      type="button"
      data-ocid={item.ocid}
      onClick={() => navigate(item.page)}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-primary/15 text-primary glow-sm"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span className="text-sm font-medium">{item.label}</span>
      {(item.badge ?? 0) > 0 && (
        <span className="ml-auto w-5 h-5 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center text-white">
          {item.badge}
        </span>
      )}
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
        />
      )}
    </button>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, state, navigate } = useApp();
  const { theme, toggleTheme } = useTheme();
  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  const navItems: NavItem[] = [
    {
      page: "home",
      icon: <Home size={20} />,
      label: "Home",
      ocid: "nav.home_link",
    },
    {
      page: "circles",
      icon: <Users size={20} />,
      label: "Circles",
      ocid: "nav.circles_link",
    },
    {
      page: "friends",
      icon: <Heart size={20} />,
      label: "Friends",
      ocid: "nav.friends_link",
    },
    {
      page: "notifications",
      icon: <Bell size={20} />,
      label: "Alerts",
      ocid: "nav.notifications_link",
      badge: unreadCount,
    },
    {
      page: "profile",
      icon: <User size={20} />,
      label: "Profile",
      ocid: "nav.profile_link",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 glass border-r border-border/50 p-4 gap-2">
        <div className="flex items-center gap-2.5 px-3 py-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Sparkles size={16} className="text-primary" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">
            PocketCircle
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.page}
              item={item}
              isActive={nav.currentPage === item.page}
            />
          ))}
        </nav>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={() => navigate("settings")}
              className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                nav.currentPage === "settings"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button
              type="button"
              data-ocid="nav.theme_toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {state.currentUser && (
            <div className="mt-2 flex items-center gap-3 px-3 py-2 rounded-xl glass">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                {state.currentUser.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">
                  {state.currentUser.displayName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  @{state.currentUser.username}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content — extra bottom padding so last card clears the fixed nav */}
      <main
        className="flex-1 overflow-y-auto scrollbar-hide md:pb-0"
        style={{
          paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 16px))",
        }}
      >
        <motion.div
          key={nav.currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile bottom tab bar — solid background so content never bleeds through */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
        style={{
          background: "oklch(0.1 0.025 280 / 0.97)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => (
            <NavIcon
              key={item.page}
              item={item}
              isActive={nav.currentPage === item.page}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
