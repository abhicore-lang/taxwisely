import type { Metadata } from "next";
import HRACalculator from "@/components/HRACalculator";
import RentReceiptGenerator from "@/components/RentReceiptGenerator";
import FAQSection, { FAQSchema } from "@/components/FAQSection";
import AdBanner from "@/components/AdBanner";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "HRA Calculator 2026-27 — Calculate HRA Exemption & Download Rent Receipt | TaxWisely",
  description:
    "Calculate your HRA tax exemption instantly. Enter basic salary, HRA and rent to know exactly how much HRA is tax free. Download rent receipt PDF free.",
  alternates: { canonical: "https://taxwisely.in/hra-calculator" },
  openGraph: {
    title: "HRA Calculator 2026-27 — Calculate HRA Exemption & Download Rent Receipt",
    description:
      "Calculate your HRA tax exemption instantly. Download rent receipt PDF free.",
    url: "https://taxwisely.in/hra-calculator",
  },
};

const faqs = [
  {
    question: "What is the HRA exemption limit?",
    answer:
      "HRA exemption is the minimum of: (1) Actual HRA received from employer, (2) 50% of basic salary for metro cities or 40% for non-metro cities, and (3) Actual rent paid minus 10% of basic salary. There is no fixed upper limit — it depends on your actual salary and rent.",
  },
  {
    question: "Is HRA fully tax exempt?",
    answer:
      "No, HRA is not fully tax exempt. Only the minimum of the three prescribed amounts is exempt. The remaining HRA is added to your taxable income. For example, if you receive ₹20,000 HRA but only ₹12,000 qualifies for exemption, the balance ₹8,000 is taxable.",
  },
  {
    question: "How to calculate HRA for metro cities?",
    answer:
      "For metro cities, the second rule uses 50% of basic salary. As of FY 2026-27, metro cities are: Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, and Ahmedabad (8 cities total). Bengaluru, Hyderabad, Pune and Ahmedabad were added effective April 1, 2026. For all other cities, 40% of basic is used instead of 50%.",
  },
  {
    question: "Can I claim HRA without PAN of landlord?",
    answer:
      "You can claim HRA without landlord PAN if your annual rent is up to ₹1,00,000 (i.e., ₹8,333 per month). If annual rent exceeds ₹1,00,000, providing landlord PAN is mandatory as per Income Tax rules. The rent receipt must include landlord PAN in that case.",
  },
  {
    question: "How to generate rent receipt for HRA claim?",
    answer:
      "Use our free Rent Receipt Generator below the HRA calculator. Enter tenant name, landlord name, landlord PAN (if applicable), property address, rent amount, and the month and year. Click 'Generate & Download' to get a professionally formatted PDF rent receipt instantly.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HRA Calculator — TaxWisely",
  url: "https://taxwisely.in/hra-calculator",
  description: "Free HRA tax exemption calculator for salaried Indians",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://taxwisely.in" },
    { "@type": "ListItem", position: 2, name: "HRA Calculator", item: "https://taxwisely.in/hra-calculator" },
  ],
};

const hraRules = [
  "HRA exemption = minimum of 3 amounts",
  "50% of basic for metro cities (8 cities), 40% for non-metro",
  "Rent paid minus 10% of basic salary",
  "Landlord PAN required if rent > ₹1 lakh/year",
  "Metro cities (FY 2026-27): Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad",
  "HRA exemption only under old tax regime — not available in new regime",
];

export default function HRACalculatorPage() {
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
          <span className="text-[#9CA3AF]">HRA Calculator</span>
        </nav>

        {/* New metro cities update notice */}
        <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3.5">
          <span className="text-amber-400 text-lg shrink-0">🏙️</span>
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-0.5">Metro Cities Updated — Effective FY 2026-27 (April 1, 2026)</p>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Bengaluru, Hyderabad, Pune and Ahmedabad have been added as metro cities for HRA exemption.
              These cities now qualify for <strong className="text-white">50% of basic salary</strong> (up from 40%) under Rule 2A.
              Total metro cities: <strong className="text-white">Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad.</strong>
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full px-3 py-1 mb-3">
            <span className="text-xs text-[#00D4AA] font-medium">FY 2026-27 / 2026-27</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-3">
            HRA Calculator 2026-27
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl">
            Calculate your exact HRA tax exemption under Section 10(13A) of the Income Tax Act.
            Enter your basic salary, HRA received, and actual rent paid to get your result instantly.
          </p>
        </div>

        {/* Calculator */}
        <HRACalculator />

        {/* Bottom Ad */}
        <AdBanner position="bottom" className="my-8" />

        {/* Rent Receipt Generator */}
        <RentReceiptGenerator />

        {/* How HRA is calculated */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            How is HRA Exemption Calculated?
          </h2>
          <div className="card">
            <p className="text-[#9CA3AF] text-sm mb-4">
              Under Section 10(13A) of the Income Tax Act, HRA exemption is the <strong className="text-white">minimum</strong> of the following three amounts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  number: "1",
                  title: "Actual HRA Received",
                  desc: "The HRA amount your employer pays you every month as per your salary structure.",
                },
                {
                  number: "2",
                  title: "% of Basic Salary",
                  desc: "50% of basic salary for metro cities (Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad). 40% for all other cities. New 4 cities added effective FY 2026-27.",
                },
                {
                  number: "3",
                  title: "Rent - 10% of Basic",
                  desc: "Actual rent paid minus 10% of your basic salary. If rent is less than 10% of basic, this becomes zero.",
                },
              ].map((rule) => (
                <div key={rule.number} className="bg-[#080C10] border border-[#1E3A2F] rounded-xl p-4">
                  <div className="w-8 h-8 bg-[#00D4AA] rounded-lg flex items-center justify-center text-white font-bold text-sm mb-3">
                    {rule.number}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{rule.title}</h3>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HRA Exemption Rules */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            HRA Exemption Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hraRules.map((rule) => (
              <div
                key={rule}
                className="flex items-center gap-3 bg-[#0F1620] border border-[#1E3A2F] rounded-lg px-4 py-3"
              >
                <CheckCircle size={16} className="text-[#00D4AA] shrink-0" />
                <span className="text-sm text-[#9CA3AF]">{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-[#0F1620] border border-[#1E3A2F] rounded-xl">
          <p className="text-xs text-[#6B7280] leading-relaxed">
            HRA calculations are based on Section 10(13A) of the Income Tax Act, 1961 and Rule 2A of the Income Tax Rules.
            This calculator is for FY 2026-27 (AY 2027-28). For personalised tax advice, consult a qualified Chartered Accountant.
          </p>
        </div>
      </div>
    </>
  );
}
