export const metadata = {
  title: "Projects | vx6Fid",
  description:
    "A curated showcase of vx6Fid’s engineering projects, exploring backend systems, tools, and experiments.",
  alternates: {
    canonical: "https://vx6fid.vercel.app/projects",
  },
  openGraph: {
    title: "Projects | vx6Fid",
    description:
      "Explore vx6Fid’s portfolio of technical builds, backend tools, and full-stack systems.",
    url: "https://vx6fid.vercel.app/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | vx6Fid",
    description: "Backend systems, tools, and experiments by vx6Fid",
  },
};

import dynamic from "next/dynamic";

const ProjectsPage = dynamic(() => import("@/pages/Projects"));

export default function Page() {
  return <ProjectsPage />;
}
