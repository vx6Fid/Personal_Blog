import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function FeaturedBlogCard({ blog }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const text = blog.excerpt || blog.content || "";
  const excerpt = text.length > 250 ? `${text.substring(0, 250)}...` : text;

  return (
    <article
      className="group relative p-8 rounded-sm border border-accent/30
        bg-accent/[0.03] transition-all duration-300
        hover:border-accent/50 hover:shadow-[0_0_30px_-8px_rgba(0,255,178,0.15)]"
    >
      {/* Corner accents — all four corners for featured */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-accent/50" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-accent/50" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-accent/50" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-accent/50" />

      {/* Featured badge */}
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-4 text-xs font-mono rounded-sm border border-accent/40 text-accent bg-accent/10">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        FEATURED
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3 text-xs text-secondary font-mono">
        <span className="text-accent/60">▸</span>
        <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
        {blog.read_time && (
          <>
            <span className="text-borders">·</span>
            <span>{blog.read_time} min</span>
          </>
        )}
      </div>

      {/* Title */}
      <Link href={`/blogs/${blog.slug}`} className="block mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-200 leading-tight">
          <span className="text-accent/50 mr-1">$</span>
          {blog.title}
        </h2>
      </Link>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-mono rounded-sm border border-accent/20 text-accent/70"
            >
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {/* Excerpt */}
      <p className="text-secondary leading-relaxed mb-5">{excerpt}</p>

      {/* CTA */}
      <div className="flex justify-between items-center">
        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-1 text-accent text-sm font-mono group/link"
        >
          <span className="relative">
            cat {blog.slug}.md
            <span className="absolute left-0 -bottom-px w-0 h-px bg-accent transition-all duration-300 group-hover/link:w-full" />
          </span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
        </Link>
      </div>
    </article>
  );
}

export default FeaturedBlogCard;
