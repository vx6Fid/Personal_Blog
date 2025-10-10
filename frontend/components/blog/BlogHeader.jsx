import { Calendar, Clock } from "lucide-react";
import React from "react";

export default function BlogHeader({ blog }) {
  return (
    <div className="max-w-4xl mr-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div className="space-y-4">
        <h1 className="text-3xl tracking-tight leading-snug font-bold">
          {blog.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-secondary font-medium">
          <span className="flex items-center gap-2">
            <span className="p-1">
              <Calendar />
            </span>
            <span>
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </span>
          <span className="w-1 h-1 bg-secondary rounded-full"></span>
          <span className="flex items-center gap-2">
            {" "}
            <span>
              <Clock />
            </span>
            <span>{blog.read_time || "5"} min read</span>
          </span>
        </div>
        {/* Blog tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {blog.tags.map((tag) => (
            <span
              key={tag.toLowerCase()}
              className="
                px-3 py-1 rounded-sm text-sm font-medium
                bg-background text-secondary border border-borders
                backdrop-blur-sm transition-all duration-200 ease-out
                hover:bg-accent/10 hover:text-accent hover:border-accent/10
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
