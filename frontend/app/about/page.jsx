"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

function Page() {
  const [about, setAbout] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!url) throw new Error("API base URL is not defined");

        const response = await fetch(`${url}/admin/data`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setAbout(data);
      } catch (err) {
        console.error("Failed to fetch about info:", err);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    fetchDetails();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!about) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-borders/50"></div>
          <div className="h-4 w-48 bg-borders/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 max-w-3xl mx-auto py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl text-accent font-medium">About</h1>
      </div>

      {/* About Text */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="leading-relaxed">
              {(isMobile ? about.about_mobile : about.about_desktop)
                .split("\n\n")
                .filter((paragraph) => paragraph.trim()) // Remove empty paragraphs
                .map((paragraph, index) => (
                  <span key={index} className="leading-relaxed">
                    {paragraph}
                    <br />
                    <br />
                  </span>
                ))}
            </p>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="mb-16">
        <h2 className="text-xl text-accent font-medium">What I'm Doing</h2>
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
        <p>{about.extras}</p>
        <br />
        <p>
          This site is a reflection of that journey — from configuring my first
          Linux window manager to architecting systems in Go.
          <br />
          <br />
          Let’s see where it leads next.
        </p>
      </section>
    </div>
  );
}

export default Page;
