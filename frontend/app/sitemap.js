const BASE_URL = "https://vx6fid.vercel.app";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.7 },
  ];

  // Dynamic blog pages
  let blogPages = [];
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (url) {
      const res = await fetch(`${url}/blogs`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const blogs = data.blogs || [];
        blogPages = blogs.map((blog) => ({
          url: `${BASE_URL}/blogs/${blog.slug}`,
          lastModified: new Date(blog.updated_at || blog.created_at),
          priority: 0.7,
        }));
      }
    }
  } catch {
    // Silently fail — sitemap still works with static pages
  }

  return [...staticPages, ...blogPages];
}
