import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import { ChevronLeft, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Slang Glossary & Slang Terms Explained - Am I Cooked?",
  description:
    "Learn the meaning of popular heatwave slang terms used on our dashboard, including 'cooked,' 'heat check,' 'sweat dance,' and more.",
};

const GLOSSARY_ITEMS = [
  {
    term: "Cooked",
    definition: "A slang term meaning you are in a hopeless situation, utterly exhausted, or facing extreme heat. In the context of our weather heat map, a city is 'cooked' if temperatures have crossed the threshold of human comfort, leaving residents sweating and complaining.",
  },
  {
    term: "Heat Check",
    definition: "Traditionally a sports slang term where a shooter tests their hot streak by taking a difficult shot. On our site, it refers to checking the live thermometer status of European cities to see if their heat index has climbed into the extreme danger zones.",
  },
  {
    term: "Sweat Dance",
    definition: "The physical movement one makes when attempting to stay cool without air conditioning—often involving erratic hand-fanning, pacing, and drinking ice water. We encourage users to record their sweat dances and post them on social media.",
  },
  {
    term: "No AC",
    definition: "The ultimate condition of summer suffering. Having no access to air conditioning during a heatwave. It is a critical multiplier of how 'cooked' you are in your day-to-day life.",
  },
  {
    term: "Inferno Tier",
    definition: "The weather level representing dangerous heatwaves. Typically when feels-like temperatures are between 35°C and 40°C, making simple physical activities uncomfortable and requiring high fluid intake.",
  },
];

export default function GlossaryPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";

  // Breadcrumb Schema JSON-LD
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
        "name": "Slang Glossary",
        "item": `${baseUrl}/glossary`,
      },
    ],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileNav />

        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb nav */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-mist hover:text-ink transition-colors"
            >
              <ChevronLeft size={14} /> Back to the live map
            </Link>
          </div>

          <article className="prose prose-invert prose-emerald">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold text-sm font-bold uppercase tracking-wider">Slang Dictionary</span>
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="text-mist text-xs">4 min read</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink mb-6">
              The Official <span className="text-gold">Am I Cooked?</span> Slang Glossary
            </h1>

            <p className="text-[15px] leading-relaxed text-mist mb-8">
              Welcome to the official dictionary of slang terms and phrases used across our heatwave tracking dashboard. Whether you are checking on weather conditions in <Link href="/cities/london" className="text-frost hover:underline font-semibold">London</Link> or looking up coordinates for <Link href="/cities/paris" className="text-frost hover:underline font-semibold">Paris</Link>, this guide explains what these terms mean in the heat map universe.
            </p>

            <div className="space-y-6">
              {GLOSSARY_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-gold/30"
                >
                  <h2 className="font-display text-lg font-black text-ink flex items-center gap-2 mb-2">
                    <HelpCircle size={18} className="text-gold" /> {item.term}
                  </h2>
                  <p className="text-xs text-mist leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-12 mb-4">
              Determine Your Status
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Are you mild, or are you in full inferno mode? Don&apos;t guess. Take our official <Link href="/quiz" className="text-frost hover:underline font-semibold">Am I Cooked? Quiz</Link> to check your rating and see where you fit. Compare your score with active cities on the <Link href="/" className="text-frost hover:underline font-semibold">live map leaderboard</Link> to see how cooked you really are.
            </p>
          </article>
        </main>
      </div>
    </div>
  );
}
