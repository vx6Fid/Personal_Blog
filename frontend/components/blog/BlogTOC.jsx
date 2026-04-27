"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function TOC({ headings, activeId, onClick, className }) {
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-1 text-xs font-mono">
        <span className="text-accent">▸</span>
        <span className="text-accent font-medium uppercase tracking-wider">
          Index
        </span>
        <span className="ml-auto text-secondary/50">[{headings.length}]</span>
      </div>

      <div className="h-px bg-borders/30" />

      {/* Navigation */}
      <nav className="space-y-0.5">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === "h3";

          return (
            <button
              key={heading.id}
              onClick={() => onClick(heading.id)}
              className={`w-full text-left group flex items-center gap-2 py-2.5 px-2 rounded-sm transition-all duration-200
                ${isH3 ? "pl-6" : ""}
                ${
                  isActive
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "text-secondary hover:text-primary hover:bg-borders/10 border-l-2 border-transparent"
                }`}
            >
              <ChevronRight
                className={`w-3 h-3 flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? "opacity-100 rotate-90 text-accent"
                    : "opacity-30 group-hover:opacity-60"
                }`}
              />

              <span
                className={`text-sm truncate transition-colors duration-200 ${
                  isActive ? "font-medium" : ""
                }`}
              >
                {heading.text}
              </span>

              <span
                className={`ml-auto text-xs font-mono transition-opacity duration-200 ${
                  isActive
                    ? "text-accent/60 opacity-100"
                    : "text-secondary/30 opacity-0 group-hover:opacity-100"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
