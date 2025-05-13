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
  weights: ["200", "400", "500", "700"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "vx6Fid",
  description:
    "Writing about backend engineering, Linux, and systems thinking. Real-world lessons, code breakdowns, and learning in public.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto_mono.className}>
      <head>
        <meta
          name="google-site-verification"
          content="-cz7XX3_cjMlEj5-Msvm6S2cErFLUAtR2Y0-d5XsCKk"
        />
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
