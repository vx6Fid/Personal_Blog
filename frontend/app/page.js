export const metadata = {
  title: "vx6Fid — Systems, Code & Engineering Insights",
  description:
    "Explore technical deep-dives, systems architecture, backend engineering, and the learning journey of vx6Fid.",
  alternates: {
    canonical: "https://vx6fid.vercel.app",
  },
  openGraph: {
    title: "vx6Fid — Systems, Code & Engineering Insights",
    description:
      "Read vx6Fid's technical blog exploring backend architecture, distributed systems, and dev tooling.",
    url: "https://vx6fid.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vx6Fid — Systems, Code & Engineering Insights",
    description:
      "Tech reflections, backend blogs, and systems engineering from vx6Fid.",
  },
};

import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/pages/HomePage"));

export default function Page() {
  return <Home />;
}
