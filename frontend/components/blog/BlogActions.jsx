"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Share2, ArrowLeft } from "lucide-react";

export default function BlogActions() {
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
        toast.success("Link copied to clipboard");
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
  };

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors py-1 rounded-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors py-1 rounded-sm"
        aria-label="Share article"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
