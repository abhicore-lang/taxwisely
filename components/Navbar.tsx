"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calculator, TrendingUp, DollarSign, FileText } from "lucide-react";

const navLinks = [
  { href: "/hra-calculator", label: "HRA Calculator", icon: Calculator },
  { href: "/new-vs-old-regime", label: "Tax Regime", icon: TrendingUp },
  { href: "/salary-calculator", label: "Salary Calculator", icon: DollarSign },
  { href: "/payslip-explainer", label: "Payslip Guide", icon: FileText },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080C10]/95 backdrop-blur-md border-b border-[#1E3A2F] shadow-lg shadow-black/20"
            : "bg-[#080C10] border-b border-[#1E3A2F]/50"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#00D4AA] rounded-lg flex items-center justify-center group-hover:bg-[#00B894] transition-colors">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-white font-bold text-lg font-heading">
                Tax<span className="text-[#00D4AA]">Wisely</span>
                <span className="text-[#6B7280] text-sm font-normal">.in</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20"
                        : "text-[#9CA3AF] hover:text-white hover:bg-[#0D1117]"
                    }`}
                  >
                    <link.icon size={15} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#0D1117] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`fixed top-16 left-0 right-0 z-50 md:hidden bg-[#080C10] border-b border-[#1E3A2F] transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#0D1117]"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#1E3A2F] mt-2">
            <Link
              href="/about"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#9CA3AF] hover:text-white hover:bg-[#0D1117] transition-all"
            >
              About TaxWisely
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
