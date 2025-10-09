import BlogFooter from "@/components/blog/BlogFooter";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogMarkdown from "@/components/blog/BlogMarkdown";

export default function BlogClient({ blog }) {
  return (
    <BlogLayout>
      <BlogHeader blog={blog} />
      <main className="max-w-4xl mr-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogMarkdown content={blog.content} />
      </main>
      <BlogFooter />
    </BlogLayout>
  );
}
