import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Target, AlertTriangle, Mail, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About TaxWisely — Free Tax Tools for Salaried Indians",
  description:
    "TaxWisely provides free, accurate tax calculation tools for salaried Indians. Learn about our mission, accuracy commitment, and privacy policy.",
  alternates: { canonical: "https://taxwisely.in/about" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://taxwisely.in" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://taxwisely.in/about" },
  ],
};

const commitments = [
  "Tax slabs updated from official Budget 2025 notifications",
  "HRA calculation follows Section 10(13A) and Rule 2A exactly",
  "New regime rebate limits verified against Finance Act 2025",
  "All three HRA rules calculated correctly before finding minimum",
  "PF calculation based on EPFO guidelines",
  "Cess calculated at 4% on total income tax liability",
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#6B7280] mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-[#9CA3AF]">About</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="w-14 h-14 bg-[#3B82F6] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-3">
            About TaxWisely
          </h1>
          <p className="text-[#9CA3AF] leading-relaxed">
            TaxWisely was built out of frustration with overly complicated, sign-up-required, ad-heavy tax sites.
            We wanted something fast, free, dark mode, and actually accurate.
          </p>
        </div>

        {/* Why we built it */}
        <section className="card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Target size={20} className="text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-white font-heading">Why TaxWisely?</h2>
          </div>
          <div className="space-y-3 text-sm text-[#9CA3AF] leading-relaxed">
            <p>
              Every year, millions of salaried Indians need to answer simple questions:{" "}
              <em className="text-white">How much HRA can I claim? Should I pick the new or old regime? What will my actual in-hand salary be?</em>
            </p>
            <p>
              The existing tools required creating accounts, were full of distracting ads, had outdated slabs, or gave results
              without explaining the logic. TaxWisely is different — no login, no email, instant results, with transparent calculations.
            </p>
            <p>
              All calculations happen in your browser. We don&apos;t see your salary data, we don&apos;t store it, and we never will.
            </p>
          </div>
        </section>

        {/* Accuracy commitment */}
        <section className="card mb-8" id="accuracy">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-heading">Our Commitment to Accuracy</h2>
          </div>
          <p className="text-sm text-[#9CA3AF] mb-4 leading-relaxed">
            We base all calculations on the official Income Tax Act provisions and Finance Act notifications.
            Here is what we verify:
          </p>
          <div className="space-y-2.5">
            {commitments.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-[#9CA3AF]">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 px-4 py-3 bg-[#0F1117] border border-[#2D3748] rounded-lg">
            <p className="text-xs text-[#6B7280]">
              All calculations based on Income Tax Act 2025-26 (Assessment Year 2026-27) as per Finance Act 2025.
              Last updated: April 2026.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section className="card mb-8" id="privacy">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-white font-heading">Privacy Policy</h2>
          </div>
          <div className="space-y-3 text-sm text-[#9CA3AF] leading-relaxed">
            <p>
              <strong className="text-white">We do not collect your salary data.</strong>{" "}
              All tax calculations happen entirely in your browser using JavaScript. No numbers you enter are transmitted to our servers.
            </p>
            <p>
              <strong className="text-white">Local storage:</strong>{" "}
              On some tools, we use your browser&apos;s localStorage to save your last entered values so you don&apos;t have to retype them.
              This data never leaves your device.
            </p>
            <p>
              <strong className="text-white">Analytics:</strong>{" "}
              We use Google Analytics 4 to understand how people use TaxWisely (which pages are popular, how long people stay).
              This is aggregate, anonymous data — no personally identifiable information is collected.
            </p>
            <p>
              <strong className="text-white">Cookies:</strong>{" "}
              GA4 uses cookies for analytics. No marketing or advertising cookies are placed.
            </p>
            <p>
              <strong className="text-white">Advertising:</strong>{" "}
              TaxWisely displays Google AdSense ads to sustain the free service. AdSense may use cookies based on your browsing history.
              You can opt out via Google&apos;s ad settings.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="card mb-8" id="disclaimer">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-white font-heading">Disclaimer</h2>
          </div>
          <div className="space-y-3 text-sm text-[#9CA3AF] leading-relaxed">
            <p>
              TaxWisely is for <strong className="text-white">informational and educational purposes only.</strong>{" "}
              The calculations provided are estimates based on standard interpretations of the Income Tax Act.
            </p>
            <p>
              Individual tax situations may vary based on specific circumstances, additional income sources,
              deductions not covered here, or special provisions that may apply to you.
            </p>
            <p>
              <strong className="text-white">Please consult a qualified Chartered Accountant (CA) or tax professional</strong>{" "}
              before making financial or tax planning decisions. TaxWisely is not liable for any errors, omissions,
              or outcomes resulting from the use of this tool.
            </p>
            <p>
              The Income Tax Act and its provisions are complex and subject to change. While we strive to keep our tools
              up to date, there may be a lag between legislative changes and updates to our calculators.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={20} className="text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-white font-heading">Contact</h2>
          </div>
          <p className="text-sm text-[#9CA3AF] mb-3">
            Found a calculation error? Have a suggestion? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:hello@taxwisely.in"
            className="inline-flex items-center gap-2 text-[#3B82F6] text-sm font-medium hover:underline"
          >
            <Mail size={15} />
            hello@taxwisely.in
          </a>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white font-heading mb-3">Start using TaxWisely</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hra-calculator" className="btn-primary text-sm">HRA Calculator</Link>
            <Link href="/new-vs-old-regime" className="btn-secondary text-sm">Compare Tax Regimes</Link>
          </div>
        </div>
      </div>
    </>
  );
}
