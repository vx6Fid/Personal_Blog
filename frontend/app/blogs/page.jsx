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

    const res = await fetch(`${url}/blogs`);
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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-primary font-display uppercase tracking-wide">Blog</h1>
          <p className="text-secondary">Thoughts on development and systems</p>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/rss.xml`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-accent/40 text-accent rounded-sm
            hover:bg-accent/10 hover:border-accent/60 transition-all duration-200 uppercase tracking-wider"
          aria-label="Subscribe to RSS feed"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          RSS
        </a>
      </div>

      <BlogSearch blogs={blogs} />
    </div>
  );
}
