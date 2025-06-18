import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeInit from "@/components/ThemeInit";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "400", "500", "700"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "vx6Fid’s Thoughts — A Blog on Systems & Beyond",
  description:
    "Reflections on code, systems, and everything in between. Exploring the world of backend engineering, tech tools, and my learning journey through diverse topics.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vx6fid.vercel.app",
  ),
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/rss.xml`,
          title: "vx6fid's Blog RSS Feed",
        },
      ],
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto_mono.className}>
      <head>
        <meta
          name="google-site-verification"
          content="-cz7XX3_cjMlEj5-Msvm6S2cErFLUAtR2Y0-d5XsCKk"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* <link rel="canonical" href="https://vx6fid.vercel.app" /> */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Achal's Blog"
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/rss.xml`}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeInit>
          <Toaster position="top-right" />
          <Analytics />
          <SpeedInsights />
          <Navbar />
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
        </ThemeInit>
      </body>
    </html>
  );
}
