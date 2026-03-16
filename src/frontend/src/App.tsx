import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import Layout from "./components/Layout";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import CircleFeedPage from "./pages/CircleFeedPage";
import CirclesPage from "./pages/CirclesPage";
import FriendsPage from "./pages/FriendsPage";
import HomePage from "./pages/HomePage";
import LegalPage from "./pages/LegalPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const { nav, navigate, state } = useApp();
  const {
    data: backendProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showOnboarding =
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    !backendProfile &&
    !state.currentUser;

  useEffect(() => {
    if (isInitializing) return;
    if (isAuthenticated) {
      if (nav.currentPage === "login") {
        if (showOnboarding) {
          navigate("onboarding");
        } else if (state.currentUser || backendProfile) {
          navigate("home");
        }
      }
    } else {
      if (nav.currentPage !== "login" && nav.currentPage !== "onboarding") {
        navigate("login");
      }
    }
  }, [
    isAuthenticated,
    isInitializing,
    showOnboarding,
    backendProfile,
    state.currentUser,
    nav.currentPage,
    navigate,
  ]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/50 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-body">
            Loading PocketCircle...
          </p>
        </div>
      </div>
    );
  }

  if (nav.currentPage === "login" || !isAuthenticated) {
    return <LoginPage />;
  }

  if (nav.currentPage === "onboarding" || showOnboarding) {
    return <OnboardingPage />;
  }

  return (
    <Layout>
      {nav.currentPage === "home" && <HomePage />}
      {nav.currentPage === "circles" && <CirclesPage />}
      {nav.currentPage === "circle" && <CircleFeedPage />}
      {nav.currentPage === "friends" && <FriendsPage />}
      {nav.currentPage === "notifications" && <NotificationsPage />}
      {nav.currentPage === "profile" && <ProfilePage />}
      {nav.currentPage === "settings" && <SettingsPage />}
      {nav.currentPage === "legal" && <LegalPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppInner />
        <Toaster position="top-center" />
      </AppProvider>
    </ThemeProvider>
  );
}
