export default function StructuredData({ blog }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.content?.substring(0, 160) + "...",
    datePublished: new Date(blog.created_at).toISOString(),
    dateModified: new Date(blog.updated_at || blog.created_at).toISOString(),
    author: {
      "@type": "Person",
      name: "vx6fid",
    },
    image:
      blog.cover_image ||
      "https://images.alphacoders.com/591/thumb-1920-591050.jpg",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
