"use client";

import React, { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [typed, setTyped] = useState("");
  const fullText = "> ./vx6Fid";
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const stars = useRef([]);

  const STAR_COUNT = 200;
  const NODE_CONNECTION_DISTANCE = 80;
  const CURSOR_DISTANCE = 120;

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Initialize stars
  useEffect(() => {
    const rect = sectionRef.current.getBoundingClientRect();

    // Set star count based on viewport width
    let count = 200;
    if (rect.width < 768) count = 80; // tablet / mobile
    if (rect.width < 480) count = 50; // small phones

    stars.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() + 2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }));
  }, []);

  // Track mouse
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsMouseMoving(true);
    };

    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isMouseMoving) return;
    const timeout = setTimeout(() => setIsMouseMoving(false), 50);
    return () => clearTimeout(timeout);
  }, [isMouseMoving]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = sectionRef.current.clientWidth;
      canvas.height = sectionRef.current.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Initialize grid for spatial partitioning
      const cellSize = NODE_CONNECTION_DISTANCE;
      const grid = {};
      stars.current.forEach((star, idx) => {
        const cellX = Math.floor(star.x / cellSize);
        const cellY = Math.floor(star.y / cellSize);
        const key = `${cellX},${cellY}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(star);
      });

      // Draw stars and connections
      stars.current.forEach((star) => {
        // Move star with tiny velocity
        star.x += star.vx;
        star.y += star.vy;

        // Drift toward cursor if close
        const dxMouse = mouse.current.x - star.x;
        const dyMouse = mouse.current.y - star.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (isMouseMoving && distMouse < CURSOR_DISTANCE) {
          star.x += dxMouse * 0.005;
          star.y += dyMouse * 0.005;
        }

        // Wrap edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Draw star
        // ctx.beginPath();
        // ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        // ctx.fillStyle = "background"; // accent vs secondary
        // ctx.fill();

        // Connect to cursor
        if (distMouse < CURSOR_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          const fade =
            (1 - distMouse / CURSOR_DISTANCE) * (0.7 + Math.random() * 0.3);
          ctx.strokeStyle = `rgba(0,255,178,${fade})`;
          ctx.stroke();
        }

        // Connect to nearby stars using grid
        const cellX = Math.floor(star.x / cellSize);
        const cellY = Math.floor(star.y / cellSize);

        for (let i = cellX - 1; i <= cellX + 1; i++) {
          for (let j = cellY - 1; j <= cellY + 1; j++) {
            const neighbors = grid[`${i},${j}`] || [];
            neighbors.forEach((otherStar) => {
              if (otherStar === star) return;
              const dx = otherStar.x - star.x;
              const dy = otherStar.y - star.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < NODE_CONNECTION_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(otherStar.x, otherStar.y);
                const fade =
                  (1 - dist / NODE_CONNECTION_DISTANCE) *
                  (0.5 + Math.random() * 0.5);
                ctx.strokeStyle = `rgba(0,255,178,${fade})`;
                ctx.stroke();
              }
            });
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center min-h-[30rem] text-center overflow-hidden bg-background"
    >
      {/* Canvas for stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      ></canvas>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight">
          vx6Fid
        </h1>

        {/* <div className="font-mono text-lg text-accent flex items-center justify-center">
          <span>{typed}</span>
          <span className="ml-1 w-2 h-5 bg-accent animate-pulse"></span>
        </div>*/}

        <p className="text-secondary text-lg md:text-xl max-w-md">
          Systems, Models & Proofs
        </p>
      </div>
    </section>
  );
}
