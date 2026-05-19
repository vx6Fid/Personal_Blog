"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SquareTerminal } from "lucide-react";
import { createFS, executeCommand, getCompletions } from "./TerminalFS";

const COLOR_MAP = {
  accent: "text-accent",
  secondary: "text-secondary",
  error: "text-error",
  primary: "text-primary",
};

function renderLine(line, key) {
  if (line === "" || line === undefined) return <div key={key}>&nbsp;</div>;

  if (typeof line === "string") {
    return (
      <div key={key} className="text-primary whitespace-pre-wrap">
        {line}
      </div>
    );
  }

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
          )
        )}
      </div>
    );
  }

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

  if (line.type === "prompt") {
    return (
      <div key={key} className="text-accent">
        {line.text}
      </div>
    );
  }

  if (line.type === "system") {
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
  const [completions, setCompletions] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

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

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const setTheme = useCallback((mode) => {
    document.documentElement.classList.toggle("light", mode === "light");
    localStorage.setItem("theme", mode);
  }, []);

  const navigate = useCallback(
    (path) => {
      router.push(path);
      setOpen(false);
    },
    [router]
  );

  const closeTerminal = useCallback(() => {
    setOpen(false);
    setLines([]);
    setCwd("/");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cmd = input.trim();
    if (!cmd) return;

    setHistory((p) => [...p, cmd]);
    setHistoryIdx(-1);
    setCompletions([]);

    setLines((p) => [...p, { type: "prompt", text: `${cwd} $ ${cmd}` }]);

    const result = executeCommand(cmd, cwd, tree, navigate, setTheme);

    if (result.output === "__CLEAR__") {
      setLines([]);
    } else if (result.output === "__EXIT__") {
      closeTerminal();
    } else if (Array.isArray(result.output)) {
      setLines((p) => [...p, ...result.output]);
    } else if (!result.output) {
      setLines((p) => [
        ...p,
        [{ text: "command not found", color: "error" }],
        [{ text: 'try "help"', color: "secondary" }],
      ]);
    }

    setCwd(result.cwd);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Tab") setCompletions([]);

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx =
        historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const matches = getCompletions(input, cwd, tree);
      if (matches.length === 1) {
        setInput(matches[0]);
        setCompletions([]);
      } else {
        setCompletions(matches);
      }
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5
        border border-accent/40 bg-background/95 text-accent text-sm font-mono"
      >
        <SquareTerminal className="w-4 h-4" />
        terminal
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-background/40 backdrop-blur-sm p-4">
      <div
        className="w-full h-full flex flex-col font-mono border border-borders/50 bg-background/90"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex justify-between px-4 py-2 border-b border-borders/30">
          <span className="text-accent">vx6fid</span>
          <span className="text-secondary/40 text-xs">Ctrl+`</span>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 text-sm"
        >
          {lines.map((l, i) => renderLine(l, i))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-borders/30"
        >
          <span className="text-accent">{cwd} $</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-primary"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}