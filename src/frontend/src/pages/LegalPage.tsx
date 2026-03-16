import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import type { LegalPage as LegalPageType } from "../types";

const LEGAL_CONTENT: Record<
  LegalPageType,
  { title: string; icon: string; sections: { heading: string; body: string }[] }
> = {
  privacy: {
    title: "Privacy Policy",
    icon: "\uD83D\uDD12",
    sections: [
      {
        heading: "Information We Collect",
        body: "PocketCircle collects only the information you provide directly \u2014 your display name, username, and bio. We do not collect device identifiers, location data, or behavioral tracking data. Photos and media you share are stored securely on the Internet Computer network and are only accessible to members of the circles you share them with.",
      },
      {
        heading: "How We Use Your Information",
        body: "Your information is used solely to provide the PocketCircle service: displaying your profile to circle members, enabling posts and reactions, and sending in-app notifications. We do not sell, rent, or share your data with any third parties. We do not use your data for advertising or analytics beyond basic operational metrics.",
      },
      {
        heading: "Your Privacy Controls",
        body: "You control your privacy within PocketCircle. You can edit or delete your profile at any time. Posts you create can be removed by you at any time. Circles are private by default \u2014 only invited members can see circle content. You can report abusive content to circle admins. For any privacy concerns, contact your circle admin or reach out through Settings.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: "\uD83D\uDCCB",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By using PocketCircle, you agree to these Terms of Service. PocketCircle is intended for personal, non-commercial use among trusted friend groups. You must be at least 13 years old to use this service. These terms may be updated occasionally; continued use of the app constitutes acceptance of the updated terms.",
      },
      {
        heading: "User Responsibilities",
        body: "You are responsible for the content you share within your circles. You agree not to share content that is illegal, harmful, harassing, or otherwise violates others\u2019 rights. You agree not to attempt to access circles or content you have not been invited to. Misuse of the platform may result in removal from circles or termination of your account.",
      },
      {
        heading: "Content and Intellectual Property",
        body: "You retain ownership of all content you post on PocketCircle. By posting content, you grant PocketCircle a limited license to store and display that content to members of your circles. Content shared in private circles remains private and is not indexed or accessible publicly. PocketCircle does not claim any ownership over your personal content.",
      },
    ],
  },
  guidelines: {
    title: "Community Guidelines",
    icon: "\uD83E\uDD1D",
    sections: [
      {
        heading: "Be Kind and Respectful",
        body: "PocketCircle is about real moments shared with trusted friends. Treat every circle member with kindness and respect. Harassment, bullying, hate speech, or any form of harmful communication is strictly prohibited. Remember that behind every post is a real person \u2014 engage with empathy and care.",
      },
      {
        heading: "Share Authentically",
        body: "PocketCircle is designed for authentic sharing of real-life moments. Do not share misinformation, impersonate others, or create fake profiles. Content should be appropriate for your audience \u2014 remember that circle members are people who trust you. Sexual content, graphic violence, or illegal activities are not permitted.",
      },
      {
        heading: "Respect Privacy",
        body: "Content shared within a circle should stay within that circle. Do not share screenshots or redistribute private content outside its intended audience without consent. Respect others\u2019 boundaries and comfort levels. If someone asks you to remove content that includes them, please do so promptly. Circle admins are empowered to moderate content and ensure the circle remains a safe space.",
      },
    ],
  },
};

export default function LegalPage() {
  const { navigate, nav } = useApp();
  const page: LegalPageType = (nav.legalSubpage as LegalPageType) || "privacy";
  const content = LEGAL_CONTENT[page];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          data-ocid="legal.back_button"
          onClick={() => navigate("settings")}
          className="gap-2 text-muted-foreground hover:text-foreground mb-6 -ml-2"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Button>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-2xl">
            {content.icon}
          </div>
          <h1 className="font-display font-bold text-2xl gradient-text">
            {content.title}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: March 2026
        </p>
      </motion.div>

      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <motion.div
            key={section.heading}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="font-display font-bold text-base mb-3 text-foreground">
              {section.heading}
            </h2>
            <p className="text-sm leading-relaxed text-foreground/75">
              {section.body}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground/40 mt-10">
        \u00a9 {new Date().getFullYear()}. Built with love using{" "}
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
