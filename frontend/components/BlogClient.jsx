import BlogHeader from "@/components/blog/BlogHeader";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogMarkdown from "@/components/blog/BlogMarkdown";

export default function BlogClient({ blog }) {
  if (!blog) return null;
  return (
    <BlogLayout>
      <BlogHeader blog={blog} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:mr-110 py-8">
        <BlogMarkdown content={blog.content || ""} />
      </main>
    </BlogLayout>
  );
}
