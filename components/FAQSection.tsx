"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-white font-heading mb-6">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              openIndex === i
                ? "border-[#3B82F6]/40 bg-[#1A1D27]"
                : "border-[#2D3748] bg-[#1A1D27] hover:border-[#3B82F6]/30"
            }`}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span
                className={`text-sm font-medium pr-4 ${
                  openIndex === i ? "text-[#3B82F6]" : "text-white"
                }`}
              >
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-[#9CA3AF] transition-transform duration-200 ${
                  openIndex === i ? "rotate-180 text-[#3B82F6]" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 animate-fade-in">
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// JSON-LD FAQ Schema helper
export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
