import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        {/* Error code */}
        <h1 className="text-7xl font-display text-accent tracking-wider">404</h1>

        {/* Terminal-style message */}
        <div className="space-y-2 font-mono text-sm">
          <p className="text-secondary">
            <span className="text-accent">$</span> cd requested-page
          </p>
          <p className="text-error">
            error: path not found in filesystem
          </p>
        </div>

        {/* Navigation */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-mono border border-accent/40 text-accent rounded-sm
              hover:bg-accent/10 transition-all duration-200 uppercase tracking-wider"
          >
            cd /home
          </Link>
          <Link
            href="/blogs"
            className="px-4 py-2 text-sm font-mono border border-borders/40 text-secondary rounded-sm
              hover:border-accent/40 hover:text-accent transition-all duration-200 uppercase tracking-wider"
          >
            ls /blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
