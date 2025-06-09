"use client";
import ProjectCard from "@/components/ProjectCard";
import Head from "next/head";
import { useEffect, useState } from "react";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!url) throw new Error("API base URL is not defined");

        const response = await fetch(`${url}/projects`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const Data = await response.json();
        console.log(Data.data);
        setProjects(Data.data || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mb-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium text-primary mb-2">
          Projects
        </h1>
        <p className="text-secondary">
          A collection of my work and experiments
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-borders/10 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center text-secondary">
          <p>Error loading projects: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm bg-borders/10 hover:bg-borders/20 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : projects.length > 0 ? (
        <>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Terminal-style typing animation endline */}
          <p className="mt-8 text-accent font-mono text-md flex gap-2 items-center">
            <span>➜</span>
            <span className="typing">Projects loaded</span>
          </p>

          {/* CSS for looping typing and blinking cursor */}
          <style jsx>{`
            .typing {
              overflow: hidden;
              white-space: nowrap;
              border-right: 0.15em solid transparent;
              animation: typing 14s steps(16, end) infinite,
                blinkTextCursor 1.5s step-end infinite;
              width: 0;
              display: inline-block;
            }
            .blinking-cursor {
              animation: blink 1s step-start infinite;
              font-weight: 400;
            }
            @keyframes typing {
              0% {
                width: 0;
              }
              30% {
                width: 16ch;
              }
              70% {
                width: 16ch;
              }
              100% {
                width: 0;
              }
            }
            @keyframes blinkTextCursor {
              0%,
              50%,
              100% {
                border-color: transparent;
              }
              25%,
              75% {
                border-color: currentColor;
              }
            }
            @keyframes blink {
              50% {
                opacity: 0;
              }
            }
          `}</style>
        </>
      ) : (
        <div className="p-8 text-center text-secondary">
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
