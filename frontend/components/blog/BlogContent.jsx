"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import BlogMarkdown from "./BlogMarkdown";
import TOC from "./BlogTOC";

export default function BlogContent({ content }) {
  const contentRef = useRef(null);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [showMobileTOC, setShowMobileTOC] = useState(false);

  // Extract headings after markdown renders
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
    }, 150);
    return () => clearTimeout(timeout);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const offset = 100;
      let current = headings[0]?.id || "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActiveHeading(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveHeading(id);
      setShowMobileTOC(false);
    }
  }, []);

  return (
    <>
      {/* Mobile TOC Toggle */}
      {headings.length > 0 && (
        <button
          onClick={() => setShowMobileTOC(!showMobileTOC)}
          className="lg:hidden fixed top-24 right-4 z-40 bg-background border border-borders rounded-sm p-2"
          aria-label="Toggle table of contents"
        >
          {showMobileTOC ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile TOC Overlay */}
      {showMobileTOC && headings.length > 0 && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-sm p-6 pt-20">
          <div className="bg-background rounded-sm border border-borders p-6 max-h-[80vh] overflow-y-auto">
            <TOC headings={headings} activeId={activeHeading} onClick={scrollToHeading} />
          </div>
        </div>
      )}

      {/* Desktop grid: content + TOC */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Content column */}
          <div ref={contentRef} className="min-w-0 max-w-[720px]">
            <BlogMarkdown content={content} />
          </div>

          {/* TOC column — sticky on desktop */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-sm border border-borders/30 p-4 bg-background/50 backdrop-blur-sm">
                <TOC headings={headings} activeId={activeHeading} onClick={scrollToHeading} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
