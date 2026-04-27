import { Calendar, Clock } from "lucide-react";
import BlogActions from "./BlogActions";

export default function BlogHeader({ blog }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:mr-110 pt-8">
      {/* Action bar */}
      <BlogActions />

      {/* Title + meta */}
      <div className="space-y-4 mt-6">
        <h1 className="text-3xl tracking-tight leading-snug font-bold text-primary">
          {blog.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-secondary font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="w-1 h-1 bg-secondary/40 rounded-full" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {blog.read_time || "5"} min read
          </span>
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {blog.tags.map((tag) => (
              <span
                key={tag.toLowerCase()}
                className="px-2 py-0.5 rounded-sm text-xs font-mono border border-borders/40 text-secondary
                  hover:border-accent/30 hover:text-accent transition-all duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
