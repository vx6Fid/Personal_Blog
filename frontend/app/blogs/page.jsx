"use client";
import BlogCards from "@/components/BlogCards";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import FeaturedBlogCard from "@/components/FeaturedBlog";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        setFilteredBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowerQuery) ||
        blog.content.toLowerCase().includes(lowerQuery) ||
        (blog.tags &&
          blog.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
    );

    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  const featuredBlog = blogs.find((blog) => blog.is_featured);
  const regularBlogs = filteredBlogs.filter(
    (blog) => !blog.is_featured || blog.id === featuredBlog?.id
  );

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-primary">Blog</h1>
        <p className="text-secondary">Thoughts on development and systems</p>
      </div>

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

      {/* Featured Blog - Elevated Section */}
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

        {loading ? (
          <div className="py-8 text-center text-secondary">
            Loading posts...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-secondary">Error: {error}</div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-8">
            {regularBlogs.map((blog) => (
              <div
                key={blog.id}
                className="pb-8"
              >
                <BlogCards blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-secondary">
            {searchQuery ? `No results for "${searchQuery}"` : "No posts found"}
          </div>
        )}
      </div>
    </div>
  );
}
