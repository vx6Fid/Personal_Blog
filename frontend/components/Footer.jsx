import { SquareTerminal, Github, Linkedin, Twitter, Instagram, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/vx6Fid",
      icon: <Github size={18} className="group-hover:text-accent transition-colors" />,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/achaltiwari",
      icon: <Linkedin size={18} className="group-hover:text-accent transition-colors" />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/vx6Fid",
      icon: <Twitter size={18} className="group-hover:text-accent transition-colors" />,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/vx6fid",
      icon: <Instagram size={18} className="group-hover:text-accent transition-colors" />,
    },
  ];

  const siteLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "Projects", path: "/projects" },
    { name: "About Me", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="border-t border-borders bg-background/90 backdrop-blur-sm py-8 px-4 sm:px-8 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Profile */}
        <div className="flex items-center mb-8 group">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-borders">
            <Image
              src="/ninja_profile_pic.png"
              alt="Achal Nath Tiwari"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-medium text-primary">Achal Nath Tiwari</h2>
            <p className="text-secondary text-sm">Backend dev. Go + Linux. Exploring systems & scale</p>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Social */}
          <div>
            <div className="flex items-center text-sm font-semibold text-primary mb-3">
              <span className="text-accent mr-2">$</span>
              <span>./connect.sh</span>
            </div>
            <ul className="flex space-x-4">
              {socialLinks.map((link) => (
                <li key={link.name} className="group">
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="flex items-center text-secondary hover:text-accent transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    {link.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site links */}
          <div>
            <div className="flex items-center text-sm font-semibold text-primary ml-3 mb-3">
              <span>Site Links</span>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {siteLinks.map((link) => (
                <li key={link.name} className="group">
                  <Link
                    href={link.path}
                    className="flex items-center text-secondary hover:text-accent transition-colors text-sm"
                  >
                    <ChevronRight
                      size={14}
                      className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-center sm:justify-start text-xs text-secondary">
          <span>© {currentYear} vxF6id</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <span className="text-accent mr-1">$</span>
            <span>Made with</span>
            <SquareTerminal className="mx-1 mb-1 w-4 h-4 text-accent" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
