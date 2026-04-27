export const revalidate = 3600; // 1 hour

export const metadata = {
  title: "About | vx6Fid",
  description:
    "Learn more about vx6Fid, backend systems, and the journey behind the blog.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | vx6Fid",
    description: "Background, interests, and goals of vx6Fid",
    url: "https://vx6fid.vercel.app/about",
    type: "website",
  },
};

async function getAboutData() {
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!url) return null;

    const res = await fetch(`${url}/admin/data`, { cache: "no-store" });
    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const about = await getAboutData();

  if (!about) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-secondary">Failed to load about info.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 max-w-3xl mx-auto py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl text-accent font-medium">About</h1>
      </div>

      {/* About Text — render desktop version for SSR, CSS hides on mobile */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {/* Desktop about (hidden on mobile) */}
            <div className="hidden md:block">
              {about.about_desktop
                .split("\n\n")
                .filter((p) => p.trim())
                .map((paragraph, index) => (
                  <p key={index} className="leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
            </div>
            {/* Mobile about (hidden on desktop) */}
            <div className="md:hidden">
              {about.about_mobile
                .split("\n\n")
                .filter((p) => p.trim())
                .map((paragraph, index) => (
                  <p key={index} className="leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="mb-16">
        <h2 className="text-xl text-accent font-medium">{"What I'm Doing"}</h2>
        <p className="text-xs mb-4 text-secondary mt-2">
          Updated: {new Date(about.doing_date).toLocaleDateString()}
        </p>
        <ul className="space-y-2">
          {about.doing_content.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </section>

      {/* Tools */}
      <section className="mb-16">
        <h2 className="text-xl text-accent font-medium mb-4">Tools</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg text-accent mb-3">Software</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(about.software_tools).map(([key, value]) => (
                <div key={key} className="text-secondary">
                  <span>{key}: </span>
                  <span className="text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg text-accent mb-3">Hardware</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(about.hardware_tools).map(([key, value]) => (
                <div key={key} className="text-secondary">
                  <span>{key}: </span>
                  <span className="text-primary whitespace-pre-line">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extras */}
      <section className="mb-6">
        <h2 className="text-xl font-medium text-accent mb-4">Beyond</h2>
        <p className="wrap-break-word">{about.extras}</p>
        <br />
      </section>
    </div>
  );
}
