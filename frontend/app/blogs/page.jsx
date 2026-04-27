import BlogSearch from "@/components/BlogSearch";

export const revalidate = 3600; // 1 hour

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
    description: "Read vx6Fid's blogs on systems and backend engineering.",
  },
};

async function getBlogs() {
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!url) {
      console.error("[getBlogs] NEXT_PUBLIC_API_BASE_URL is not set");
      return [];
    }

    const res = await fetch(`${url}/blogs`, { cache: "no-store" });
    if (!res.ok) {
      console.error("[getBlogs] fetch failed:", res.status);
      return [];
    }

    const data = await res.json();
    return data.blogs || [];
  } catch (err) {
    console.error("[getBlogs] error:", err);
    return [];
  }
}

export default async function Blogs() {
  const blogs = await getBlogs();

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-primary">Blog</h1>
        <p className="text-secondary">Thoughts on development and systems</p>
      </div>

      <BlogSearch blogs={blogs} />
    </div>
  );
}
