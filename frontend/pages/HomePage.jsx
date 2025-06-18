"use client";

import HeroSection from "@/components/HeroSection";
import { useState, useEffect } from "react";
import { SquareTerminal } from "lucide-react";
import BlogCards from "@/components/BlogCards";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!url) throw new Error("API base URL is not defined");

        const response = await fetch(`${url}/blogs`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <HeroSection />

      {/* Blog Section */}
      <section className="mt-12 sm:mt-16 pb-12 sm:pb-16">
        <div className="flex items-center gap-3 mb-10 sm:mb-12">
          <SquareTerminal className="w-5 h-5 text-accent" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            recent_posts.md
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-secondary animate-pulse">$ loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-error">$ error: {error}</p>
          </div>
        ) : blogs.length > 0 ? (
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
    </div>
  );
}
