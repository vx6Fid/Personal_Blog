"use client";

import React from "react";
import { ChevronRight, FileText } from "lucide-react";

export default function TOC({ headings, activeId, onClick, className }) {
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Minimal header */}
      <div className="flex items-center gap-2 px-1">
        <FileText className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-accent">Contents</span>
        <div className="ml-auto text-xs text-accent font-mono">
          {headings.length}
        </div>
      </div>

      {/* Content navigation */}
      <nav className="space-y-0.5">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === "h3";

          return (
            <button
              key={heading.id}
              onClick={() => onClick(heading.id)}
              className={`w-full text-left group relative flex items-center gap-2 py-2 px-2 rounded-md transition-all duration-200
                ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-accent/5"
                }`}
            >
              {/* Minimal indicator */}
              <div
                className={`w-1 h-4 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-accent/50 scale-110"
                    : "bg-transparent group-hover:bg-accent/40"
                }`}
              />

              {/* Chevron */}
              <ChevronRight
                className={`w-3 h-3 flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? "opacity-100 rotate-90 text-accent"
                    : "opacity-30 group-hover:opacity-60"
                }`}
              />

              {/* Text */}
              <span
                className={`text-sm truncate transition-all duration-300 ${
                  isActive ? "font-medium" : "font-normal"
                }`}
              >
                {heading.text}
              </span>

              {/* Minimal line number */}
              <div
                className={`ml-auto text-xs font-mono transition-all duration-300 ${
                  isActive
                    ? "text-accent opacity-100"
                    : "text-accent/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Subtle divider */}
      <div className="border-t border-gray-200 pt-2">
        <div className="text-xs text-gray-500 text-center font-mono">─────</div>
      </div>
    </div>
  );
}
