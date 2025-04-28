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
      className="group relative p-6 sm:p-8 rounded-lg border border-borders hover:border-green-900 transition-all duration-300"
    >
      <div className="absolute -left-2 -top-2 bg-gray-800 text-accent text-xs px-2 py-1 rounded">
        {formatDate(blog.created_at)}
      </div>

      <Link href={`/blogs/${blog.slug}`} className="block mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary/90 group-hover:text-primary transition-colors">
          $ {blog.title}
        </h2>
      </Link>

      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-borders text-accent rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-secondary mb-4">
        {blog.content.length > 200
          ? `${blog.content.substring(0, 200).replace(/\s+\S*$/, "")}...`
          : blog.content}
      </p>

      <Link
        href={`/blogs/${blog.slug}`}
        className="inline-flex items-center text-accent text-sm font-mono hover:underline"
      >
        cat {blog.slug}.md
        <span className="ml-1 animate-pulse">_</span>
      </Link>
    </article>
  );
}

export default BlogCards;
