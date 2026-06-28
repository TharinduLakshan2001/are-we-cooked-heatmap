import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import QuizClient from "@/components/QuizClient";
import Link from "next/link";
import { Flame, ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Am I Cooked? Quiz",
  description:
    "Take the official 'Am I Cooked?' quiz. Find out your heat tolerance and situation status, share your cooked percentage score, and check the live heat map.",
};

export default function QuizPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";

  // Structured Data: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Quiz",
        "item": `${baseUrl}/quiz`,
      },
    ],
  };

  // Structured Data: WebApplication
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Am I Cooked? Quiz",
    "description": "A fun, satirical quiz testing your summer survival skills, heat tolerance, and slang situations.",
    "applicationCategory": "GameApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileNav />

        <main className="flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 min-h-[calc(100vh-60px)] lg:min-h-screen">
          {/* Back button */}
          <div className="w-full max-w-xl mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-mist hover:text-ink transition-colors"
            >
              <ChevronLeft size={14} /> Back to the live map
            </Link>
          </div>

          {/* Intro header */}
          <div className="text-center w-full max-w-xl mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ember to-crimson shadow-[0_0_24px_-6px_var(--ember)] mb-4">
              <Flame size={24} className="text-white" />
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink">
              Am I <span className="text-ember">Cooked?</span>
            </h1>
            <p className="mt-2 text-sm text-mist leading-relaxed">
              Answer 5 quick questions about the weather, your room setup, and your lifestyle to calculate your definitive Cooked Score.
            </p>
          </div>

          {/* Quiz Container */}
          <QuizClient />
        </main>
      </div>
    </div>
  );
}
