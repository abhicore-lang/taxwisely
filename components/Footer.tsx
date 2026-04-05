import Link from "next/link";
import { Calculator, TrendingUp, DollarSign, FileText, Info, Shield, AlertTriangle } from "lucide-react";

const toolLinks = [
  { href: "/hra-calculator", label: "HRA Calculator", icon: Calculator },
  { href: "/new-vs-old-regime", label: "New vs Old Regime", icon: TrendingUp },
  { href: "/salary-calculator", label: "Salary Calculator", icon: DollarSign },
  { href: "/payslip-explainer", label: "Payslip Explainer", icon: FileText },
];

const infoLinks = [
  { href: "/about", label: "About TaxWisely", icon: Info },
  { href: "/about#privacy", label: "Privacy Policy", icon: Shield },
  { href: "/about#disclaimer", label: "Disclaimer", icon: AlertTriangle },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#2D3748] bg-[#0D0F18] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-white font-bold text-lg font-heading">
                Tax<span className="text-[#3B82F6]">Wisely</span>
                <span className="text-[#6B7280] text-sm font-normal">.in</span>
              </span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Free tax calculation tools for salaried Indians. Simple, accurate, and always free.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#9CA3AF]">Based on Income Tax Act 2025-26</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-heading">Free Tools</h3>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] text-sm transition-colors duration-200 group"
                  >
                    <link.icon
                      size={14}
                      className="text-[#3B82F6] group-hover:scale-110 transition-transform"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-heading">Information</h3>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] text-sm transition-colors duration-200 group"
                  >
                    <link.icon
                      size={14}
                      className="text-[#6B7280] group-hover:text-[#3B82F6] transition-colors"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Disclaimer note */}
            <div className="mt-6 p-3 bg-[#1A1D27] border border-[#2D3748] rounded-lg">
              <p className="text-[#6B7280] text-xs leading-relaxed">
                Calculations are for informational purposes only. Consult a qualified CA for personalised tax advice.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#2D3748] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] text-xs">
            © 2026 TaxWisely.in — All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#6B7280] text-xs">Last updated: April 2026</span>
            <span className="text-[#2D3748]">|</span>
            <span className="text-[#6B7280] text-xs">FY 2025-26</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
