"use client";

// Replace with Google AdSense code when ready.
// AdSense script goes in layout.tsx <head> and individual ad units here.

interface AdBannerProps {
  position: "top" | "bottom" | "sidebar";
  className?: string;
}

export default function AdBanner({ position, className = "" }: AdBannerProps) {
  const heightClass =
    position === "top" || position === "bottom" ? "h-16 sm:h-20" : "h-64";

  return (
    <div
      className={`w-full ${heightClass} border border-dashed border-[#2D3748] rounded-lg
        flex items-center justify-center bg-[#1A1D27]/40 ${className}`}
      aria-label="Advertisement"
    >
      {/* Replace with Google AdSense code */}
      {/*
        Example AdSense unit:
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
      <span className="text-[#4B5563] text-xs font-medium tracking-widest uppercase select-none">
        Advertisement
      </span>
    </div>
  );
}
