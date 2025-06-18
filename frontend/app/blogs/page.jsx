export const metadata = {
  title: "Blogs | vx6Fid",
  description:
    "Browse all blog posts by vx6Fid on backend engineering, systems design, and more.",
  alternates: {
    canonical: "https://vx6fid.vercel.app/blogs",
  },
  openGraph: {
    title: "Blogs | vx6Fid",
    description:
      "A collection of blogs by vx6Fid on code, systems, and tech insights.",
    url: "https://vx6fid.vercel.app/blogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | vx6Fid",
    description: "Read vx6Fid’s blogs on systems and backend engineering.",
  },
};

import dynamic from "next/dynamic";

const BlogPage = dynamic(() => import("@/pages/BlogList"));

export default function Blogs() {
  return <BlogPage />;
}
