import type { Metadata } from "next";
import RegimeComparator from "@/components/RegimeComparator";
import FAQSection, { FAQSchema } from "@/components/FAQSection";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "New vs Old Tax Regime Calculator 2025-26 — Which is Better? | TaxWisely",
  description:
    "Compare new and old tax regime for your salary. Instant calculation showing which regime saves more tax in 2025-26.",
  alternates: { canonical: "https://taxwisely.in/new-vs-old-regime" },
  openGraph: {
    title: "New vs Old Tax Regime Calculator 2025-26 — Which is Better?",
    description: "Compare new and old tax regime. Instant calculation for FY 2025-26.",
    url: "https://taxwisely.in/new-vs-old-regime",
  },
};

const faqs = [
  {
    question: "Which tax regime is better for 8 lakh salary?",
    answer:
      "For a ₹8 lakh salary with minimal deductions, the new regime is generally better since income up to ₹12 lakh has zero tax under the new regime (with ₹75,000 standard deduction and 87A rebate). If your taxable income (after new regime standard deduction) is ≤ ₹12 lakh, your tax is zero under the new regime.",
  },
  {
    question: "Can I switch between new and old tax regime?",
    answer:
      "Salaried employees can switch between regimes every financial year when filing their ITR. However, if you have business income, you can switch back to the old regime only once in your lifetime. For salaried individuals, you can freely choose the regime that benefits you most each year.",
  },
  {
    question: "What deductions are allowed in new tax regime?",
    answer:
      "The new regime allows very limited deductions: Standard deduction of ₹75,000 for salaried employees, employer NPS contribution under 80CCD(2), transport and conveyance allowance for specific categories, and gratuity exemption. Most popular deductions like 80C, 80D, HRA, and home loan interest are NOT available under the new regime.",
  },
  {
    question: "Is standard deduction available in new regime?",
    answer:
      "Yes! From FY 2024-25 onwards, a standard deduction of ₹75,000 is available for salaried individuals and pensioners under the new regime (increased from ₹50,000). This is automatically applied when you choose the new regime — no separate claim needed.",
  },
];

const newSlabs = [
  { range: "₹0 – ₹4,00,000", rate: "0%" },
  { range: "₹4,00,001 – ₹8,00,000", rate: "5%" },
  { range: "₹8,00,001 – ₹12,00,000", rate: "10%" },
  { range: "₹12,00,001 – ₹16,00,000", rate: "15%" },
  { range: "₹16,00,001 – ₹20,00,000", rate: "20%" },
  { range: "₹20,00,001 – ₹24,00,000", rate: "25%" },
  { range: "Above ₹24,00,000", rate: "30%" },
];

const oldSlabs = [
  { range: "₹0 – ₹2,50,000", rate: "0%" },
  { range: "₹2,50,001 – ₹5,00,000", rate: "5%" },
  { range: "₹5,00,001 – ₹10,00,000", rate: "20%" },
  { range: "Above ₹10,00,000", rate: "30%" },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "New vs Old Tax Regime Calculator — TaxWisely",
  url: "https://taxwisely.in/new-vs-old-regime",
  description: "Compare new and old tax regime for FY 2025-26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://taxwisely.in" },
    { "@type": "ListItem", position: 2, name: "New vs Old Regime", item: "https://taxwisely.in/new-vs-old-regime" },
  ],
};

export default function RegimePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <FAQSchema faqs={faqs} />

      {/* Top Ad */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner position="top" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#6B7280] mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-[#9CA3AF]">New vs Old Regime</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
            <span className="text-xs text-emerald-400 font-medium">Budget 2025 Updated</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-3">
            New vs Old Tax Regime Comparator
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl">
            Enter your annual income and deductions to instantly compare both tax regimes.
            We&apos;ll show you exactly which option saves more tax in FY 2025-26.
          </p>
        </div>

        {/* Comparator */}
        <RegimeComparator />

        {/* Bottom Ad */}
        <AdBanner position="bottom" className="my-8" />

        {/* Tax Slabs reference */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white font-heading mb-6">
            Tax Slab Rates for FY 2025-26
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Regime slabs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white font-heading">New Regime Slabs</h3>
                <span className="text-xs bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-2.5 py-1 rounded-full">
                  Default from FY 2024-25
                </span>
              </div>
              <div className="space-y-0">
                {newSlabs.map((slab, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-[#2D3748]/50 last:border-0"
                  >
                    <span className="text-sm text-[#9CA3AF]">{slab.range}</span>
                    <span className={`text-sm font-bold ${slab.rate === "0%" ? "text-emerald-400" : "text-white"}`}>
                      {slab.rate}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#2D3748] space-y-1.5">
                <p className="text-xs text-[#3B82F6]">✓ Standard deduction: ₹75,000</p>
                <p className="text-xs text-[#3B82F6]">✓ 87A Rebate: Tax = ₹0 if income ≤ ₹12,00,000</p>
                <p className="text-xs text-[#6B7280]">+ 4% Health & Education Cess on tax</p>
              </div>
            </div>

            {/* Old Regime slabs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white font-heading">Old Regime Slabs</h3>
                <span className="text-xs bg-[#2D3748] text-[#9CA3AF] px-2.5 py-1 rounded-full">
                  All deductions allowed
                </span>
              </div>
              <div className="space-y-0">
                {oldSlabs.map((slab, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-[#2D3748]/50 last:border-0"
                  >
                    <span className="text-sm text-[#9CA3AF]">{slab.range}</span>
                    <span className={`text-sm font-bold ${slab.rate === "0%" ? "text-emerald-400" : "text-white"}`}>
                      {slab.rate}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#2D3748] space-y-1.5">
                <p className="text-xs text-emerald-400">✓ Standard deduction: ₹50,000</p>
                <p className="text-xs text-emerald-400">✓ 87A Rebate: Tax = ₹0 if income ≤ ₹5,00,000</p>
                <p className="text-xs text-emerald-400">✓ HRA, 80C, 80D, Home Loan all allowed</p>
                <p className="text-xs text-[#6B7280]">+ 4% Health & Education Cess on tax</p>
              </div>
            </div>
          </div>
        </section>

        {/* When to choose which */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            When to Choose Which Regime?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl p-5">
              <h3 className="font-semibold text-[#3B82F6] mb-3">Choose New Regime if...</h3>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">→</span>
                  You have minimal investments (80C, 80D)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">→</span>
                  You don&apos;t have a home loan
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">→</span>
                  Your income is below ₹12 lakh (zero tax via rebate)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">→</span>
                  You prefer simplicity with fewer forms
                </li>
              </ul>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <h3 className="font-semibold text-emerald-400 mb-3">Choose Old Regime if...</h3>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  You have large 80C investments (max ₹1.5L)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  You pay significant HRA with rent receipts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  You have a home loan with large interest
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  Total deductions exceed ₹3-4 lakh
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-[#1A1D27] border border-[#2D3748] rounded-xl">
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Tax regime comparison is based on Finance Act 2025 provisions for FY 2025-26 (AY 2026-27).
            Surcharge calculations are not included for simplicity. For personalised advice, consult a qualified Chartered Accountant.
          </p>
        </div>
      </div>
    </>
  );
}
