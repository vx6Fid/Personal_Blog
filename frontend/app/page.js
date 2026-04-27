import { ArrowRightIcon, Layers } from "lucide-react";
import BlogCards from "@/components/BlogCards";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";

export const revalidate = 3600; // 1 hour

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

async function getRecentBlogs() {
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!url) return [];

    const res = await fetch(`${url}/blogs/recent`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data.blogs || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const blogs = await getRecentBlogs();

  return (
    <div>
      <HeroSection />
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <section className="mt-12 sm:mt-16 pb-6 sm:pb-16">
          <div className="flex items-center gap-3 mb-10 sm:mb-12">
            <Layers className="w-5 h-5 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              recent_posts.md
            </h1>
          </div>

          {blogs.length > 0 ? (
            <div className="grid gap-10 sm:gap-12">
              {blogs.map((blog, id) => (
                <BlogCards blog={blog} id={id} key={blog.id || id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-secondary">$ no posts found</p>
            </div>
          )}
        </section>
        {blogs.length > 0 && (
          <div className="-mt-6 mb-10">
            <Link
              href="/blogs"
              className="flex gap-2 items-center text-accent font-medium transition-colors duration-200 group"
            >
              <span className="relative">
                View All Entries
                <span className="absolute bottom-0 left-1/2 w-20 border-b border-accent transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center"></span>
              </span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
