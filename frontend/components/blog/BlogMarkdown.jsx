"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import TOC from "./BlogTOC";
import { Menu, X } from "lucide-react";

/* ── Image Lightbox ── */
function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-secondary hover:text-primary transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <Image
        src={src}
        alt={alt || ""}
        width={1400}
        height={0}
        className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-sm"
      />
    </div>
  );
}

/* ── Clickable Image ── */
function ClickableImage({ src, alt, onOpen }) {
  return (
    <figure className="my-6 rounded-sm border border-borders/30 text-center overflow-hidden">
      <Image
        src={src}
        alt={alt || ""}
        width={800}
        height={0}
        className="mx-auto w-auto max-w-[80%] md:max-w-3xl h-auto object-contain cursor-zoom-in
          transition-transform duration-200 hover:scale-[1.01]"
        onClick={() => onOpen(src, alt)}
      />
      {alt && (
        <figcaption className="mt-2 pb-3 text-sm text-secondary">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Markdown Components ── */
function createComponents(onImageOpen) {
  return {
    p: ({ children }) => {
      if (
        Array.isArray(children) &&
        children.length === 1 &&
        children[0]?.type === "img"
      ) {
        const imgProps = children[0].props;
        return (
          <ClickableImage
            src={imgProps.src}
            alt={imgProps.alt}
            onOpen={onImageOpen}
          />
        );
      }
      return <p className="my-6 leading-relaxed text-primary">{children}</p>;
    },

    h1: ({ children, ...props }) => (
      <h1
        className="text-4xl font-extrabold text-primary leading-tight mt-16 mb-8 scroll-mt-24 tracking-tight"
        {...props}
      >
        {children}
      </h1>
    ),

    h2: ({ children, ...props }) => (
      <h2
        className="relative text-2xl font-semibold text-primary leading-snug mt-12 mb-6 scroll-mt-20 pb-2 tracking-tight
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:h-0.5 after:w-16 after:bg-accent/40 after:rounded-full
          hover:after:w-24 after:transition-all after:duration-300"
        {...props}
      >
        {children}
      </h2>
    ),

    h3: ({ children, ...props }) => (
      <h3
        className="text-xl font-medium text-primary/90 leading-snug mt-10 mb-4 scroll-mt-16"
        {...props}
      >
        {children}
      </h3>
    ),

    h4: ({ children, ...props }) => (
      <h4
        className="text-lg font-medium text-primary/80 leading-snug mt-8 mb-3 scroll-mt-12"
        {...props}
      >
        {children}
      </h4>
    ),

    strong: ({ children }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),

    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      if (!inline && match) {
        return (
          <div className="rounded-sm overflow-hidden border border-borders/20 my-4">
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: "0px",
                border: "none",
                boxShadow: "none",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        );
      }
      return (
        <code
          className="bg-code text-primary px-1.5 py-0.5 rounded-sm text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent/40 pl-4 text-secondary italic bg-accent/[0.03] py-3 rounded-sm">
        {children}
      </blockquote>
    ),
  };
}

/* ── Main Component ── */
export default function BlogMarkdown({ content }) {
  const contentRef = useRef(null);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = useCallback((src, alt) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const components = React.useMemo(
    () => createComponents(openLightbox),
    [openLightbox],
  );

  // Extract headings
  useEffect(() => {
    if (!contentRef.current) return;
    const timeout = setTimeout(() => {
      const els = contentRef.current.querySelectorAll("h2, h3");
      if (els.length > 0) {
        setHeadings(
          Array.from(els).map((el) => ({
            id: el.id,
            text: el.textContent || "",
            level: el.tagName.toLowerCase(),
          })),
        );
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [content]);

  // Intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;
    const observers = headings.map((heading) => {
      const el = document.getElementById(heading.id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveHeading(heading.id);
        },
        { rootMargin: "-20% 0px -70% 0px" },
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [headings]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      setActiveHeading(id);
      setShowMobileTOC(false);
    }
  };

  return (
    <div className="relative">
      {/* Lightbox */}
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={closeLightbox}
        />
      )}

      {/* Mobile TOC Toggle */}
      {headings.length > 0 && (
        <button
          onClick={() => setShowMobileTOC(!showMobileTOC)}
          className="lg:hidden fixed top-24 right-4 z-40 bg-background border border-borders rounded-sm p-2 shadow-lg"
          aria-label="Toggle table of contents"
        >
          {showMobileTOC ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Desktop TOC */}
      {headings.length > 0 && (
        <aside className="hidden lg:block fixed right-8 top-24 w-[500px] px-2 h-[calc(100vh-96px)] overflow-y-auto">
          <div className="bg-background/80 backdrop-blur-sm rounded-sm border border-borders/40 p-4">
            <TOC
              headings={headings}
              activeId={activeHeading}
              onClick={scrollToHeading}
            />
          </div>
        </aside>
      )}

      {/* Mobile TOC Overlay */}
      {showMobileTOC && headings.length > 0 && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-sm p-6 pt-20">
          <div className="bg-background rounded-sm border border-borders p-6 max-h-[80vh] overflow-y-auto">
            <TOC
              headings={headings}
              activeId={activeHeading}
              onClick={scrollToHeading}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div ref={contentRef} className="max-w-none">
        <article className="text-primary prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath, remarkDirective]}
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
