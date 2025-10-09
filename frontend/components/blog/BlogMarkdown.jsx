"use client";

import React, { useEffect, useRef, useState } from "react";
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

const components = {
  // Override paragraph to check if it only contains an image
  p: ({ node, children }) => {
    // If children is a single <img> element, return it directly
    if (children.length === 1 && children[0].type === "img") {
      const imgProps = children[0].props;
      return (
        <figure className="my-6 text-center bg-background p-2 rounded-lg border border-borders">
          <Image
            src={imgProps.src}
            alt={imgProps.alt || ""}
            width={800}
            height={0}
            className="w-full h-auto rounded-lg"
          />

          {imgProps.alt && (
            <figcaption className="mt-2 text-sm text-secondary">
              {imgProps.alt}
            </figcaption>
          )}
        </figure>
      );
    }
    // Otherwise, render normal paragraph
    return <p className="my-6 leading-relaxed text-primary">{children}</p>;
  },

  // Headings with better spacing
  h1: ({ children, ...props }) => (
    <h1
      className="text-2xl font-medium mt-12 mb-6 tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-xl font-medium mt-10 mb-4 tracking-tight border-b border-borders pb-2"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-lg font-normal mt-8 mb-3 tracking-tight border-b border-borders pb-2"
      {...props}
    >
      {children}
    </h3>
  ),

  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");

    if (!inline && match) {
      return (
        <div className="rounded-lg overflow-hidden">
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: "0px",
              border: "none", // remove border
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
        className="bg-code text-primary py-1 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  // Blockquotes with square design
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-borders pl-4 text-secondary italic bg-borders/5 py-3 rounded-r-lg">
      {children}
    </blockquote>
  ),
};

export default function BlogMarkdown({ content }) {
  const contentRef = useRef(null);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [showMobileTOC, setShowMobileTOC] = useState(false);

  // Extract headings from content
  useEffect(() => {
    if (!contentRef.current) return;

    const timeout = setTimeout(() => {
      const headingElements = contentRef.current.querySelectorAll("h2, h3");
      if (headingElements.length > 0) {
        const headingData = Array.from(headingElements).map((el) => ({
          id: el.id,
          text: el.textContent || "",
          level: el.tagName.toLowerCase(),
        }));
        console.log("headingData", headingData);
        setHeadings(headingData);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [content]);

  // Intersection Observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observers = headings.map((heading) => {
      const element = document.getElementById(heading.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveHeading(heading.id);
          }
        },
        { rootMargin: "-20% 0px -70% 0px" },
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
      setActiveHeading(id);
      setShowMobileTOC(false);
    }
  };

  return (
    <div className="relative">
      {/* Mobile TOC Toggle */}
      {headings.length > 0 && (
        <button
          onClick={() => setShowMobileTOC(!showMobileTOC)}
          className="lg:hidden fixed top-24 right-4 z-40 bg-background border border-borders rounded-lg p-2 shadow-lg"
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
        <aside className="hidden lg:block fixed right-8 top-24 w-64 h-[calc(100vh-96px)] overflow-y-auto">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-borders p-4">
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
          <div className="bg-background rounded-lg border border-borders p-6 max-h-[80vh] overflow-y-auto">
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
        <article className="prose prose-lg max-w-none">
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
