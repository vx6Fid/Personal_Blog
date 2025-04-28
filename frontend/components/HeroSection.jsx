import React from "react";
import { SquareTerminal } from "lucide-react";
import Image from "next/image";

function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center font-mono px-4 py-10">
      {/* Profile Image */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-borders p-1 shadow-lg">
        <Image
          src="/ninja_profile_pic.png"
          alt="Achal Nath Tiwari"
          width={160}
          height={160}
          className="w-full h-full object-cover rounded-full"
          priority
        />
      </div>

      {/* Name / Username */}
      <div className="mt-6">
        <p className="text-xl sm:text-2xl text-accent font-bold mt-1">
          vxF6id
        </p>
      </div>

      {/* Tagline */}
      <div className="mt-4 max-w-md">
        <p className="text-sm sm:text-lg text-primary leading-relaxed">
          <span className="text-accent">{">>"} </span>
          Engineering for scale. Thinking beneath the surface.
        </p>
      </div>

      {/* Tags / Roles */}
      <div className="flex flex-wrap justify-center mt-6 text-xs sm:text-sm text-secondary gap-4">
        <span className="flex items-center">
          <SquareTerminal className="mr-1 w-4 h-4" />
          <span>backend_engineer</span>
        </span>
        <span className="flex items-center">
          <SquareTerminal className="mr-1 w-4 h-4" />
          <span>systems_explorer</span>
        </span>
      </div>
    </div>
  );
}

export default HeroSection;
