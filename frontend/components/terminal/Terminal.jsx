"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SquareTerminal } from "lucide-react";
import { createFS, executeCommand, getCompletions } from "./TerminalFS";

const GREETING = [
  "",
  { segments: [{ text: "        ╭──────────────────────╮", color: "secondary" }] },
  { segments: [{ text: "        │  ", color: "secondary" }, { text: "vx6Fid", color: "accent" }, { text: "@site         │", color: "secondary" }] },
  { segments: [{ text: "        ├──────────────────────┤", color: "secondary" }] },
  { segments: [{ text: "        │  OS     ", color: "secondary" }, { text: "Next.js 15", color: "accent" }, { text: "   │", color: "secondary" }] },
  { segments: [{ text: "        │  Shell  ", color: "secondary" }, { text: "vx6term", color: "accent" }, { text: "      │", color: "secondary" }] },
  { segments: [{ text: "        │  Theme  ", color: "secondary" }, { text: "adaptive", color: "accent" }, { text: "     │", color: "secondary" }] },
  { segments: [{ text: "        │  Blogs  ", color: "secondary" }, { text: "loading...", color: "accent" }, { text: "   │", color: "secondary" }] },
  { segments: [{ text: "        ╰──────────────────────╯", color: "secondary" }] },
  "",
  { segments: [{ text: '  Type "', color: "secondary" }, { text: "help", color: "accent" }, { text: '" for commands. "', color: "secondary" }, { text: "exit", color: "accent" }, { text: '" to close.', color: "secondary" }] },
  "",
];

const COLOR_MAP = {
  accent: "text-accent",
  secondary: "text-secondary",
  error: "text-error",
  primary: "text-primary",
};

function renderLine(line, key) {
  // Empty string = blank line
  if (line === "" || line === undefined) return <div key={key}>&nbsp;</div>;

  // Plain string
  if (typeof line === "string") {
    return (
      <div key={key} className="text-primary whitespace-pre-wrap">
        {line}
      </div>
    );
  }

  // Segments array (from TerminalFS output)
  if (Array.isArray(line)) {
    return (
      <div key={key} className="whitespace-pre-wrap">
        {line.map((seg, i) =>
          typeof seg === "string" ? (
            <span key={i} className="text-primary">{seg}</span>
          ) : (
            <span key={i} className={COLOR_MAP[seg.color] || "text-primary"}>
              {seg.text}
            </span>
          ),
        )}
      </div>
    );
  }

  // Object with segments (greeting format)
  if (line.segments) {
    return (
      <div key={key} className="whitespace-pre-wrap">
        {line.segments.map((seg, i) => (
          <span key={i} className={COLOR_MAP[seg.color] || "text-primary"}>
            {seg.text}
          </span>
        ))}
      </div>
    );
  }

  // Object with type/text (prompt, system, output)
  if (line.type === "prompt") {
    return (
      <div key={key} className="text-accent">
        {line.text}
      </div>
    );
  }
  if (line.type === "system") {
    // Could be string or segments object
    if (typeof line.text === "object" && line.text?.segments) {
      return renderLine(line.text, key);
    }
    return (
      <div key={key} className="text-secondary whitespace-pre-wrap">
        {line.text}
      </div>
    );
  }

  return (
    <div key={key} className="text-primary whitespace-pre-wrap">
      {line.text || ""}
    </div>
  );
}

export default function Terminal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [tree, setTree] = useState(() => createFS());
  const [booted, setBooted] = useState(false);
  const [blogCount, setBlogCount] = useState(0);
  const [completions, setCompletions] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Boot sequence
  useEffect(() => {
    if (!open || booted) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < GREETING.length) {
        const item = GREETING[i];
        setLines((prev) => [...prev, item]);
        i++;
      } else {
        clearInterval(interval);
        setBooted(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [open, booted]);

  // Update blog count in greeting
  useEffect(() => {
    if (blogCount > 0 && booted) {
      setLines((prev) =>
        prev.map((line) => {
          if (
            line?.segments &&
            line.segments.some((s) => s.text === "loading...")
          ) {
            return {
              segments: line.segments.map((s) =>
                s.text === "loading..."
                  ? { ...s, text: `${blogCount} posts ` }
                  : s,
              ),
            };
          }
          return line;
        }),
      );
    }
  }, [blogCount, booted]);

  // Fetch data
  useEffect(() => {
    if (!open) return;
    async function loadData() {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!url) return;
        const [blogsRes, projectsRes] = await Promise.all([
          fetch(`${url}/blogs`).then((r) => (r.ok ? r.json() : { blogs: [] })),
          fetch(`${url}/projects`).then((r) => (r.ok ? r.json() : { data: [] })),
        ]);
        const blogs = blogsRes.blogs || [];
        setTree(createFS(blogs, projectsRes.data || []));
        setBlogCount(blogs.length);
      } catch { /* silent */ }
    }
    loadData();
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "`" && e.ctrlKey) {
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus + lock scroll
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const setTheme = useCallback((mode) => {
    document.documentElement.classList.toggle("light", mode === "light");
    localStorage.setItem("theme", mode);
  }, []);

  const navigate = useCallback((path) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const closeTerminal = useCallback(() => {
    setOpen(false);
    setLines([]);
    setBooted(false);
    setCwd("/");
    setBlogCount(0);
  }, []);

  // Async: fortune (joke API)
  const handleFortune = useCallback(async () => {
    setLines((prev) => [...prev, [{ text: "  Fetching joke...", color: "secondary" }]]);
    try {
      const res = await fetch("https://official-joke-api.appspot.com/jokes/programming/random");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const joke = Array.isArray(data) ? data[0] : data;
      setLines((prev) => [
        ...prev.slice(0, -1), // remove "Fetching..."
        [{ text: `  ${joke.setup}`, color: "accent" }],
        [{ text: `  ${joke.punchline}`, color: "secondary" }],
      ]);
    } catch {
      setLines((prev) => [
        ...prev.slice(0, -1),
        [{ text: "  Couldn't fetch a joke. The API must be having a bad day.", color: "error" }],
      ]);
    }
  }, []);

  // Async: ping (real fetch)
  const handlePing = useCallback(async (target) => {
    if (!target) {
      setLines((prev) => [...prev, [{ text: "  Usage: ping <url>", color: "error" }]]);
      return;
    }
    const url = target.startsWith("http") ? target : `https://${target}`;
    setLines((prev) => [...prev, [{ text: `  PING ${target}...`, color: "secondary" }]]);
    const start = performance.now();
    try {
      await fetch(url, { mode: "no-cors", cache: "no-store" });
      const ms = (performance.now() - start).toFixed(1);
      setLines((prev) => [
        ...prev,
        [{ text: `  ✓ ${target}`, color: "accent" }, { text: ` responded in ${ms}ms` }],
      ]);
    } catch {
      setLines((prev) => [
        ...prev,
        [{ text: `  ✗ ${target}`, color: "error" }, { text: " — unreachable or blocked by CORS", color: "secondary" }],
      ]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setCompletions([]);
    setLines((prev) => [...prev, { type: "prompt", text: `${cwd} $ ${cmd}` }]);

    const result = executeCommand(cmd, cwd, tree, navigate, setTheme);

    if (result.output === "__CLEAR__") {
      setLines([]);
    } else if (result.output === "__EXIT__") {
      closeTerminal();
      setInput("");
      return;
    } else if (result.output === "__ASYNC_FORTUNE__") {
      handleFortune();
    } else if (result.output === "__ASYNC_PING__") {
      handlePing(result.pingTarget);
    } else if (result.output === "__HISTORY__") {
      const histLines = history.length > 0
        ? history.map((h, i) => [
            { text: `  ${String(i + 1).padStart(4)} `, color: "secondary" },
            { text: h, color: "accent" },
          ])
        : [[{ text: "  (no history)", color: "secondary" }]];
      setLines((prev) => [...prev, ...histLines]);
    } else if (Array.isArray(result.output)) {
      setLines((prev) => [...prev, ...result.output]);
    }

    setCwd(result.cwd);
    setInput("");
  };

  const handleKeyDown = (e) => {
    // Dismiss completions on any key except Tab
    if (e.key !== "Tab") setCompletions([]);

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) { setHistoryIdx(-1); setInput(""); }
      else { setHistoryIdx(idx); setInput(history[idx]); }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const matches = getCompletions(input, cwd, tree);
      if (matches.length === 1) {
        setInput(matches[0]);
        setCompletions([]);
      } else if (matches.length > 1) {
        setCompletions(matches);
      } else {
        setCompletions([]);
      }
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-sm
          border border-accent/40 bg-background/95 backdrop-blur-sm
          text-accent text-sm font-mono
          hover:bg-accent/10 hover:border-accent/60
          hover:shadow-[0_0_24px_-4px_rgba(0,255,178,0.2)]
          transition-all duration-300 animate-fade-in"
        aria-label="Open terminal"
      >
        <SquareTerminal className="w-4 h-4" />
        <span className="hidden sm:inline">terminal</span>
        <kbd className="hidden sm:inline text-xs text-secondary/60 ml-1">Ctrl+`</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/40 backdrop-blur-sm p-4 sm:p-8">
      <div
        className="w-full h-full max-w-7xl max-h-[90vh] flex flex-col font-mono
          rounded-sm border border-borders/50 bg-background/90 backdrop-blur-md
          shadow-[0_0_60px_-12px_rgba(0,255,178,0.08)] overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-borders/30 shrink-0">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <SquareTerminal className="w-3.5 h-3.5 text-accent" />
            <span className="text-accent">vx6fid</span>
            <span className="text-borders">:</span>
            <span className="text-primary">~{cwd === "/" ? "" : cwd}</span>
          </div>
          <span className="text-xs text-secondary/40">Ctrl+` · exit</span>
        </div>

        {/* Output */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed scrollbar-hide"
        >
          {lines.map((line, i) => renderLine(line, i))}
        </div>

        {/* Autocomplete popup */}
        {completions.length > 0 && (
          <div className="px-4 py-2 border-t border-borders/20 bg-background/95 shrink-0">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono">
              {completions.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInput(item);
                    setCompletions([]);
                    inputRef.current?.focus();
                  }}
                  className="text-accent hover:text-primary transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-borders/30 shrink-0"
        >
          <span className="text-accent text-sm shrink-0">{cwd} $</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-primary text-sm outline-none caret-accent"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
