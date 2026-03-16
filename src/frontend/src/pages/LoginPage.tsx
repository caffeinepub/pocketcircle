import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const isLoading = loginStatus === "logging-in";

  async function handleLogin() {
    setError(null);
    try {
      await login();
      queryClient.invalidateQueries();
    } catch (e) {
      setError("Login failed. Please try again.");
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "oklch(0.65 0.22 290)",
            top: "-10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background: "oklch(0.68 0.18 315)",
            bottom: "-10%",
            right: "-10%",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 glow-primary"
          >
            <Sparkles size={28} className="text-primary" />
          </motion.div>
          <h1 className="font-display font-bold text-3xl gradient-text mb-2">
            PocketCircle
          </h1>
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            Your private space for the people who matter most.
          </p>
        </div>

        {/* Features list */}
        <div className="glass rounded-2xl p-4 mb-6 space-y-3">
          {[
            {
              icon: "🔒",
              title: "Private circles",
              desc: "Share only with who you trust",
            },
            {
              icon: "💬",
              title: "Real moments",
              desc: "Photos, text, reactions & comments",
            },
            {
              icon: "💫",
              title: "Memory timeline",
              desc: "Relive your shared memories",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Auth button */}
        <Button
          data-ocid="auth.login_button"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold glow-primary"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            "Sign in to get started"
          )}
        </Button>

        {error && (
          <p
            className="mt-3 text-center text-sm text-destructive"
            data-ocid="auth.error_state"
          >
            {error}
          </p>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secure authentication powered by Internet Identity
        </p>
      </motion.div>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-muted-foreground/50">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
