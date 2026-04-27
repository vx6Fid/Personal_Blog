import React from "react";
import Link from "next/link";

function BlogCards({ blog, id }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article
      key={id}
      className="group relative p-6 sm:p-8 rounded-sm border border-borders/60
        hover:border-accent/40 transition-all duration-300
        hover:shadow-[0_0_20px_-6px_rgba(0,255,178,0.12)]"
    >

      {/* Date — inline, not floating */}
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
        <h2 className="text-xl sm:text-2xl font-semibold text-primary/90 group-hover:text-accent transition-colors duration-200 leading-tight">
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
              className="px-2 py-0.5 text-xs font-mono rounded-sm border border-borders/40 text-secondary
                hover:border-accent/30 hover:text-accent transition-all duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Excerpt */}
      <p className="text-secondary text-sm leading-relaxed mb-5">
        {(() => {
          const text = blog.excerpt || blog.content || "";
          return text.length > 200
            ? `${text.substring(0, 200).replace(/\s+\S*$/, "")}...`
            : text;
        })()}
      </p>

      {/* Read more */}
      <Link
        href={`/blogs/${blog.slug}`}
        prefetch={true}
        className="inline-flex items-center text-accent text-sm font-mono group/link"
      >
        <span className="relative">
          Read more
          <span className="absolute left-0 -bottom-px w-0 h-px bg-accent transition-all duration-300 group-hover/link:w-full" />
        </span>
        <span className="ml-2 relative inline-block w-4 h-4 overflow-hidden">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-400 group-hover/link:translate-x-[150%] group-hover/link:opacity-0">
            |
          </span>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[150%] opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all duration-400">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}

export default BlogCards;
