import { Plus_Jakarta_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display: DM Serif Display — editorial, premium, confident
const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Body: Plus Jakarta Sans — modern, clean, highly legible
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono: JetBrains Mono — developer-flavored, premium feel
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "MockMate — AI-Powered Mock Interview Platform",
  description:
    "MockMate helps you practice real interview questions and get instant AI-scored feedback on every answer. Ace your next interview.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink font-body text-paper antialiased">
        <noscript>
          <style>{`.reveal,[data-reveal-item]{opacity:1!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
