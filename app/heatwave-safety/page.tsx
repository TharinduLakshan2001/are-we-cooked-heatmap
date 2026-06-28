import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Heatwave Safety Guide: How to Stay Cool & Avoid Heat Exhaustion",
  description:
    "Factual, evidence-based heat safety tips. Learn how to recognize heat stroke symptoms, stay hydrated, keep your home cool, and protect vulnerable neighbors.",
};

export default function HeatwaveSafetyPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the symptoms of heat exhaustion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Symptoms of heat exhaustion include heavy sweating, rapid pulse, dizziness, nausea, headache, muscle cramps, and cool, moist skin with goosebumps when in the heat.",
        },
      },
      {
        "@type": "Question",
        "name": "How can you prevent heat stroke during a heatwave?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prevent heat stroke by staying in air-conditioned areas, drinking plenty of water (avoiding alcohol and caffeine), wearing lightweight, loose-fitting clothing, and avoiding strenuous outdoor activities during peak sun hours.",
        },
      },
      {
        "@type": "Question",
        "name": "Who is most vulnerable to extreme heat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Older adults (65+), infants and young children, pregnant women, people with chronic medical conditions, and outdoor workers are at the highest risk of heat-related illnesses.",
        },
      },
    ],
  };

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
        "name": "Heatwave Safety",
        "item": `${baseUrl}/heatwave-safety`,
      },
    ],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>

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
              <span className="text-[#ff4d2e] text-sm font-bold uppercase tracking-wider">Safety Guide</span>
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="text-mist text-xs">6 min read</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink mb-6">
              Heatwave Safety: Staying Cool, Hydrated, and Safe
            </h1>

            <p className="text-[15px] leading-relaxed text-mist mb-6">
              Extreme heatwave conditions are expanding across major European capitals. When cities like <Link href="/cities/madrid" className="text-ember hover:underline font-semibold">Madrid</Link> and <Link href="/cities/paris" className="text-ember hover:underline font-semibold">Paris</Link> experience sustained temperature warnings, keeping your body heat regulated is vital. Learn how to protect yourself and your family.
            </p>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              1. Stay Hydrated (Before You Feel Thirsty)
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              During high heat, your body loses moisture rapidly through perspiration. Drinking water consistently is critical.
            </p>
            <ul className="list-disc list-inside text-sm text-mist leading-relaxed mb-6 space-y-1.5 pl-4">
              <li>Aim to drink 2-4 glasses of cool water every hour when active in hot conditions.</li>
              <li>Avoid beverages high in sugar, alcohol, or caffeine, as they can cause dehydration.</li>
              <li>Ensure pets and infants have immediate, continuous access to fresh water.</li>
            </ul>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              2. Recognize Heat Exhaustion vs. Heat Stroke
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Knowing the difference between heat exhaustion and heat stroke can save lives. Heat stroke is a medical emergency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="rounded-xl border border-line bg-panel-2 p-5">
                <h3 className="font-display text-sm font-bold text-gold flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} /> Heat Exhaustion
                </h3>
                <p className="text-[11px] text-mist/95 leading-relaxed mb-3">
                  Body temperature rises, but sweating remains normal.
                </p>
                <ul className="list-disc list-inside text-[11px] text-mist space-y-1">
                  <li>Heavy sweating</li>
                  <li>Dizziness & fatigue</li>
                  <li>Nausea or vomiting</li>
                  <li>Fast, weak pulse</li>
                </ul>
                <p className="text-[10px] text-mist/60 mt-3">
                  <strong>Action:</strong> Move to a cool area, loosen clothing, sip water.
                </p>
              </div>

              <div className="rounded-xl border border-[#ff2d6b]/30 bg-[#ff2d6b]/5 p-5">
                <h3 className="font-display text-sm font-bold text-[#ff2d6b] flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} /> Heat Stroke
                </h3>
                <p className="text-[11px] text-mist/95 leading-relaxed mb-3">
                  Body loses the ability to sweat; temperature spikes.
                </p>
                <ul className="list-disc list-inside text-[11px] text-mist space-y-1">
                  <li>High body temp (103°F / 39°C+)</li>
                  <li>Hot, red, dry or damp skin</li>
                  <li>Confusion, unconsciousness</li>
                  <li>Fast, strong pulse</li>
                </ul>
                <p className="text-[10px] text-[#ff2d6b] font-bold mt-3">
                  <strong>Action:</strong> Call emergency services immediately. Cool the person.
                </p>
              </div>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              3. Keep Your Living Space Cool
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              If your home does not have air conditioning, use these simple steps:
            </p>
            <ul className="list-disc list-inside text-sm text-mist leading-relaxed mb-6 space-y-1.5 pl-4">
              <li>Keep window shades closed during hot daylight hours to block radiant heat.</li>
              <li>Open windows in the evening or early morning to let cooler air circulate.</li>
              <li>Avoid using ovens or large heat-generating appliances during peak hours.</li>
            </ul>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              Take the Quiz & Check the Map
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Vulnerable living setups raise your heat threat. Take the satirical <Link href="/quiz" className="text-frost hover:underline font-semibold">Am I Cooked? Quiz</Link> to evaluate your home and lifestyle conditions, or check the <Link href="/" className="text-frost hover:underline font-semibold">live heat map</Link> to see which cities are registering dangerous temperature ratings right now.
            </p>

            {/* Medical Disclaimer */}
            <footer className="mt-12 border-t border-line/60 pt-6 text-[11px] text-mist/60 leading-relaxed italic">
              <span className="font-semibold block not-italic text-mist mb-1">Disclaimer:</span>
              This guide provides general informational guidelines sourced from public health advisories. It does not constitute medical advice or substitute for professional medical care. Consult a qualified medical practitioner for specific health concerns.
            </footer>
          </article>
        </main>
      </div>
    </div>
  );
}
