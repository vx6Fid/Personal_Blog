/**
 * Virtual filesystem for the site terminal.
 *
 * Output format:
 *   - String: plain text line
 *   - Array of { text, color? }: colored segments on one line
 *     color values: "accent", "secondary", "error", "primary" (default)
 */

const STATIC_TREE = {
  "/": {
    type: "dir",
    children: ["blogs", "projects", "about", "contact"],
  },
  "/blogs": { type: "dir", children: [] },
  "/projects": { type: "dir", children: [] },
  "/about": { type: "file", route: "/about" },
  "/contact": { type: "file", route: "/contact" },
};

export function createFS(blogs = [], projects = []) {
  const tree = JSON.parse(JSON.stringify(STATIC_TREE));

  tree["/blogs"].children = blogs.map((b) => b.slug + ".md");
  blogs.forEach((b) => {
    tree[`/blogs/${b.slug}.md`] = {
      type: "file",
      route: `/blogs/${b.slug}`,
      title: b.title,
      date: b.created_at,
      tags: b.tags || [],
      excerpt: b.excerpt || "",
    };
  });

  tree["/projects"].children = projects.map(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-"),
  );
  projects.forEach((p) => {
    const slug = p.name.toLowerCase().replace(/\s+/g, "-");
    tree[`/projects/${slug}`] = {
      type: "file",
      title: p.name,
      description: p.description,
      github: p.github_link,
      live: p.live_link,
    };
  });

  return tree;
}

export function resolvePath(cwd, input) {
  if (input.startsWith("/")) return normalizePath(input);
  const parts = cwd === "/" ? [] : cwd.split("/").filter(Boolean);
  input.split("/").forEach((seg) => {
    if (seg === "..") parts.pop();
    else if (seg !== "." && seg !== "") parts.push(seg);
  });
  return "/" + parts.join("/") || "/";
}

function normalizePath(p) {
  const parts = p.split("/").filter(Boolean);
  const resolved = [];
  parts.forEach((seg) => {
    if (seg === "..") resolved.pop();
    else if (seg !== ".") resolved.push(seg);
  });
  return "/" + resolved.join("/") || "/";
}

function c(text, color) {
  return { text, color };
}

export function executeCommand(cmd, cwd, tree, navigate, setTheme) {
  const trimmed = cmd.trim();
  if (!trimmed) return { output: [], cwd };

  const [command, ...args] = trimmed.split(/\s+/);
  const arg = args.join(" ");

  switch (command) {
    case "help":
      return {
        output: [
          [c("Navigation:", "accent")],
          [c("  cd <dir>       ", "accent"), c("Navigate (cd / goes home)")],
          [c("  ls [dir]       ", "accent"), c("List contents")],
          [c("  cat <file>     ", "accent"), c("View file details")],
          [c("  bat <file>     ", "accent"), c("Alias for cat")],
          [c("  pwd            ", "accent"), c("Print current path")],
          [c("  open [path]    ", "accent"), c("Open in browser (exits terminal)")],
          "",
          [c("System:", "accent")],
          [c("  clear          ", "accent"), c("Clear terminal")],
          [c("  theme <mode>   ", "accent"), c("Switch theme (dark/light)")],
          [c("  whoami         ", "accent"), c("About the author")],
          [c("  help           ", "accent"), c("This message")],
          [c("  exit / quit    ", "accent"), c("Close terminal")],
          "",
          [c("Fun:", "accent")],
          [c("  hello          ", "accent"), c("Say hi")],
          [c("  fortune        ", "accent"), c("Random programming joke")],
          [c("  cowsay <msg>   ", "accent"), c("Moo")],
          [c("  ping <url>     ", "accent"), c("Ping a URL")],
          [c("  uptime         ", "accent"), c("Session uptime")],
          [c("  echo <text>    ", "accent"), c("Echo text")],
          [c("  date           ", "accent"), c("Current date/time")],
          "",
          [c("Tip: ", "secondary"), c("Tab"), c(" for autocomplete, ", "secondary"), c("↑↓"), c(" for history", "secondary")],
        ],
        cwd,
      };

    case "pwd":
      return { output: [[c(cwd, "accent")]], cwd };

    case "open": {
      // Explicit navigation — open current dir or a path in the browser
      const target = arg ? resolvePath(cwd, arg) : cwd;
      const routeMap = { "/": "/", "/blogs": "/blogs", "/projects": "/projects", "/about": "/about", "/contact": "/contact" };
      const node = tree[target];
      if (node?.route) {
        navigate(node.route);
        return { output: [[c("  -> opening ", "secondary"), c(node.title || target, "accent")]], cwd };
      }
      if (routeMap[target] !== undefined) {
        navigate(routeMap[target]);
        return { output: [[c("  -> opening ", "secondary"), c(target, "accent")]], cwd };
      }
      return { output: [[c("  open: ", "error"), c(`${arg || cwd}: cannot open`, "error")]], cwd };
    }

    case "cd": {
      if (!arg || arg === "~" || arg === "/") {
        return { output: [], cwd: "/" };
      }
      const target = resolvePath(cwd, arg);
      const node = tree[target];
      if (!node)
        return {
          output: [[c("cd: ", "error"), c(`${arg}: No such file or directory`, "error")]],
          cwd,
        };
      if (node.type === "file") {
        // cd into a file = open it in the browser
        if (node.route) {
          navigate(node.route);
          return { output: [[c("  -> opening ", "secondary"), c(node.title || arg, "accent")]], cwd };
        }
        return {
          output: [[c("cd: ", "error"), c(`${arg}: Not a directory`, "error")]],
          cwd,
        };
      }
      // Just change directory, don't navigate
      return { output: [], cwd: target };
    }

    case "ls": {
      const target = arg ? resolvePath(cwd, arg) : cwd;
      const node = tree[target];
      if (!node)
        return {
          output: [[c(`ls: ${arg || cwd}: No such directory`, "error")]],
          cwd,
        };
      if (node.type === "file")
        return { output: [[c(`ls: ${arg}: Not a directory`, "error")]], cwd };
      if (node.children.length === 0)
        return { output: [[c("(empty)", "secondary")]], cwd };

      const lines = node.children.map((child) => {
        const fullPath = target === "/" ? `/${child}` : `${target}/${child}`;
        const childNode = tree[fullPath];
        const isDir = childNode?.type === "dir";

        if (isDir) {
          return [c("  ▸ ", "accent"), c(`${child}/`, "accent")];
        }
        // Show title as the display name, not the slug
        const displayName = childNode?.title || child;
        return [c("  ▪ ", "secondary"), c(displayName)];
      });

      return { output: lines, cwd };
    }

    case "cat":
    case "bat": {
      if (!arg)
        return {
          output: [[c(`${command}: missing file operand`, "error")]],
          cwd,
        };
      const target = resolvePath(cwd, arg);
      const node = tree[target];
      if (!node)
        return {
          output: [[c(`${command}: ${arg}: No such file`, "error")]],
          cwd,
        };
      if (node.type === "dir")
        return {
          output: [[c(`${command}: ${arg}: Is a directory`, "error")]],
          cwd,
        };

      const lines = [];
      lines.push([c("─".repeat(44), "secondary")]);
      if (node.title)
        lines.push([c("  Title  ", "secondary"), c(node.title, "accent")]);
      if (node.date)
        lines.push([
          c("  Date   ", "secondary"),
          c(
            new Date(node.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          ),
        ]);
      if (node.tags?.length)
        lines.push([
          c("  Tags   ", "secondary"),
          ...node.tags.map((t, i) => c(i > 0 ? `, ${t}` : t, "accent")),
        ]);
      if (node.excerpt) {
        lines.push([c("─".repeat(44), "secondary")]);
        // Show full excerpt, not truncated
        const excerptLines = node.excerpt.match(/.{1,70}/g) || [node.excerpt];
        excerptLines.forEach((l) => lines.push([c(`  ${l}`, "secondary")]));
      }
      if (node.description) {
        lines.push([c("─".repeat(44), "secondary")]);
        const descLines = node.description.match(/.{1,70}/g) || [node.description];
        descLines.forEach((l) => lines.push([c(`  ${l}`)]));
      }
      if (node.github)
        lines.push([c("  GitHub ", "secondary"), c(node.github, "accent")]);
      if (node.live)
        lines.push([c("  Live   ", "secondary"), c(node.live, "accent")]);
      lines.push([c("─".repeat(44), "secondary")]);
      if (node.route)
        lines.push([c("  → Open: ", "secondary"), c(`cd ${arg}`, "accent")]);

      return { output: lines, cwd };
    }

    case "theme": {
      if (arg === "dark" || arg === "light") {
        setTheme(arg);
        return {
          output: [[c("Theme set to ", "secondary"), c(arg, "accent")]],
          cwd,
        };
      }
      return {
        output: [[c("Usage: theme ", "secondary"), c("<dark|light>", "accent")]],
        cwd,
      };
    }

    case "whoami":
      return {
        output: [
          [c("  Achal Nath Tiwari ", "accent"), c("(vx6Fid)", "secondary")],
          [c("  Backend dev. Go + Linux.")],
          [c("  Exploring systems & scale.")],
          "",
          [c("  -> ", "secondary"), c("https://github.com/vx6Fid", "accent")],
        ],
        cwd,
      };

    case "clear":
      return { output: "__CLEAR__", cwd };

    case "exit":
    case "quit":
      return { output: "__EXIT__", cwd };

    case "hello":
    case "hi":
    case "hey":
      return {
        output: [
          [c("Hey there! ", "accent"), c("\\o")],
          [c("Welcome to vx6Fid's corner of the internet.")],
          [c("Try ", "secondary"), c("ls", "accent"), c(" to look around.", "secondary")],
        ],
        cwd,
      };

    case "date":
    case "now":
      return { output: [[c(new Date().toString(), "accent")]], cwd };

    case "echo":
      return { output: [[c(arg || "")]], cwd };

    case "fortune":
      return { output: "__ASYNC_FORTUNE__", cwd };

    case "uptime": {
      const secs = Math.floor((Date.now() - performance.timeOrigin) / 1000);
      const mins = Math.floor(secs / 60);
      const display = mins > 0 ? `${mins}m ${secs % 60}s` : `${secs}s`;
      return {
        output: [
          [c("  up ", "secondary"), c(display, "accent"), c(" since tab opened", "secondary")],
        ],
        cwd,
      };
    }

    case "sudo":
      return {
        output: [
          [c("  [sudo] ", "error"), c("password for visitor: ", "secondary")],
          [c("  Sorry, user ", "error"), c("visitor", "accent"), c(" is not in the sudoers file.", "error")],
          [c("  This incident will be reported. [!]", "error")],
        ],
        cwd,
      };

    case "rm": {
      const rmResponses = [
        "[x] Permission denied. This site took effort, you know.",
        "[!] Nice try. The filesystem is protected by plot armor.",
        "[~] rm: cannot remove -- files are load-bearing.",
        "[x] Access denied. These files have families.",
        "[!] You really thought that would work?",
        "[~] Error: files are welded to the server.",
      ];
      return {
        output: [
          [c(rmResponses[Math.floor(Math.random() * rmResponses.length)], "error")],
        ],
        cwd,
      };
    }

    case "vim":
    case "nano":
    case "emacs":
      return {
        output: [[c(`${command}: `, "error"), c("this is a portfolio, not a server.", "secondary")]],
        cwd,
      };

    case "ping":
      return { output: "__ASYNC_PING__", cwd, pingTarget: arg };

    case "cowsay": {
      const msg = arg || "moo";
      const border = "─".repeat(msg.length + 2);
      return {
        output: [
          [c(` ╭${border}╮`, "secondary")],
          [c(" │ ", "secondary"), c(msg, "accent"), c(" │", "secondary")],
          [c(` ╰${border}╯`, "secondary")],
          [c("        \\   ^__^")],
          [c("         \\  (oo)\\_______")],
          [c("            (__)\\       )\\/\\")],
          [c("                ||----w |")],
          [c("                ||     ||")],
        ],
        cwd,
      };
    }

    case "neofetch":
    case "pfetch":
      return {
        output: [[c(`${command}: `, "error"), c("command not found. Type 'help'", "secondary")]],
        cwd,
      };

    case "grep":
      return {
        output: arg
          ? [[c(`  grep: searching for '${arg}'... `, "secondary"), c("0 results.", "accent")],
             [c("  (try ", "secondary"), c("ls", "accent"), c(" to browse instead)", "secondary")]]
          : [[c("  Usage: grep <pattern>", "error")]],
        cwd,
      };

    case "find":
      return {
        output: [
          [c("  find: searching filesystem...", "secondary")],
          [c("  --> Use ", "secondary"), c("ls", "accent"), c(" and ", "secondary"), c("cat", "accent"), c(" to explore.", "secondary")],
        ],
        cwd,
      };

    case "man":
      return {
        output: arg
          ? [[c(`  No manual entry for ${arg}.`, "secondary")],
             [c("  This is a portfolio, not a man page archive.", "secondary")]]
          : [[c("  What manual page do you want?", "error")]],
        cwd,
      };

    case "touch":
      return {
        output: [[c("  [x] ", "error"), c("Read-only filesystem. No touching.", "secondary")]],
        cwd,
      };

    case "mkdir":
      return {
        output: [[c("  [x] ", "error"), c("Cannot create directory -- disk quota exceeded (just kidding, it's read-only).", "secondary")]],
        cwd,
      };

    case "wget":
    case "curl": {
      if (!arg) return { output: [[c(`  ${command}: missing URL`, "error")]], cwd };
      return {
        output: [
          [c(`  ${command} ${arg}`, "secondary")],
          [c("  --> ", "secondary"), c("301 Redirect", "accent"), c(" to this terminal.", "secondary")],
          [c("  You're already here.", "secondary")],
        ],
        cwd,
      };
    }

    case "history":
      return { output: "__HISTORY__", cwd };

    case "hostname":
      return {
        output: [[c("  vx6fid.vercel.app", "accent")]],
        cwd,
      };

    case "uname":
      return {
        output: arg === "-a"
          ? [[c("  vx6OS 1.0.0 next-15.3.1 React-19 JetBrains_Mono aarch64", "accent")]]
          : [[c("  vx6OS", "accent")]],
        cwd,
      };

    default:
      return {
        output: [
          [c(`${command}: `, "error"), c("command not found. ", "secondary"), c("Type 'help'", "accent")],
        ],
        cwd,
      };
  }
}

export function getCompletions(partial, cwd, tree) {
  const parts = partial.split(/\s+/);
  if (parts.length <= 1) {
    const commands = [
      "help", "cd", "ls", "cat", "bat", "pwd", "open", "clear", "theme", "whoami",
      "exit", "quit", "hello", "fortune", "cowsay",
      "ping", "uptime", "echo", "date", "sudo",
      "grep", "find", "man", "touch", "mkdir", "wget", "curl",
      "history", "hostname", "uname",
    ];
    return commands.filter((cmd) => cmd.startsWith(parts[0]));
  }

  const pathPart = parts[parts.length - 1] || "";
  const dir = pathPart.includes("/")
    ? resolvePath(cwd, pathPart.substring(0, pathPart.lastIndexOf("/")) || "/")
    : cwd;
  const prefix = pathPart.includes("/")
    ? pathPart.substring(pathPart.lastIndexOf("/") + 1)
    : pathPart;

  const node = tree[dir];
  if (!node || node.type !== "dir") return [];

  return node.children
    .filter((ch) => ch.startsWith(prefix))
    .map((ch) => {
      const beforePath = parts.slice(0, -1).join(" ");
      const dirPrefix = pathPart.includes("/")
        ? pathPart.substring(0, pathPart.lastIndexOf("/") + 1)
        : "";
      return `${beforePath} ${dirPrefix}${ch}`.trim();
    });
}
