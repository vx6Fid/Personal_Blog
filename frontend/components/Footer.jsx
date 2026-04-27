import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/vx6Fid", icon: Github },
    { name: "LinkedIn", url: "https://linkedin.com/in/achaltiwari", icon: Linkedin },
    { name: "Twitter", url: "https://twitter.com/vx6Fid", icon: Twitter },
  ];

  return (
    <footer className="border-t border-borders py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-secondary">
          © {currentYear} vx6Fid
        </p>

        <div className="flex items-center gap-5">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="text-secondary hover:text-accent transition-colors"
            >
              <link.icon size={16} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
