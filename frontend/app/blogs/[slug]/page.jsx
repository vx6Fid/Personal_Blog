"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Bookmark,
  Share2,
} from "lucide-react";
import Head from "next/head";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Image from "next/image";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

export default function BlogPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeHeading, setActiveHeading] = useState("");
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const headingRefs = useRef({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Blog post not found"
              : "Failed to fetch blog post"
          );
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll("h2, h3");

    const headingData = Array.from(headingElements).map((el) => ({
      id: el.id,
      text: el.textContent,
      level: el.tagName.toLowerCase(),
    }));

    setHeadings(headingData);
  }, [blog]);

  // Set up intersection observers for headings
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveHeading(entry.target.id);

            // Smooth scroll the TOC to the active item
            const tocItem = document.querySelector(
              `a[href="#${entry.target.id}"]`
            );
            if (tocItem) {
              tocItem.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        });
      },
      {
        rootMargin: "-100px 0px -40% 0px",
        threshold: [0, 0.5, 1],
      }
    );

    // Observe all heading elements
    Object.values(headingRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog?.title || "Blog Post",
          text: blog?.content.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        style: {
          background: "#0a0a0a",
          color: "#00ffb2",
          border: "1px solid #424242",
        },
        icon: "✓",
      });
    }
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveHeading(id);
      setShowMobileTOC(false);
    }
  };

  const setHeadingRef = (element, id) => {
    if (element) {
      headingRefs.current[id] = element;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse h-8 w-8 mx-auto mb-4 bg-accent/20 rounded-full"></div>
          <p className="text-secondary">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Error Loading Article</h1>
          <p className="text-secondary mb-6">{error}</p>
          <button
            onClick={() => router.push("/blogs")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </button>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <>
      <Head>
        <title>{blog.title} | Your Blog</title>

        <meta
          name="description"
          content={blog.content.substring(0, 160) + "..."}
        />
      </Head>
      {/* Mobile TOC Toggle Button */}
      <button
        onClick={() => setShowMobileTOC(!showMobileTOC)}
        className="lg:hidden fixed left-2 bottom-2 z-50 flex items-center px-3 py-2 bg-background/80 backdrop-blur-sm text-accent border border-borders/30 rounded-lg hover:bg-borders/10 transition-colors shadow-sm"
      >
        <span className="text-sm font-medium">Contents</span>
      </button>
      <div className="min-h-screen bg-background text-primary relative">
        {/* Back Button*/}
        <button
          onClick={() => router.back()}
          className="fixed top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-sm border border-borders/30 rounded-lg hover:bg-borders/10 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Mobile TOC Overlay */}
        {showMobileTOC && (
          <div className="fixed inset-0 z-30 bg-background/95 backdrop-blur-sm lg:hidden p-6 overflow-y-auto">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Table of Contents</h2>
                <button
                  onClick={() => setShowMobileTOC(false)}
                  className="p-2 hover:bg-borders/10 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">
                    {blog.read_time || "5 min"} read
                  </span>
                </div>
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-borders/10 border border-accent px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <nav className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(heading.id);
                    }}
                    className={`block text-base py-2 px-3 rounded transition-all duration-200 ${
                      activeHeading === heading.id
                        ? "bg-accent/10 text-accent border-l-2 border-accent font-medium"
                        : "hover:text-accent hover:bg-borders/10"
                    } ${heading.level === "h3" ? "ml-4 text-sm" : ""}`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Table of Contents Sidebar */}
        <aside className="hidden lg:block fixed right-0 top-0 h-full w-80 xl:w-96 border-l border-borders/30 pb-6 pr-6 pl-8 pt-24 overflow-y-auto bg-background/80 backdrop-blur-sm">
          {/* Header section - sticky at top */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4 pt-4">
            <Image
              src="/ninja_reading.png"
              alt="Reading Ninja"
              width={120}
              height={120}
              className="mb-4 mx-auto"
            />

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-secondary">
                Published on{" "}
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm text-secondary">
                Read Time:{""}
                <span> {blog.read_time || "5 min"}</span>
              </p>
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex items-start gap-3 mb-8">
                <div className="bg-accent/10 p-2 rounded-lg mt-1">
                  <Tag className="w-5 h-5 text-accent" />
                </div>
                <div className="flex flex-wrap mt-2 gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-borders/10 border border-accent px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="sticky top-[300px] z-0 pb-8">
              <div className="border-t border-borders/30 pt-6">
                <h3 className="font-bold text-lg text-accent mb-4 flex items-center gap-2">
                  <span>Article Tree</span>
                </h3>
                <nav className="space-y-2">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(heading.id);
                      }}
                      className={`block text-sm py-2 px-3 rounded transition-all duration-200 ${
                        activeHeading === heading.id
                          ? "bg-accent/10 text-accent border-l-2 border-accent font-medium scale-[1.02]"
                          : "hover:text-accent hover:bg-borders/10"
                      } ${
                        heading.level === "h3" ? "ml-4 text-sm" : "text-base"
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:pr-80 xl:pr-96">
          <article
            className="max-w-3xl mx-auto px-4 py-8 md:py-12 lg:px-8"
            ref={contentRef}
          >
            {/* Article Header */}
            <header className="mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.read_time || "5 min"} read</span>
                </div>
              </div>

              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-borders/10 text-secondary px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              <MarkdownPreview
                source={blog.content}
                className="!bg-transparent !text-primary"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [
                    rehypeToc,
                    {
                      headings: ["h2", "h3"],
                      cssClasses: {
                        toc: "hidden",
                      },
                    },
                  ],
                ]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      id={props.id}
                      ref={(el) => setHeadingRef(el, props.id)}
                      className="text-2xl font-bold mt-16 mb-6 pt-4 border-t border-borders/30 scroll-mt-24"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      id={props.id}
                      ref={(el) => setHeadingRef(el, props.id)}
                      className="text-xl font-bold mt-12 mb-4 scroll-mt-24"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <div className="my-8 rounded-lg overflow-hidden border border-borders/30">
                      <img
                        {...props}
                        className="mx-auto"
                        alt={props.alt || ""}
                      />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      {...props}
                      className="!bg-borders/10 !text-primary/90 !px-2 !py-1 !rounded"
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <div className="relative my-6">
                      <pre
                        {...props}
                        className="!bg-borders/10 !rounded-lg !p-4 !overflow-x-auto"
                      />
                    </div>
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="!text-accent hover:!text-accent/80 !no-underline hover:!underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <div
                      {...props}
                      className="my-6 leading-relaxed text-secondary/90"
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-accent pl-4 my-6 italic text-secondary/80"
                    />
                  ),
                }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-borders/30">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 bg-borders/10 hover:bg-borders/20 hover:text-accent hover:cursor-pointer rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to articles</span>
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-borders/10 hover:text-accent hover:cursor-pointer rounded-full"
                    aria-label="Share article"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </footer>
          </article>
        </main>
      </div>
    </>
  );
}
