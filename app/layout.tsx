import type { Metadata } from "next";
import "./globals.css";
import { SufferingProvider } from "@/lib/SufferingContext";
import { AmbientProvider } from "@/lib/AmbientActivityContext";
import SubmitPainModal from "@/components/SubmitPainModal";
import BuyMeIceCreamModal from "@/components/BuyMeIceCreamModal";

export const metadata: Metadata = {
  title: "Heat Map — Where Europe is dying right now.",
  description:
    "Live heatwave tracker. See which European cities are cooked, drop your own suffering, and climb the leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
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
