import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "What is the Heat Index? Feels-Like Temperature Explained",
  description:
    "Learn what the heat index (feels-like temperature) means, how relative humidity amplifies air temperature, and why it matters for heatwave safety.",
};

export default function HeatIndexPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the heat index?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The heat index, often called feels-like temperature, is an index that combines air temperature and relative humidity in shaded areas to determine how hot it actually feels to the human body.",
        },
      },
      {
        "@type": "Question",
        "name": "Why does relative humidity make it feel hotter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Relative humidity measures how much water vapor is in the air compared to the maximum amount the air can hold. High humidity slows down the evaporation of sweat from your skin—the body's natural cooling mechanism—making you feel significantly hotter than the thermometer reads.",
        },
      },
      {
        "@type": "Question",
        "name": "How is the feels-like temperature different from air temperature?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Air temperature is the dry-bulb temperature of the air measured by standard thermometers. The feels-like temperature (heat index) is an apparent temperature reflecting human discomfort, factoring in environmental moisture.",
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
        "name": "Heat Index Explainer",
        "item": `${baseUrl}/heat-index`,
      },
    ],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              <span className="text-frost text-sm font-bold uppercase tracking-wider">Topical Guide</span>
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="text-mist text-xs">5 min read</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink mb-6">
              What Is the Heat Index? <span className="text-frost">Feels-Like Temperature</span> Explained
            </h1>

            <p className="text-[15px] leading-relaxed text-mist mb-6">
              When summer rolls in, checking the weather forecast is no longer as simple as looking at the thermometer. You might see a temperature of <strong>32°C</strong>, but with a warning that it actually feels like <strong>39°C</strong>. That apparent figure is the <strong>heat index</strong>.
            </p>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              Why Air Temperature Doesn&apos;t Tell the Whole Story
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Your body cools itself primarily through perspiration. As sweat evaporates from your skin, it absorbs and removes heat from your body. However, relative humidity levels dictate how quickly this evaporation can happen.
            </p>
            <p className="text-sm text-mist leading-relaxed mb-6">
              When relative humidity is high, the air is already filled with moisture, making it much harder for your sweat to evaporate. Consequently, your body retains heat, your heart rate rises, and you feel significantly hotter than the actual temperature of the surrounding air.
            </p>

            {/* Callout box */}
            <div className="my-8 rounded-2xl border border-[#ff4d2e]/20 bg-gradient-to-br from-[#ff4d2e]/10 to-panel-2 p-5 flex gap-4">
              <Info className="text-ember shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Topical Authority Check</h3>
                <p className="text-xs text-mist leading-relaxed mt-1">
                  On our live map, cities like <Link href="/cities/athens" className="text-ember hover:underline font-semibold">Athens</Link> and <Link href="/cities/rome" className="text-ember hover:underline font-semibold">Rome</Link> frequently experience high relative humidity along the coast, raising their feels-like index to critical levels even when nominal air temperatures are lower. Check how they are doing on the <Link href="/" className="text-frost hover:underline font-semibold">live map leaderboard</Link>.
                </p>
              </div>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              The Heat Index Chart: When Does It Become Dangerous?
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Meteorologists categorize heat index values into threat levels to help the public stay safe:
            </p>
            <ul className="list-disc list-inside text-sm text-mist leading-relaxed mb-6 space-y-2 pl-4">
              <li><strong className="text-emerald-400">27°C - 32°C (Caution):</strong> Fatigue is possible with prolonged exposure and activity.</li>
              <li><strong className="text-gold">32°C - 41°C (Extreme Caution):</strong> Heat cramps and heat exhaustion are possible.</li>
              <li><strong className="text-ember">41°C - 54°C (Danger):</strong> Heat exhaustion is likely; heat stroke is possible.</li>
              <li><strong className="text-[#ff2d6b]">54°C or higher (Extreme Danger):</strong> Heat stroke is highly imminent.</li>
            </ul>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 my-6">
              <div className="rounded-xl border border-line bg-panel-2 p-4">
                <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                  <HelpCircle size={16} className="text-frost" /> How is the heat index calculated?
                </h3>
                <p className="text-xs text-mist mt-2 leading-relaxed">
                  The index is calculated using a multi-parameter equation developed by Rothfusz. It applies dry-bulb temperature and relative humidity to estimate subjective sensory discomfort.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel-2 p-4">
                <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                  <HelpCircle size={16} className="text-frost" /> Does wind affect the feels-like temperature?
                </h3>
                <p className="text-xs text-mist mt-2 leading-relaxed">
                  In hot conditions, wind can speed up evaporation slightly, providing a minor cooling sensation. However, if the air is extremely hot (above skin temperature), wind can behave like a convection oven, worsening heat stress.
                </p>
              </div>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-8 mb-4">
              Are You Cooked?
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Before heading out today, calculate your personal comfort index. Take our quick <Link href="/quiz" className="text-frost hover:underline font-semibold">Am I Cooked? Quiz</Link> to check your home and lifestyle vulnerability and discover which temperature tier you are sitting in.
            </p>
          </article>
        </main>
      </div>
    </div>
  );
}
