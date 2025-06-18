import BlogClient from "@/pages/BlogClient";
import StructuredData from "@/components/StructuredData";
import { notFound } from "next/navigation";

async function fetchBlog(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);
  if (!blog) return { title: "Blog Not Found" };

  const fullUrl = `https://vx6fid.vercel.app/blogs/${slug}`;
  const imageUrl =
    blog.cover_image ||
    "https://images.alphacoders.com/591/thumb-1920-591050.jpg";
  const description = blog.content?.substring(0, 150) + "...";
  const publishedTime = new Date(blog.created_at).toISOString();
  const modifiedTime = new Date(
    blog.updated_at || blog.created_at,
  ).toISOString();

  return {
    title: `${blog.title} | Blog`,
    description,
    keywords: blog.tags?.join(", ") || "",
    openGraph: {
      title: `${blog.title} | Blog`,
      description,
      type: "article",
      url: fullUrl,
      publishedTime,
      modifiedTime,
      authors: [blog.author?.name || "Unknown"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Blog`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/blogs/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <StructuredData blog={blog} />
      <BlogClient blog={blog} />
    </>
  );
}
