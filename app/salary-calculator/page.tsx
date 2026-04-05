import type { Metadata } from "next";
import SalaryCalculator from "@/components/SalaryCalculator";
import FAQSection, { FAQSchema } from "@/components/FAQSection";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "CTC to In-Hand Salary Calculator 2025-26 | TaxWisely",
  description:
    "Convert your CTC to exact in-hand salary. See full salary breakup including PF, tax, HRA and all deductions. Updated for FY 2025-26.",
  alternates: { canonical: "https://taxwisely.in/salary-calculator" },
  openGraph: {
    title: "CTC to In-Hand Salary Calculator 2025-26",
    description: "Convert your CTC to exact in-hand salary with full breakup.",
    url: "https://taxwisely.in/salary-calculator",
  },
};

const faqs = [
  {
    question: "What is CTC and how is it different from in-hand salary?",
    answer:
      "CTC (Cost to Company) is the total amount a company spends on an employee annually — including basic salary, HRA, allowances, employer PF contribution, and other benefits. In-hand (take-home) salary is what you actually receive after deductions like employee PF, income tax, and professional tax. Typically, take-home is 70-80% of CTC for most salaried employees.",
  },
  {
    question: "Why is my take-home salary less than expected?",
    answer:
      "Your take-home salary is reduced by: Employee PF (12% of basic salary), Income Tax / TDS (based on your tax slab), Professional Tax (up to ₹2,400/year depending on state), and any other deductions. Additionally, employer PF contribution is part of your CTC but never comes to your account.",
  },
  {
    question: "How is basic salary calculated from CTC?",
    answer:
      "There is no fixed rule, but most companies set basic salary at 40-50% of CTC. Basic salary forms the base for calculating HRA (usually 40-50% of basic), PF contribution (12% of basic), and gratuity. A lower basic means lower PF deduction but also lower HRA exemption.",
  },
  {
    question: "Is PF deducted from CTC or on top of CTC?",
    answer:
      "Employer PF (12% of basic) is usually included within your CTC, meaning it comes out of the total package. Employee PF (your own 12% contribution) is deducted from your gross salary each month. Both contributions go into your PF account — the employer's portion is part of your CTC but is never in your monthly take-home.",
  },
  {
    question: "What is professional tax and who pays it?",
    answer:
      "Professional tax is a state-level tax levied on salaried employees. It is deducted by your employer and deposited with the state government. The amount varies by state — most states charge ₹200/month (₹2,400/year). Not all states have professional tax — Maharashtra, Karnataka, West Bengal are major states that collect it.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Calculator — TaxWisely",
  url: "https://taxwisely.in/salary-calculator",
  description: "CTC to in-hand salary calculator for Indian employees",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://taxwisely.in" },
    { "@type": "ListItem", position: 2, name: "Salary Calculator", item: "https://taxwisely.in/salary-calculator" },
  ],
};

export default function SalaryCalculatorPage() {
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
          <span className="text-[#9CA3AF]">Salary Calculator</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full px-3 py-1 mb-3">
            <span className="text-xs text-[#00D4AA] font-medium">FY 2025-26</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-3">
            CTC to In-Hand Salary Calculator
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl">
            Enter your annual CTC and salary structure to see your exact monthly take-home.
            Full payslip-style breakup with all deductions calculated accurately.
          </p>
        </div>

        {/* Calculator */}
        <SalaryCalculator />

        {/* Bottom Ad */}
        <AdBanner position="bottom" className="my-8" />

        {/* How salary breakup works */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            How is Your Salary Structured?
          </h2>
          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-400 mb-3 text-sm uppercase tracking-wider">
                  Gross Earnings
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Basic Salary", desc: "Usually 40-50% of CTC. Base for all calculations." },
                    { label: "HRA", desc: "Usually 40-50% of basic. Partially or fully tax-free if you pay rent." },
                    { label: "Special Allowance", desc: "Residual amount = Gross - Basic - HRA. Fully taxable." },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-3 text-sm uppercase tracking-wider">
                  Deductions
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Employee PF", desc: "12% of basic salary. Goes into your PF account." },
                    { label: "Professional Tax", desc: "State tax. Usually ₹200/month." },
                    { label: "Income Tax (TDS)", desc: "Monthly TDS deducted based on annual tax liability." },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-[#0F1620] border border-[#1E3A2F] rounded-xl">
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Salary calculations are estimates based on standard industry salary structures for FY 2025-26.
            Actual deductions may vary based on your employer&apos;s HR policy, state of employment, and individual circumstances.
            Consult your HR department or a CA for exact calculations.
          </p>
        </div>
      </div>
    </>
  );
}
