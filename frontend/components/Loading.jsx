"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Scanning animation */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-accent/20 rounded-sm" />
        {/* Scanning line */}
        <div className="absolute inset-x-0 h-0.5 bg-accent/60 animate-scan" />
        {/* Corner dots */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-accent" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-accent" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-accent" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-accent" />
      </div>

      <p className="text-sm font-mono text-secondary animate-pulse">
        <span className="text-accent">$</span> loading...
      </p>
    </div>
  );
}
