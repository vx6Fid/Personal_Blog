import React from "react";
import Link from "next/link";
import { Terminal, ChevronRight } from "lucide-react";

function FeaturedBlogCard({ blog }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="group relative p-8 rounded-xl bg-gradient-to-br from-green-950 to-accent/10 transition-all duration-300 shadow-lg font-mono">
      {/* Terminal-style corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/50 rounded-tr-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/50 rounded-br-lg" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/50 rounded-bl-lg" />

      {/* Featured Badge - Terminal Style */}
      <div className="absolute -top-3 -right-3 bg-accent text-background px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center">
        <Terminal className="w-3 h-3 mr-1" />
        FEATURED
      </div>

      {/* Date - Terminal Prompt Style */}
      <div className="absolute -left-2 -top-2 bg-gray-800 text-accent text-xs px-2 py-1 rounded shadow flex items-center">
        <span className="text-green-400 mr-1">$</span>
        {formatDate(blog.created_at)}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Link href={`/blogs/${blog.slug}`} className="block">
          <h2 className="text-xl sm:text-2xl font-bold text-primary group-hover:text-accent transition-colors">
            <span className="text-accent">$</span> {blog.title}
          </h2>
        </Link>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-borders/20 text-accent rounded-full text-sm font-medium shadow-sm font-mono"
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>
        )}

        <p className="text-secondary text-lg leading-relaxed">
          <span className="text-accent">{">>"}</span>{" "}
          {blog.content.length > 250
            ? `${blog.content.substring(0, 250)}...`
            : blog.content}
        </p>

        <div className="flex justify-between items-center">
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center text-accent font-medium hover:underline group"
          >
            <span className="bg-accent/10 group-hover:bg-accent/20 px-3 py-1 rounded-md transition-colors">
              cat {blog.slug}.md
            </span>
            <ChevronRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          <span className="text-sm text-secondary font-mono">
            approx. {Math.ceil(blog.content.length / 200)} min read
          </span>
        </div>
      </div>
    </article>
  );
}

export default FeaturedBlogCard;