import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, TrendingUp, DollarSign, FileText, ArrowRight, Zap, Shield, RefreshCw } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "TaxWisely — Free Tax Calculator for Salaried Indians",
  description:
    "Calculate HRA exemption, compare new vs old tax regime, and understand your salary. Free tools for salaried Indians. Based on Budget 2025-26.",
  alternates: { canonical: "https://taxwisely.in" },
};

const tools = [
  {
    href: "/hra-calculator",
    icon: Calculator,
    badge: "Most Popular",
    badgeColor: "bg-[#3B82F6] text-white",
    title: "HRA Calculator",
    description:
      "Calculate your HRA tax exemption instantly. Know exactly how much HRA is tax-free and generate a professional rent receipt PDF.",
    cta: "Calculate HRA →",
    features: ["Instant HRA exemption", "Metro & Non-Metro", "Rent Receipt PDF"],
  },
  {
    href: "/new-vs-old-regime",
    icon: TrendingUp,
    badge: "Budget 2025",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    title: "New vs Old Regime",
    description:
      "Compare both tax regimes side by side. Enter your deductions and instantly see which regime saves you more tax in 2025-26.",
    cta: "Compare Regimes →",
    features: ["Side-by-side comparison", "All deductions covered", "Instant recommendation"],
  },
  {
    href: "/salary-calculator",
    icon: DollarSign,
    badge: null,
    badgeColor: "",
    title: "Salary Calculator",
    description:
      "Convert your CTC to exact in-hand salary. See full breakup including PF, tax, HRA and all deductions — formatted like a real payslip.",
    cta: "Calculate Salary →",
    features: ["CTC to in-hand", "Full payslip breakup", "PF & TDS included"],
  },
  {
    href: "/payslip-explainer",
    icon: FileText,
    badge: "Freshers",
    badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    title: "Payslip Explainer",
    description:
      "Just got your first payslip and confused? A plain-English guide to every component — Basic, HRA, PF, TDS and everything in between.",
    cta: "Read Guide →",
    features: ["Plain-English guide", "Every component explained", "Common mistakes"],
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant Calculations",
    description: "Real-time results as you type. No waiting, no page reloads.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All calculations happen in your browser. No data stored on servers.",
  },
  {
    icon: RefreshCw,
    title: "Budget 2025-26",
    description: "Updated with latest tax slabs, rebates and standard deductions.",
  },
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TaxWisely",
  url: "https://taxwisely.in",
  description: "Free tax calculation tools for salaried Indians",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://taxwisely.in/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Top Ad */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner position="top" />
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
          <span className="text-sm text-[#3B82F6] font-medium">Updated for Budget 2025-26</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-5">
          Tax Calculations.{" "}
          <span className="text-[#3B82F6]">Made Simple.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-8 leading-relaxed">
          Free tools for every salaried Indian. Calculate HRA, compare tax regimes, understand your payslip.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <Link href="/hra-calculator" className="btn-primary flex items-center gap-2">
            Start Calculating <ArrowRight size={16} />
          </Link>
          <Link href="/new-vs-old-regime" className="btn-secondary">
            Compare Tax Regimes
          </Link>
        </div>

        <p className="text-xs text-[#6B7280]">Free forever. No signup required.</p>
      </section>

      {/* Feature highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#1A1D27] border border-[#2D3748]">
              <div className="w-8 h-8 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <f.icon size={16} className="text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tool cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-white font-heading mb-8">
          All Free Tax Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card card-hover group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-colors">
                  <tool.icon size={24} className="text-[#3B82F6]" />
                </div>
                {tool.badge && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white font-heading mb-2 group-hover:text-[#3B82F6] transition-colors">
                {tool.title}
              </h3>

              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4 flex-1">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {tool.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs bg-[#0F1117] border border-[#2D3748] text-[#9CA3AF] px-2.5 py-1 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-[#3B82F6] text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
                {tool.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AdBanner position="bottom" />
      </div>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#1A1D27] border border-[#2D3748] rounded-xl p-5">
          <p className="text-xs text-[#6B7280] text-center leading-relaxed">
            All calculations are based on Income Tax Act provisions for FY 2025-26 (AY 2026-27) as per Budget 2025.
            TaxWisely is for informational purposes only. For personalised tax advice, consult a qualified Chartered Accountant.
          </p>
        </div>
      </section>
    </>
  );
}
