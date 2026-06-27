"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-line px-5 sm:px-6 pt-4 pb-5 text-[12px] text-mist sm:flex-row sm:justify-between">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-ember flicker" />
        Heating up Europe…
      </span>
      <span>Stay hydrated. Stay safe. Stay legendary. 🔥</span>
      <span className="flex items-center gap-1.5">
        © 2026 Heat Map <Heart size={12} className="fill-crimson text-crimson" />
      </span>
    </footer>
  );
}
