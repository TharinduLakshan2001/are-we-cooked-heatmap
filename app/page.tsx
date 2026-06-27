import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import EuropeCookedIndex from "@/components/EuropeCookedIndex";
import HeaderTools from "@/components/HeaderTools";
import MapPanel from "@/components/MapPanel";
import RightRail from "@/components/RightRail";
import LiveFeed from "@/components/LiveFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <MobileNav />

        <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_21rem] lg:gap-5 lg:p-6">
          {/* Column 1: Europe Cooked Index & Map Panel */}
          <div className="flex flex-col gap-4 lg:gap-5 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:h-full">
            <EuropeCookedIndex />
            <div className="min-h-[480px] lg:min-h-0 h-full flex-1">
              <MapPanel />
            </div>
          </div>

          {/* Column 2: Buy me an Ice Creem & Right Rail */}
          <div className="flex flex-col gap-4 lg:gap-5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:h-full">
            <HeaderTools />
            <RightRail />
          </div>

          {/* Row 3: Live Suffering Feed + Footer (Unified bottom panel) */}
          <div className="lg:col-span-2 lg:row-start-3 rounded-2xl border border-line bg-panel/40 overflow-hidden mt-2">
            <LiveFeed />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
