import ProjectCard from "@/components/ProjectCard";

export const revalidate = 3600; // 1 hour

export const metadata = {
  title: "Projects | vx6Fid",
  description:
    "A curated showcase of vx6Fid's engineering projects, exploring backend systems, tools, and experiments.",
  alternates: {
    canonical: "https://vx6fid.vercel.app/projects",
  },
  openGraph: {
    title: "Projects | vx6Fid",
    description:
      "Explore vx6Fid's portfolio of technical builds, backend tools, and full-stack systems.",
    url: "https://vx6fid.vercel.app/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | vx6Fid",
    description: "Backend systems, tools, and experiments by vx6Fid",
  },
};

async function getProjects() {
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!url) return [];

    const res = await fetch(`${url}/projects`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const projects = await getProjects();

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

      {projects.length > 0 ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-secondary">
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
}
