"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

type Props = {
  shareUrl: string;
  score: number;
  tier: string;
};

export default function ResultShareButton({ shareUrl, score, tier }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const title = `I'm ${score}% Cooked!`;
    const text = `I took the official Am I Cooked? quiz and got a Cooked Score of ${score}% (${tier} Tier). Think you're hotter? Take the quiz!`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch {
        /* fallback to clipboard if cancelled or failed */
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link to clipboard. Please copy manually: " + shareUrl);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share your score"
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-panel-2 border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:border-frost/40 active:scale-[0.99] cursor-pointer"
    >
      {copied ? (
        <>
          <Check size={16} className="text-frost" />
          <span>Copied link!</span>
        </>
      ) : (
        <>
          <Share2 size={16} className="text-mist" />
          <span>Share result</span>
        </>
      )}
    </button>
  );
}
