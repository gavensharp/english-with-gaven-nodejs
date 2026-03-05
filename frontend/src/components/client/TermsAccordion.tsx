"use client";

import { useState, ReactNode } from "react";

interface TermsSection {
  title: string;
  content: string | ReactNode;
}

interface TermsAccordionProps {
  sections: TermsSection[];
}

export default function TermsAccordion({ sections }: TermsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="card overflow-hidden">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition"
                aria-expanded={openIndex === index}>
                <h2 className="text-lg font-bold text-gray-800 pr-4">
                  {section.title}
                </h2>
                <svg
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-[1000px]" : "max-h-0"
                }`}>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  {typeof section.content === "string" ? (
                    <p>{section.content}</p>
                  ) : (
                    section.content
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
