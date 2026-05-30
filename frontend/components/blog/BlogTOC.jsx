"use client";

import React from "react";

export default function TOC({ headings, activeId, onClick }) {
  if (!headings || headings.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-display text-accent uppercase tracking-[0.2em]">
          Index
        </span>
        <span className="text-xs text-accent/50 font-mono">{headings.length}</span>
      </div>

      <div className="h-px bg-accent/20" />

      {/* Navigation */}
      <nav className="space-y-0.5" aria-label="Table of contents">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === "h3";

          return (
            <button
              key={heading.id}
              onClick={() => onClick(heading.id)}
              className={`w-full text-left flex items-start gap-2 py-2 px-3 rounded-sm transition-all duration-150
                ${isH3 ? "pl-6" : ""}
                ${
                  isActive
                    ? "bg-accent/10 border-l-2 border-accent text-accent"
                    : "border-l-2 border-transparent text-secondary hover:text-primary hover:bg-borders/10"
                }`}
              aria-current={isActive ? "true" : undefined}
            >
              <span className={`text-sm leading-snug ${isActive ? "font-medium" : ""}`}>
                {heading.text}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
