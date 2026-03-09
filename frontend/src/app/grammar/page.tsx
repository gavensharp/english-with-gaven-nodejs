import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grammar Exercises | English with Gaven",
  description:
    "Master English grammar with interactive exercises. Practice prepositions, tenses, and more with instant feedback and visual examples.",
  keywords:
    "English grammar, grammar exercises, learn English, English practice, prepositions, tenses, English with Gaven",
  openGraph: {
    title: "Grammar Exercises | English with Gaven",
    description:
      "Master English grammar with interactive exercises and instant feedback",
    type: "website",
  },
};

export default function GrammarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-primary-dark">
          Grammar Exercises
        </h1>
        <p className="text-center text-gray-700 text-lg mb-12 max-w-3xl mx-auto">
          Improve your English grammar with interactive exercises designed for
          all levels. Practice with instant feedback, visual examples, and
          helpful hints.
        </p>

        {/* Prepositions Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-dark mb-6">
            Prepositions
          </h2>
          <p className="text-gray-600 mb-6">
            Learn how to use prepositions correctly with visual examples and
            practice exercises.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Beginner Level */}
            <Link href="/grammar/prepositions/beginner">
              <div className="bg-white border-2 border-neutral rounded-lg p-6 shadow-sm hover:shadow-lg hover:border-accent-orchid transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary-dark">
                    Beginner
                  </h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    A1-A2
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  Basic prepositions of place, time, and direction with visual
                  examples.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• In, on, at, under, above</li>
                  <li>• Behind, between, next to</li>
                  <li>• To, into, onto, over</li>
                </ul>
                <div className="text-accent-orange font-semibold hover:underline">
                  Start Practice →
                </div>
              </div>
            </Link>

            {/* Intermediate Level */}
            <Link href="/grammar/prepositions/intermediate">
              <div className="bg-white border-2 border-neutral rounded-lg p-6 shadow-sm hover:shadow-lg hover:border-accent-orchid transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary-dark">
                    Intermediate
                  </h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    B1-B2
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  Advanced prepositions and prepositional phrases.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Beside, opposite, beyond</li>
                  <li>• Since, during, due to</li>
                  <li>• Multi-word prepositions</li>
                </ul>
                <div className="text-accent-orange font-semibold hover:underline">
                  Start Practice →
                </div>
              </div>
            </Link>

            {/* Advanced Level */}
            <div className="bg-white border-2 border-neutral-light rounded-lg p-6 shadow-sm opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-500">Advanced</h3>
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                  C1-C2
                </span>
              </div>
              <p className="text-gray-500 mb-4">
                Complex prepositional usage and idiomatic expressions.
              </p>
              <div className="text-gray-400 font-semibold">Coming Soon</div>
            </div>
          </div>
        </section>

        {/* Tenses Section (Coming Soon) */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-dark mb-6">Tenses</h2>
          <p className="text-gray-600 mb-6">
            Master English verb tenses with comprehensive exercises.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-neutral-light rounded-lg p-6 shadow-sm opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-500">Beginner</h3>
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                  A1-A2
                </span>
              </div>
              <p className="text-gray-500 mb-4">
                Present simple, present continuous, past simple.
              </p>
              <div className="text-gray-400 font-semibold">Coming Soon</div>
            </div>

            <div className="bg-white border-2 border-neutral-light rounded-lg p-6 shadow-sm opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-500">
                  Intermediate
                </h3>
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                  B1-B2
                </span>
              </div>
              <p className="text-gray-500 mb-4">
                Present perfect, future forms, conditionals.
              </p>
              <div className="text-gray-400 font-semibold">Coming Soon</div>
            </div>

            <div className="bg-white border-2 border-neutral-light rounded-lg p-6 shadow-sm opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-500">Advanced</h3>
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                  C1-C2
                </span>
              </div>
              <p className="text-gray-500 mb-4">
                Mixed tenses, passive voice, advanced usage.
              </p>
              <div className="text-gray-400 font-semibold">Coming Soon</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
