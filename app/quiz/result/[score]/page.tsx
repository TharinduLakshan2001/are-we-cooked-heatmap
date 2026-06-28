import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import { Flame, ArrowRight, RotateCcw } from "lucide-react";
import ResultShareButton from "./ResultShareButton";

export const runtime = "edge";

type ResultParams = {
  score: string;
};

function getTier(scoreNum: number) {
  if (scoreNum >= 90) return { label: "Insane", color: "text-[#ff2d6b]", bg: "bg-[#ff2d6b]/10", border: "border-[#ff2d6b]/30", desc: "You are literally evaporating. Please step inside a freezer immediately. Do you even have skin left?" };
  if (scoreNum >= 75) return { label: "Inferno", color: "text-ember", bg: "bg-ember/10", border: "border-ember/30", desc: "It is a literal oven in there. You're sweating just breathing. Water is your only friend." };
  if (scoreNum >= 60) return { label: "Hot AF", color: "text-gold", bg: "bg-gold/10", border: "border-gold/30", desc: "Hot as fudge. The AC is crying for help. You've thought about putting ice cubes in your socks." };
  if (scoreNum >= 40) return { label: "Hot", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", desc: "Warm and sweaty. Not dying, but definitely not comfortable. The fan is on max speed." };
  if (scoreNum >= 20) return { label: "Mild", color: "text-ink", bg: "bg-ink/10", border: "border-ink/30", desc: "A bit warm, but completely manageable. You might need a cool beverage, nothing extreme." };
  return { label: "Basically winter", color: "text-frost", bg: "bg-frost/10", border: "border-frost/30", desc: "Are you in the Arctic? You are chilling. Literally. We are extremely jealous." };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ResultParams> | ResultParams;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const scoreNum = parseInt(resolvedParams.score) || 0;
  const tier = getTier(scoreNum);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";

  return {
    title: `I'm ${scoreNum}% Cooked! (${tier.label} Tier)`,
    description: `I took the official Am I Cooked? quiz and got a Cooked Score of ${scoreNum}% (${tier.label} Tier). Think you're hotter? Take the quiz and check the live heat map.`,
    openGraph: {
      title: `I'm ${scoreNum}% Cooked!`,
      description: `Cooked Score: ${scoreNum}% | Tier: ${tier.label}. Test your own heat levels on amicooked.`,
      images: [
        {
          url: `${baseUrl}/quiz/result/${scoreNum}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${scoreNum}% Cooked result card`,
        },
      ],
    },
  };
}

export default async function QuizResultPage({
  params,
}: {
  params: Promise<ResultParams> | ResultParams;
}) {
  const resolvedParams = await params;
  const scoreNum = parseInt(resolvedParams.score) || 0;
  const tier = getTier(scoreNum);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";
  const shareUrl = `${baseUrl}/quiz/result/${scoreNum}`;

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
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Result: ${scoreNum}%`,
        "item": shareUrl,
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

        <main className="flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 min-h-[calc(100vh-60px)] lg:min-h-screen">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-panel p-6 sm:p-8 shadow-2xl text-center">
            
            {/* Score Ring */}
            <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full border-4 border-line bg-panel-2">
              <div className="relative flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-black tracking-tight text-ink">
                  {scoreNum}%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-mist">
                  Cooked
                </span>
              </div>
            </div>

            {/* Tier Label */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-sm font-black tracking-tight uppercase ${tier.bg} ${tier.color} ${tier.border} border`}>
                <Flame size={14} className="fill-current" />
                {tier.label} Tier
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-mist leading-relaxed px-2 mb-8">
              {tier.desc}
            </p>

            {/* Share Interactive Button */}
            <ResultShareButton shareUrl={shareUrl} score={scoreNum} tier={tier.label} />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-line/50 mt-6">
              <Link
                href="/quiz"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-panel-2 hover:bg-white/[0.02] py-3 text-xs font-bold text-ink transition-colors cursor-pointer"
              >
                <RotateCcw size={14} /> Retry Quiz
              </Link>
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember to-crimson hover:scale-[1.01] active:scale-95 py-3 text-xs font-bold text-white shadow-[0_0_24px_-6px_var(--ember)] transition-all cursor-pointer"
              >
                Compare Cities <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
