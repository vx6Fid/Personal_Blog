export const metadata = {
  title: "About | vx6Fid",
  description:
    "Learn more about vx6Fid, backend systems, and the journey behind the blog.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | vx6Fid",
    description: "Background, interests, and goals of vx6Fid",
    url: "https://vx6fid.vercel.app/about",
    type: "website",
  },
};

import dynamic from "next/dynamic";

const AboutClient = dynamic(() => import("@/pages/AboutClient"));

export default function AboutPage() {
  return <AboutClient />;
}
