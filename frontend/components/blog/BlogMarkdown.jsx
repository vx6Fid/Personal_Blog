"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import Image from "next/image";
import { X, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

/* ── Image Lightbox ── */
function ImageLightbox({ src, alt, onClose }) {
  React.useEffect(() => {
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
        alt={alt || "Blog image"}
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
        alt={alt || "Blog image"}
        width={800}
        height={0}
        className="mx-auto w-auto max-w-full h-auto object-contain cursor-zoom-in
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

/* ── Code Block with copy button + language label ── */
function CodeBlock({ language, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-sm border border-borders/40 overflow-hidden bg-code">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-borders/30">
        <span className="text-xs text-accent/70 font-mono uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-secondary hover:text-accent transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          showLineNumbers
          lineNumberStyle={{ color: "var(--color-secondary)", opacity: 0.3, fontSize: "12px", minWidth: "2em" }}
          wrapLines
          lineProps={{ style: { background: "transparent" } }}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: 0,
            border: "none",
            boxShadow: "none",
            fontSize: "13px",
            lineHeight: "1.7",
            background: "transparent",
            overflow: "visible",
          }}
          codeTagProps={{ style: { background: "transparent" } }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
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
          <ClickableImage src={imgProps.src} alt={imgProps.alt} onOpen={onImageOpen} />
        );
      }
      return <p className="my-5 leading-[1.8] text-primary">{children}</p>;
    },

    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl font-bold text-primary leading-tight mt-14 mb-6 scroll-mt-24 tracking-tight font-display"
        {...props}
      >
        {children}
      </h1>
    ),

    h2: ({ children, ...props }) => (
      <h2
        className="relative text-2xl font-semibold text-primary leading-snug mt-12 mb-5 scroll-mt-24 pb-2 tracking-tight font-display
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:h-0.5 after:w-12 after:bg-accent/40 after:rounded-full"
        {...props}
      >
        {children}
      </h2>
    ),

    h3: ({ children, ...props }) => (
      <h3
        className="text-xl font-medium text-primary/90 leading-snug mt-10 mb-4 scroll-mt-24 font-display"
        {...props}
      >
        {children}
      </h3>
    ),

    h4: ({ children, ...props }) => (
      <h4
        className="text-lg font-medium text-primary/80 leading-snug mt-8 mb-3 scroll-mt-24 font-display"
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
        return <CodeBlock language={match[1]} {...props}>{children}</CodeBlock>;
      }
      return (
        <code className="bg-code text-accent/90 px-1.5 py-0.5 rounded-sm text-sm font-mono">
          {children}
        </code>
      );
    },

    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent/40 pl-4 text-secondary italic bg-accent/5 py-3 rounded-sm">
        {children}
      </blockquote>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-accent underline underline-offset-2 decoration-accent/30 hover:decoration-accent transition-colors"
      >
        {children}
      </a>
    ),

    ul: ({ children }) => (
      <ul className="my-4 space-y-2 list-disc list-inside marker:text-accent/50">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="my-4 space-y-2 list-decimal list-inside marker:text-accent/50">
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  };
}

/* ── Main Component ── */
export default function BlogMarkdown({ content }) {
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = useCallback((src, alt) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const components = useMemo(() => createComponents(openLightbox), [openLightbox]);

  return (
    <div>
      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}

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
  );
}
