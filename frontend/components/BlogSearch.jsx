"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import BlogCards from "@/components/BlogCards";
import FeaturedBlogCard from "@/components/FeaturedBlog";

export default function BlogSearch({ blogs }) {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredBlog = useMemo(
    () => blogs.find((blog) => blog.is_featured),
    [blogs],
  );

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;

    const lowerQuery = searchQuery.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowerQuery) ||
        (blog.excerpt || "").toLowerCase().includes(lowerQuery) ||
        (blog.tags &&
          blog.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
    );
  }, [searchQuery, blogs]);

  const regularBlogs = useMemo(
    () =>
      filteredBlogs.filter(
        (blog) => !blog.is_featured || blog.id === featuredBlog?.id,
      ),
    [filteredBlogs, featuredBlog],
  );

  return (
    <>
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-4 w-4 text-secondary" />
        </div>
        <input
          type="text"
          placeholder="Search posts..."
          className="block w-full pl-10 pr-4 py-2 border-b border-borders/50 bg-transparent focus:border-accent outline-none transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Featured Blog */}
      {featuredBlog && !searchQuery && (
        <div className="space-y-4">
          <FeaturedBlogCard blog={featuredBlog} />
        </div>
      )}

      {/* All Posts */}
      <div className="space-y-6">
        <h2 className="font-medium text-primary">
          All Posts ({filteredBlogs.length})
        </h2>

        {filteredBlogs.length > 0 ? (
          <div className="space-y-8">
            {regularBlogs.map((blog) => (
              <div key={blog.id} className="pb-8">
                <BlogCards blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-secondary">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "No posts found"}
          </div>
        )}
      </div>
    </>
  );
}
