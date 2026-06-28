"use client";

import { useRef, useEffect, useCallback } from "react";
import { X, Lock, ShieldCheck, Heart, Smile } from "lucide-react";
import { useSuffering } from "@/lib/SufferingContext";

export const PAYPAL_ME_URL = "https://www.paypal.com/paypalme/arewecooked/5";

export default function BuyMeIceCreamModal() {
  const { isIceCreamModalOpen, closeIceCreamModal } = useSuffering();

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* ---- focus management ---- */
  useEffect(() => {
    if (isIceCreamModalOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [isIceCreamModalOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeIceCreamModal();
        return;
      }
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [closeIceCreamModal],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        closeIceCreamModal();
      }
    },
    [closeIceCreamModal],
  );

  const handlePayment = () => {
    window.open(PAYPAL_ME_URL, "_blank", "noopener,noreferrer");
  };

  if (!isIceCreamModalOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="rise relative w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-panel shadow-2xl outline-none max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={closeIceCreamModal}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel/80 text-mist backdrop-blur-md transition-colors hover:bg-white/10 hover:text-ink cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* Banner Image */}
        <div className="relative aspect-[1.5] w-full overflow-hidden bg-void">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/buy_me_icecream.jpg"
            alt="Buy me an Ice Cream"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Modal content */}
        <div className="flex flex-col gap-5 px-6 py-5">
          {/* Main payment box */}
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-panel-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            
            {/* Info details */}
            <div className="flex gap-3">
              <span className="text-3xl shrink-0 select-none">🍦</span>
              <div className="flex flex-col min-w-0">
                <span className="font-display text-sm font-black tracking-tight text-ink leading-tight">
                  Support & spread happiness!
                </span>
                <span className="font-display text-xs font-semibold text-frost mt-1 leading-none">
                  Buy me an ice cream
                </span>
                <span className="text-[11px] text-mist leading-normal mt-1">
                  Your support keeps this project sweet and running! 💖
                </span>
              </div>
            </div>

            {/* Price & Button Action */}
            <div className="flex items-center justify-between border-t border-line pt-4 sm:border-t-0 sm:pt-0 sm:flex-row sm:gap-5 shrink-0">
              
              {/* For an ice cream */}
              <div className="flex flex-col text-center sm:text-right">
                <span className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#ff9a8b] to-ember leading-none">
                  $5
                </span>
                <span className="text-[10px] text-mist font-semibold uppercase tracking-wider mt-1">
                  For an Ice cream
                </span>
              </div>

              {/* Pay $5 Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={handlePayment}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-[#ff4d6d] hover:bg-[#ff3356] px-6 py-2.5 text-sm font-black text-white shadow-[0_0_24px_-6px_rgba(255,77,109,0.5)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                  Pay $5
                </button>
                <span className="flex items-center gap-1 text-[10px] text-mist">
                  <Lock size={10} /> Secure Payment
                </span>
              </div>

            </div>

          </div>

          {/* Bottom Trust badges */}
          <div className="flex items-center justify-center gap-6 border-t border-line/50 pt-4 text-[11px] font-semibold text-mist">
            <span className="flex items-center gap-1 hover:text-frost transition-colors">
              <ShieldCheck size={13} className="text-frost" /> Safe & Secure
            </span>
            <span className="flex items-center gap-1 hover:text-ember transition-colors">
              <Heart size={13} className="text-ember fill-ember/20" /> Grateful Heart
            </span>
            <span className="flex items-center gap-1 hover:text-gold transition-colors">
              <Smile size={13} className="text-gold" /> Spreading Joy
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
