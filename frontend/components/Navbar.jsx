"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Moon, SunMedium } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    setTheme(stored || (prefersLight ? "light" : "dark"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed w-full z-50 border-b border-borders/60 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-background/90 shadow-[0_1px_12px_-4px_rgba(0,0,0,0.3)]"
          : "bg-background/70"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-accent text-xl font-bold hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            vx6Fid
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                setTheme((p) => (p === "dark" ? "light" : "dark"))
              }
              className="text-primary hover:text-accent transition-colors p-1"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <SunMedium size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Desktop */}
            <ul className="hidden md:flex items-center space-x-8 ml-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-1 py-2 text-lg font-medium transition-colors duration-200
                      hover:text-accent
                      after:absolute after:bottom-0 after:left-0
                      after:h-0.5 after:bg-accent after:rounded-full
                      after:transition-all after:duration-300
                      ${
                        pathname === link.href
                          ? "text-accent after:w-full"
                          : "text-primary after:w-0 hover:after:w-full"
                      }`}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-sm text-primary hover:bg-borders/20 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              className="md:hidden flex flex-col space-y-1 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-3 py-2 rounded-sm text-base font-medium transition-colors
                      ${
                        pathname === link.href
                          ? "bg-accent/10 text-accent"
                          : "text-primary hover:bg-borders/10"
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
