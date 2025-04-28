"use client";

import Link from "next/link";
import { Github, ExternalLink, BookOpen } from "lucide-react";

export default function ProjectCard({ project }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col border border-borders rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:border-accent/30 group bg-background">
      <div className="p-5 space-y-4 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary font-mono">
            {formatDate(project.created_at)}
          </span>
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="text-secondary hover:text-accent transition-colors flex items-center gap-1"
              aria-label="GitHub repository"
            >
              <Github className="w-4 h-4" />
              <span className="text-xs font-mono">Github</span>
            </Link>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium text-primary group-hover:text-accent transition-colors duration-200">
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
                  className="px-2 py-1 text-xs rounded bg-borders/20 text-secondary font-mono hover:bg-accent/10 hover:text-accent transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-borders bg-borders/5 px-5 py-3 flex gap-4">
        {project.github_link && (
          <Link
            href={project.github_link}
            target="_blank"
            className="text-secondary hover:text-accent transition-colors flex items-center gap-1"
            aria-label="Source code"
          >
            <Github className="w-4 h-4" />
          </Link>
        )}
        {project.live_link && (
          <Link
            href={project.live_link}
            target="_blank"
            className="text-secondary hover:text-accent transition-colors flex items-center gap-1"
            aria-label="Live demo"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
        {project.article_link && (
          <Link
            href={project.article_link}
            target="_blank"
            className="text-secondary hover:text-accent transition-colors flex items-center gap-1"
            aria-label="Documentation"
          >
            <BookOpen className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
