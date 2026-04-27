import Link from "next/link";
import { Github, ExternalLink, BookOpen } from "lucide-react";

export default function ProjectCard({ project }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const links = [
    project.github_link && {
      href: project.github_link,
      icon: Github,
      label: "Source code",
    },
    project.live_link && {
      href: project.live_link,
      icon: ExternalLink,
      label: "Live demo",
    },
    project.article_link && {
      href: project.article_link,
      icon: BookOpen,
      label: "Write-up",
    },
  ].filter(Boolean);

  return (
    <div
      className="group flex flex-col rounded-sm border border-borders/60 overflow-hidden
        bg-background transition-all duration-300
        hover:border-accent/40 hover:shadow-[0_0_20px_-6px_rgba(0,255,178,0.12)]"
    >
      <div className="relative flex-1 p-5 space-y-4">

        <div className="flex items-center gap-2 text-xs text-secondary font-mono">
          <span className="text-accent/60">▸</span>
          <time dateTime={project.created_at}>
            {formatDate(project.created_at)}
          </time>
        </div>

        <h3 className="text-lg font-medium text-primary group-hover:text-accent transition-colors duration-200">
          {project.name}
        </h3>

        <p className="text-secondary text-sm leading-relaxed">
          {project.description.length > 120
            ? `${project.description.substring(0, 120)}...`
            : project.description}
        </p>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-mono rounded-sm border border-borders/40 text-secondary
                  hover:border-accent/30 hover:text-accent transition-all duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links bar */}
      {links.length > 0 && (
        <div className="border-t border-borders/40 px-5 py-3 flex gap-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent transition-colors duration-200"
              aria-label={link.label}
            >
              <link.icon className="w-4 h-4" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
