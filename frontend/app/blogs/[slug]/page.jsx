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
import { useIntersectionObserver } from "@uidotdev/usehooks";

export default function BlogPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);

  // Track visible headings for TOC highlighting
  const [refs, setRefs] = useState([]);

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
    if (refs.length === 0) return;

    const observers = refs.map((ref, index) => {
      const [entry, observer] = useIntersectionObserver(ref, {
        threshold: 0.5,
        rootMargin: "-100px 0px -50% 0px",
      });

      if (entry?.isIntersecting) {
        setActiveHeading(headings[index].id);
      }

      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [refs, headings]);

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
      alert("Link copied to clipboard!");
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Implement actual save functionality here
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveHeading(id);
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
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80"
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

      <div className="min-h-screen bg-background text-primary">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-borders/30 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-secondary hover:text-accent"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="text-secondary hover:text-accent"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isSaved ? "fill-accent text-accent" : ""
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="text-secondary hover:text-accent"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Table of Contents Sidebar */}
        <aside className="hidden lg:block fixed right-0 top-0 h-full w-fit border-l border-[#e0e0e0] pb-6 pr-10 pl-10 pt-32 overflow-y-auto scrollbar-hide">
          <div className="mb-8">
            <Image
              src="/ninja_reading.png"
              alt="Reading Ninja"
              width={160}
              height={160}
              className="mb-4"
            />
            <div className="space-y-2 text-sm">
              <p className="items-center gap-1 mb-8">
                <span className="text-accent font-bold text-2xl">{">_"} Published:</span>
                <br />
                <span className="text-secondary">
                  on{" "}
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="items-center gap-1 mb-8">
                <span className="text-accent font-bold text-2xl">{">_ "}Read time:</span>
                <br />
                <span className="flex gap-x-2 pl-2 text-secondary">
                  <Clock className="w-4 h-4" /> {blog.read_time || "5 min"}
                </span>
              </p>
              {blog.tags?.length > 0 && (
                <div className="mt-2">
                  <span className="text-accent font-bold text-2xl mb-8">{">_ "}Tags:</span>
                  <br />
                  <p className="flex flex-wrap gap-x-2 pl-2 pt-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-borders/10 border border-accent px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>

          <h3 className="font-bold text-2xl text-accent mb-4 flex items-center gap-1">
            <span>{">_"} Article Tree</span>
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
                className={`block text-base py-1 px-2 rounded transition-colors ${
                  activeHeading === heading.id
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "hover:text-accent hover:bg-borders/10"
                } ${heading.level === "h3" ? "ml-4" : ""}`}
              >
                - {heading.text}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:pr-64">
          <article
            className="max-w-[800px] mx-auto px-4 py-8 md:py-12"
            ref={contentRef}
          >
            {/* Article Header */}
            <header className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
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
                <div className="flex flex-wrap gap-2 mb-6">
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
                        toc: "hidden", // We hide the auto-generated TOC since we have our own
                      },
                    },
                  ],
                ]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      id={props.id}
                      ref={refs.find(
                        (ref, idx) => headings[idx]?.id === props.id
                      )}
                      className="text-2xl font-bold mt-12 mb-6 pt-2 border-t border-borders/30"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      id={props.id}
                      ref={refs.find(
                        (ref, idx) => headings[idx]?.id === props.id
                      )}
                      className="text-xl font-bold mt-8 mb-4"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <div className="my-6 rounded-lg overflow-hidden border border-borders/30">
                      <img {...props} className="mx-auto" />
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
                    <div {...props} className="my-4 leading-relaxed" />
                  ),
                }}
              />
            </div>

          </article>
        </main>
      </div>
    </>
  );
}
