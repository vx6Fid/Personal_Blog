import BlogHeader from "@/components/blog/BlogHeader";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogContent from "@/components/blog/BlogContent";

export default function BlogClient({ blog }) {
  if (!blog) return null;
  return (
    <BlogLayout>
      <BlogHeader blog={blog} />
      <BlogContent content={blog.content || ""} />
    </BlogLayout>
  );
}
