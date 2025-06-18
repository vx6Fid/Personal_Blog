"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Moon, SunMedium } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    const initial = stored || (prefersLight ? "light" : "dark");
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  2;

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 border-b transition-colors ${
        scrolled ? "bg-background backdrop-blur-sm" : "bg-background"
      } border-borders`}
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

          {/* Right section: theme toggle + mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button (always visible) */}
            <button
              onClick={toggleTheme}
              className="text-primary hover:text-accent transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <SunMedium size={20} /> : <Moon size={20} />}
            </button>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center space-x-8 ml-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
              relative px-1 py-2 text-lg font-medium
              hover:text-accent transition-colors
              ${pathname === link.href ? "text-accent" : "text-primary"}
              after:absolute after:bottom-0 after:left-0 
              after:h-[2px] after:bg-accent after:rounded-full
              after:transition-all after:duration-300
              ${
                pathname === link.href
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }
            `}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md text-primary hover:bg-borders/20 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              className="md:hidden flex flex-col space-y-2 pb-4"
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
                    className={`
                      block px-3 py-2 rounded-md text-base font-medium
                      ${
                        pathname === link.href
                          ? "bg-accent/10 text-accent"
                          : "text-primary hover:bg-borders/10"
                      }
                    `}
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
