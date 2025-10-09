import React from "react";

export default function BlogHeader({ blog }) {
  return (
    <div className="max-w-4xl mr-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight leading-snug">
          {blog.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-secondary font-medium">
          <span>
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="w-1 h-1 bg-secondary rounded-full"></span>
          <span>{blog.read_time || "5"} min read</span>
        </div>
      </div>
    </div>
  );
}
