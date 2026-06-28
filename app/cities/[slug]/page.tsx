import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAllEuropeanWeather } from "@/lib/cityWeather";
import { ChevronLeft, Flame, ShieldAlert } from "lucide-react";

type CityParams = {
  slug: string;
};

function getTier(tempC: number) {
  if (tempC >= 40) return { label: "Insane", color: "text-[#ff2d6b]", bg: "bg-[#ff2d6b]/10", border: "border-[#ff2d6b]/30", advisory: "Dangerous conditions. Avoid direct sunlight and outdoor activities." };
  if (tempC >= 35) return { label: "Inferno", color: "text-ember", bg: "bg-ember/10", border: "border-ember/30", advisory: "Severe heatwave. Keep hydrated and find air-conditioned spaces." };
  if (tempC >= 30) return { label: "Hot AF", color: "text-gold", bg: "bg-gold/10", border: "border-gold/30", advisory: "Significant heat stress. Keep fans running and drink plenty of water." };
  if (tempC >= 25) return { label: "Hot", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", advisory: "Warm summer conditions. Stay comfortable and seek shade." };
  if (tempC >= 20) return { label: "Mild", color: "text-ink", bg: "bg-ink/10", border: "border-ink/30", advisory: "Pleasant temperatures. Ideal conditions for outdoor walks." };
  return { label: "Basically winter", color: "text-frost", bg: "bg-frost/10", border: "border-frost/30", advisory: "Cool weather. You might want to grab a light jacket." };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CityParams> | CityParams;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const allWeather = await fetchAllEuropeanWeather();
  const city = allWeather.find((c) => c.id === slug);
  if (!city) return {};

  return {
    title: `${city.name} Weather & Cooked Index`,
    description: `Check if ${city.name}, ${city.country} is cooked. Current real-time temperature is ${city.tempC.toFixed(1)}°C. See how it compares to other cities on the live leaderboard.`,
    openGraph: {
      title: `${city.name} is ${city.tempC.toFixed(1)}°C — Am I Cooked?`,
      description: `Live weather update for ${city.name}, ${city.country}. Compare temperature and cooked rating on the map.`,
    },
  };
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<CityParams> | CityParams;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const allWeather = await fetchAllEuropeanWeather();
  const city = allWeather.find((c) => c.id === slug);
  if (!city) notFound();

  const tier = getTier(city.tempC);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";
  const cityUrl = `${baseUrl}/cities/${slug}`;

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
        "name": city.name,
        "item": cityUrl,
      },
    ],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileNav />

        <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[calc(100vh-60px)] lg:min-h-screen">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-mist hover:text-ink transition-colors"
            >
              <ChevronLeft size={14} /> Back to the live map
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 shadow-2xl text-center">
            
            {/* Flag and Brand */}
            <span className="text-5xl mb-4 block select-none">{city.flag}</span>
            <h1 className="font-display text-3xl font-black text-ink tracking-tight mb-1">
              {city.name}
            </h1>
            <p className="text-xs text-mist uppercase font-semibold tracking-wider mb-6">
              {city.country}
            </p>

            {/* Current temperature */}
            <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full border-4 border-line bg-panel-2">
              <div className="relative flex flex-col items-center justify-center">
                <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink">
                  {city.tempC.toFixed(1)}°C
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-mist mt-1">
                  Air Temp
                </span>
              </div>
            </div>

            {/* Cooked Level badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase ${tier.bg} ${tier.color} ${tier.border} border`}>
                <Flame size={12} className="fill-current" />
                {tier.label} Tier
              </span>
            </div>

            {/* Advisory */}
            <div className="my-6 rounded-xl border border-line bg-panel-2 p-4 flex items-center justify-center gap-3">
              <ShieldAlert className={`${tier.color} shrink-0`} size={18} />
              <p className="text-xs text-mist leading-relaxed text-left font-medium">
                <strong>Status Update:</strong> {tier.advisory}
              </p>
            </div>

            {/* Description / Content link cluster */}
            <div className="text-left text-xs text-mist leading-relaxed space-y-3 pt-6 border-t border-line/50 mt-6">
              <p>
                Knowing the <Link href="/heat-index" className="text-frost hover:underline font-semibold">feels-like temperature (heat index)</Link> is essential. Humidity can make {city.name} feel much hotter than standard air readings indicate, increasing risk of exhaustion.
              </p>
              <p>
                To avoid heat exhaustion or heat stroke during extreme weather, follow official public health guidance listed in our <Link href="/heatwave-safety" className="text-frost hover:underline font-semibold">Heatwave Safety Guide</Link>.
              </p>
              <p>
                How cooked are you in your daily setup? Take the quick <Link href="/quiz" className="text-ember hover:underline font-semibold">Am I Cooked? Quiz</Link> to measure your custom score and check how you compare with other cities.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
