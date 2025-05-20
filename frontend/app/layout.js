import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  alternates: {
    canonical: "https://vx6fid.vercel.app",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
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
      </head>
      <body className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <Analytics />
        <SpeedInsights />
        <Navbar />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
