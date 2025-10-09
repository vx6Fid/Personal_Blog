"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Share2, ArrowLeft } from "lucide-react";

const BlogFooter = () => {
  const router = useRouter();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard", {
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--primary))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "4px",
            fontSize: "14px",
            padding: "12px 16px",
          },
        });
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mr-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-t border-borders pt-8 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-borders/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-borders/10"
          aria-label="Share article"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default BlogFooter;
