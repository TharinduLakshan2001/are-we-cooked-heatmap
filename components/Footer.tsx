"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-line px-5 sm:px-6 pt-4 pb-5 text-[12px] text-mist lg:flex-row lg:justify-between">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/quiz" className="hover:text-frost hover:underline font-semibold transition-colors cursor-pointer">
          Am I Cooked? Quiz
        </Link>
        <span className="text-line hidden sm:inline">|</span>
        <Link href="/heat-index" className="hover:text-frost hover:underline font-semibold transition-colors cursor-pointer">
          Heat Index Explainer
        </Link>
        <span className="text-line hidden sm:inline">|</span>
        <Link href="/heatwave-safety" className="hover:text-frost hover:underline font-semibold transition-colors cursor-pointer">
          Heatwave Safety Guide
        </Link>
        <span className="text-line hidden sm:inline">|</span>
        <Link href="/glossary" className="hover:text-frost hover:underline font-semibold transition-colors cursor-pointer">
          Slang Glossary
        </Link>
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ember flicker" />
          Heating up Europe…
        </span>
        <span className="flex items-center gap-1.5">
          © 2026 Heat Map <Heart size={12} className="fill-crimson text-crimson" />
        </span>
      </div>
    </footer>
  );
}
