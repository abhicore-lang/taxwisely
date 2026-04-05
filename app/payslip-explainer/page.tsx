import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Read Your Payslip — Complete Guide for Freshers 2026 | TaxWisely",
  description:
    "First job? Learn to read your payslip. Simple explanation of basic salary, HRA, PF, TDS and every payslip component. Complete guide for Indian freshers.",
  keywords: ["how to read payslip India", "payslip explained", "first payslip guide", "salary slip components India"],
  alternates: { canonical: "https://taxwisely.in/payslip-explainer" },
  openGraph: {
    title: "How to Read Your Payslip — Complete Guide for Freshers 2026",
    description: "Learn every component of your payslip. Simple guide for freshers.",
    url: "https://taxwisely.in/payslip-explainer",
  },
};

const earnings = [
  {
    name: "Basic Salary",
    shortName: "Basic",
    description:
      "The fixed core component of your salary. Everything else is calculated as a percentage of basic — HRA, PF, gratuity. Usually 40-50% of your CTC.",
    taxability: "Fully taxable",
    tip: "Lower basic = lower PF deduction (higher take-home) but also lower gratuity.",
  },
  {
    name: "House Rent Allowance",
    shortName: "HRA",
    description:
      "Allowance to help you pay rent. If you pay rent, part of this is tax-free under Section 10(13A). Typically 40-50% of basic salary.",
    taxability: "Partially tax-free",
    tip: "Submit rent receipts to your employer to claim HRA exemption. Use our HRA calculator to find your exact exemption.",
  },
  {
    name: "Special Allowance",
    shortName: "Spl. Allowance",
    description:
      "The residual amount left after accounting for basic + HRA + other fixed allowances. It makes up the difference between gross and other components.",
    taxability: "Fully taxable",
    tip: "This is the most flexible component in your CTC — companies often park miscellaneous pay here.",
  },
  {
    name: "Leave Travel Allowance",
    shortName: "LTA",
    description:
      "Paid to cover domestic travel expenses during leave. Exempt from tax if you actually travel (air/train/bus tickets required). Claimed twice in a 4-year block.",
    taxability: "Tax-free on actual travel",
    tip: "Keep your travel tickets. LTA covers only travel cost, not hotels or food.",
  },
  {
    name: "Medical Allowance",
    shortName: "Medical",
    description:
      "Fixed monthly allowance for medical expenses. Under the old regime, up to ₹15,000 per year was exempt on submission of bills. Under the new regime, it is fully taxable.",
    taxability: "Fully taxable (new regime)",
    tip: "Under old regime, save medical bills to claim exemption up to ₹15,000/year.",
  },
  {
    name: "Performance Bonus",
    shortName: "Bonus",
    description:
      "Variable pay based on individual or company performance. May be monthly, quarterly, or annual. Often listed separately on your payslip.",
    taxability: "Fully taxable",
    tip: "Bonus is taxable in the month it is credited. Plan your investments accordingly.",
  },
];

const deductions = [
  {
    name: "Provident Fund (PF)",
    shortName: "PF",
    description:
      "12% of your basic salary is deducted every month and deposited in your EPF account. Your employer also contributes 12% (usually part of CTC). It earns ~8.1% interest tax-free.",
    taxability: "Tax-free (80C)",
    tip: "PF withdrawals after 5 years of service are fully tax-free. Think of it as forced retirement savings.",
  },
  {
    name: "ESI (Employee State Insurance)",
    shortName: "ESI",
    description:
      "Applicable only if your gross salary is ≤ ₹21,000/month. Employee contributes 0.75%, employer contributes 3.25%. Provides health insurance and maternity benefits.",
    taxability: "Deductible",
    tip: "Most IT and high-salary employees are above the ₹21,000 threshold and don't pay ESI.",
  },
  {
    name: "Professional Tax",
    shortName: "PT",
    description:
      "A state-level tax on employment. Maximum ₹2,500/year. Deducted monthly (usually ₹200/month). Not all states charge it — Maharashtra, Karnataka, West Bengal do.",
    taxability: "Deductible under 16(iii)",
    tip: "Professional tax paid is deductible from your gross salary while computing income tax.",
  },
  {
    name: "Tax Deducted at Source (TDS)",
    shortName: "TDS",
    description:
      "Your employer deducts income tax from your salary every month and deposits it with the government. Your Form 16 shows total TDS for the year.",
    taxability: "Income tax advance",
    tip: "Submit your investment declarations (Form 12BB) to your employer in April to ensure correct TDS.",
  },
  {
    name: "Gratuity",
    shortName: "Gratuity",
    description:
      "A retirement benefit paid after 5 years of continuous service with one employer. Usually 4.81% of basic is provisioned in CTC. You receive it as a lump sum on exit.",
    taxability: "Tax-free up to ₹20 lakh",
    tip: "Gratuity = (Basic + DA) × 15/26 × years of service. You must work 5+ years to be eligible.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://taxwisely.in" },
    { "@type": "ListItem", position: 2, name: "Payslip Explainer", item: "https://taxwisely.in/payslip-explainer" },
  ],
};

const glossary = [
  { term: "CTC", definition: "Cost to Company — total amount employer spends on you annually." },
  { term: "Gross Salary", definition: "Total salary before deductions (Basic + HRA + all allowances)." },
  { term: "Net Salary", definition: "Take-home pay after all deductions. What hits your bank account." },
  { term: "Form 16", definition: "Annual TDS certificate from employer. Used to file ITR." },
  { term: "Form 12BB", definition: "Investment declaration form submitted to employer for lower TDS." },
  { term: "AY", definition: "Assessment Year — the year in which you file taxes for the previous financial year." },
  { term: "FY", definition: "Financial Year — April 1 to March 31." },
  { term: "EPF", definition: "Employee Provident Fund — long-term savings account managed by EPFO." },
  { term: "ESIC", definition: "Employee State Insurance Corporation — provides health coverage to low-wage workers." },
  { term: "ITR", definition: "Income Tax Return — annual tax filing with the Income Tax Department." },
];

const checklistItems = [
  "Verify your name, employee ID, and month are correct",
  "Check that basic salary matches your offer letter",
  "Confirm PF deduction = 12% of basic salary",
  "Verify total gross salary = basic + HRA + all allowances",
  "Check TDS deduction is reasonable for your income",
  "Ensure take-home = gross – all deductions",
  "If you submitted rent receipts, check HRA shows reduced TDS",
  "Look for any unexplained deductions and ask HR",
];

const commonMistakes = [
  {
    mistake: "Not submitting Form 12BB",
    impact: "Higher TDS throughout the year. Refund only after ITR filing.",
  },
  {
    mistake: "Ignoring HRA exemption",
    impact: "Paying tax on HRA when you could have saved by submitting rent receipts.",
  },
  {
    mistake: "Not checking for errors",
    impact: "Wrong deductions or missed allowances that compound over months.",
  },
  {
    mistake: "Confusing CTC with take-home",
    impact: "Financial planning based on wrong salary figure.",
  },
];

export default function PayslipExplainerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Top Ad */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner position="top" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#6B7280] mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-[#9CA3AF]">Payslip Explainer</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-3">
            <BookOpen size={12} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">Freshers Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-3">
            How to Read Your Payslip
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl">
            Got your first payslip and not sure what half of it means? This guide explains every component in plain English —
            no jargon, no confusion.
          </p>
        </div>

        {/* What is a payslip */}
        <section className="card mb-8">
          <h2 className="text-xl font-bold text-white font-heading mb-3">What is a Payslip?</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-3">
            A payslip (also called salary slip) is a monthly statement from your employer that shows:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Gross Earnings", desc: "All pay components before deductions — basic, HRA, allowances." },
              { title: "Deductions", desc: "PF, professional tax, TDS — amounts subtracted from your gross." },
              { title: "Net Take-Home", desc: "Final amount deposited in your bank = Gross – Deductions." },
            ].map((item) => (
              <div key={item.title} className="bg-[#080C10] border border-[#1E3A2F] rounded-lg p-3.5">
                <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-[#9CA3AF] text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mt-3">
            Your payslip matters for loan applications, visa applications, rental agreements, and filing your income tax return.
            Save a soft copy each month.
          </p>
        </section>

        {/* Earnings */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-heading">Earnings Components</h2>
          </div>
          <div className="space-y-4">
            {earnings.map((item) => (
              <div
                key={item.shortName}
                className="card border-l-2 border-l-emerald-500"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className="ml-2 text-xs text-[#6B7280]">({item.shortName})</span>
                  </div>
                  <span className="shrink-0 tag-green">{item.taxability}</span>
                </div>
                <p className="text-[#9CA3AF] text-sm mb-2">{item.description}</p>
                <div className="flex items-start gap-2 bg-[#080C10] rounded-lg px-3 py-2">
                  <CheckCircle size={13} className="text-[#00D4AA] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#9CA3AF]">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deductions */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={20} className="text-red-400" />
            <h2 className="text-xl font-bold text-white font-heading">Deduction Components</h2>
          </div>
          <div className="space-y-4">
            {deductions.map((item) => (
              <div
                key={item.shortName}
                className="card border-l-2 border-l-red-500"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className="ml-2 text-xs text-[#6B7280]">({item.shortName})</span>
                  </div>
                  <span className="shrink-0 tag-blue">{item.taxability}</span>
                </div>
                <p className="text-[#9CA3AF] text-sm mb-2">{item.description}</p>
                <div className="flex items-start gap-2 bg-[#080C10] rounded-lg px-3 py-2">
                  <CheckCircle size={13} className="text-[#00D4AA] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#9CA3AF]">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Ad */}
        <AdBanner position="bottom" className="mb-8" />

        {/* First payslip checklist */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            What to Check on Your First Payslip
          </h2>
          <div className="card">
            <div className="space-y-2.5">
              {checklistItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded border border-[#00D4AA]/50 bg-[#00D4AA]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#00D4AA] text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-[#9CA3AF]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common mistakes */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Common Payslip Mistakes to Watch For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commonMistakes.map((item) => (
              <div
                key={item.mistake}
                className="flex items-start gap-3 bg-[#0F1620] border border-[#1E3A2F] rounded-xl p-4"
              >
                <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{item.mistake}</p>
                  <p className="text-xs text-[#9CA3AF]">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white font-heading mb-4">Payslip Glossary</h2>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E3A2F] bg-[#162030]">
                    <th className="py-2.5 px-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Term</th>
                    <th className="py-2.5 px-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {glossary.map((item, i) => (
                    <tr key={i} className="border-b border-[#1E3A2F]/50 hover:bg-[#162030] transition-colors">
                      <td className="py-2.5 px-4 text-sm font-semibold text-[#00D4AA] whitespace-nowrap">
                        {item.term}
                      </td>
                      <td className="py-2.5 px-4 text-sm text-[#9CA3AF]">{item.definition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA to tools */}
        <section className="mb-8">
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-white font-heading mb-2">
              Now understand your numbers
            </h3>
            <p className="text-sm text-[#9CA3AF] mb-4">
              Use our free calculators to see your exact HRA exemption, compare tax regimes, and calculate your in-hand salary.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/hra-calculator" className="btn-primary text-sm py-2.5 px-5">HRA Calculator</a>
              <a href="/salary-calculator" className="btn-secondary text-sm py-2.5 px-5">Salary Calculator</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
