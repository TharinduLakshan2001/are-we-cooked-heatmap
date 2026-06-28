import type { Metadata } from "next";
import "./globals.css";
import { SufferingProvider } from "@/lib/SufferingContext";
import { AmbientProvider } from "@/lib/AmbientActivityContext";
import SubmitPainModal from "@/components/SubmitPainModal";
import BuyMeIceCreamModal from "@/components/BuyMeIceCreamModal";

export const metadata: Metadata = {
  title: {
    default: "Am I Cooked? | Live Europe Heat Map & Heatwave Tracker",
    template: "%s | Am I Cooked?",
  },
  description:
    "Live satirical heatwave tracker and slang quiz. See which European cities are cooked, take the 'Am I Cooked?' quiz, drop your own suffering, and climb the leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Am I Cooked",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`, // TODO: replace with real logo path when available
    "sameAs": [
      "https://www.tiktok.com/@amicooked", // TODO: replace with real social URLs
      "https://twitter.com/amicooked", // TODO: replace with real social URLs
      "https://www.instagram.com/amicooked" // TODO: replace with real social URLs
    ]
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full bg-void text-ink">
        <SufferingProvider>
          <AmbientProvider>
            {children}
            <SubmitPainModal />
            <BuyMeIceCreamModal />
          </AmbientProvider>
        </SufferingProvider>
      </body>
    </html>
  );
}
