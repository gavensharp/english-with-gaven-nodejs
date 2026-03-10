"use client";

import { useState } from "react";
import GrammarQuestionCard, {
  GrammarQuestion,
} from "@/components/grammar/GrammarQuestionCard";
import CompoundQuestionCard, {
  CompoundQuestion,
} from "@/components/grammar/CompoundQuestionCard";
import ProgressIndicator from "@/components/grammar/ProgressIndicator";
import ScoreModal from "@/components/grammar/ScoreModal";

const simpleQuestions: GrammarQuestion[] = [
  {
    id: 1,
    questionText: "If I had studied medicine, I ____ working in a hospital now.",
    correctAnswer: "would be",
    options: [
      { value: "would be", label: "would be" },
      { value: "would have been", label: "would have been" },
      { value: "will be", label: "will be" },
    ],
    hint: "Mixed conditional: past condition with present result",
  },
  {
    id: 3,
    questionText:
      "The archaeologists ____ the site for three years before making the major discovery.",
    correctAnswer: "had been excavating",
    options: [
      { value: "excavated", label: "excavated" },
      { value: "were excavating", label: "were excavating" },
      { value: "had been excavating", label: "had been excavating" },
    ],
    hint: "Past perfect continuous shows duration before a past moment",
  },
  {
    id: 4,
    questionText:
      "Little did he know that his invention ____ the entire industry.",
    correctAnswer: "would revolutionize",
    options: [
      { value: "revolutionizes", label: "revolutionizes" },
      { value: "would revolutionize", label: "would revolutionize" },
      { value: "had revolutionized", label: "had revolutionized" },
    ],
    hint: "Future in the past - use 'would' for future from past perspective",
  },
  {
    id: 5,
    questionText: "The professor explained that the Earth ____ around the Sun.",
    correctAnswer: "revolves",
    options: [
      { value: "revolves", label: "revolves" },
      { value: "revolved", label: "revolved" },
      { value: "had revolved", label: "had revolved" },
    ],
    hint: "No backshift for permanent scientific truths in reported speech",
  },
  {
    id: 7,
    questionText: "If I were more organized, I ____ the deadline yesterday.",
    correctAnswer: "wouldn't have missed",
    options: [
      { value: "won't miss", label: "won't miss" },
      { value: "wouldn't miss", label: "wouldn't miss" },
      { value: "wouldn't have missed", label: "wouldn't have missed" },
    ],
    hint: "Mixed conditional: present condition with past result",
  },
  {
    id: 8,
    questionText: "The concert ____ when the fire alarm went off.",
    correctAnswer: "was about to begin",
    options: [
      { value: "was about to begin", label: "was about to begin" },
      { value: "would begin", label: "would begin" },
      { value: "had begun", label: "had begun" },
    ],
    hint: "Use 'was about to' for imminent past action",
  },
  {
    id: 10,
    questionText: "I ____ all afternoon, and I'm exhausted.",
    correctAnswer: "have been writing",
    options: [
      { value: "write", label: "write" },
      { value: "have written", label: "have written" },
      { value: "have been writing", label: "have been writing" },
    ],
    hint: "Present perfect continuous emphasizes the ongoing activity",
  },
  {
    id: 11,
    questionText:
      "This ____ their final meeting before the company's dissolution.",
    correctAnswer: "was to be",
    options: [
      { value: "would be", label: "would be" },
      { value: "was to be", label: "was to be" },
      { value: "had been", label: "had been" },
    ],
    hint: "Use 'was to be' (formal) for destined or fated events",
  },
  {
    id: 13,
    questionText: "I was going to ____ you, but I forgot.",
    correctAnswer: "call",
    options: [
      { value: "call", label: "call" },
      { value: "called", label: "called" },
      { value: "calling", label: "calling" },
    ],
    hint: "Use 'was going to' for past plans that didn't happen",
  },
  {
    id: 14,
    questionText: "By next year, we ____ in this city for a decade.",
    correctAnswer: "will have been living",
    options: [
      { value: "will live", label: "will live" },
      { value: "will be living", label: "will be living" },
      { value: "will have been living", label: "will have been living" },
    ],
    hint: "Future perfect continuous for duration up to a future point",
  },
  {
    id: 16,
    questionText:
      "The researchers ____ this phenomenon for years, and their work continues.",
    correctAnswer: "have been studying",
    options: [
      { value: "study", label: "study" },
      { value: "have studied", label: "have studied" },
      { value: "have been studying", label: "have been studying" },
    ],
    hint: "Present perfect continuous emphasizes ongoing research",
  },
  {
    id: 17,
    questionText:
      "If she had accepted the offer, she ____ her new job next week.",
    correctAnswer: "would be starting",
    options: [
      { value: "would start", label: "would start" },
      { value: "would be starting", label: "would be starting" },
      { value: "would have started", label: "would have started" },
    ],
    hint: "Mixed conditional: past condition with future result",
  },
  {
    id: 19,
    questionText:
      "The novelist ____ three drafts before she was satisfied with the manuscript.",
    correctAnswer: "had written",
    options: [
      { value: "wrote", label: "wrote" },
      { value: "had written", label: "had written" },
      { value: "has written", label: "has written" },
    ],
    hint: "Past perfect for the earlier past action",
  },
  {
    id: 20,
    questionText:
      "She said she ____ unwell for several days before seeing a doctor.",
    correctAnswer: "had been feeling",
    options: [
      { value: "feels", label: "feels" },
      { value: "felt", label: "felt" },
      { value: "had been feeling", label: "had been feeling" },
    ],
    hint: "Past perfect continuous in reported speech for duration before past",
  },
];

const compoundQuestions: CompoundQuestion[] = [
  {
    id: 2,
    textParts: [
      "By the time the rescue team ",
      ", the climbers ",
      " to base camp.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "arrived",
        options: [
          { value: "arrived", label: "arrived" },
          { value: "had arrived", label: "had arrived" },
          { value: "was arriving", label: "was arriving" },
        ],
      },
      {
        id: 2,
        correctAnswer: "had already descended",
        options: [
          { value: "already descended", label: "already descended" },
          { value: "had already descended", label: "had already descended" },
          {
            value: "have already descended",
            label: "have already descended",
          },
        ],
      },
    ],
    correctMessage:
      'Correct! By the time the rescue team "arrived", the climbers "had already descended".',
    hint: "Which action happened first? Use past perfect for the earlier action.",
  },
  {
    id: 6,
    textParts: ["She ", " on the project for hours when her computer ", "."],
    fields: [
      {
        id: 1,
        correctAnswer: "had been working",
        options: [
          { value: "worked", label: "worked" },
          { value: "was working", label: "was working" },
          { value: "had been working", label: "had been working" },
        ],
      },
      {
        id: 2,
        correctAnswer: "crashed",
        options: [
          { value: "crashed", label: "crashed" },
          { value: "had crashed", label: "had crashed" },
          { value: "was crashing", label: "was crashing" },
        ],
      },
    ],
    correctMessage:
      'Correct! She "had been working" on the project when her computer "crashed".',
    hint: "Emphasize the duration of work before the crash.",
  },
  {
    id: 9,
    textParts: [
      "The CEO announced that the company ",
      " record profits and ",
      " internationally.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "had achieved",
        options: [
          { value: "achieved", label: "achieved" },
          { value: "has achieved", label: "has achieved" },
          { value: "had achieved", label: "had achieved" },
        ],
      },
      {
        id: 2,
        correctAnswer: "would expand",
        options: [
          { value: "will expand", label: "will expand" },
          { value: "would expand", label: "would expand" },
          { value: "expands", label: "expands" },
        ],
      },
    ],
    correctMessage:
      'Correct! The company "had achieved" profits and "would expand" internationally.',
    hint: "Backshift both verbs in reported speech.",
  },
  {
    id: 12,
    textParts: [
      "When she ",
      " at the airport, she realized she ",
      " her passport at home.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "arrived",
        options: [
          { value: "arrived", label: "arrived" },
          { value: "had arrived", label: "had arrived" },
          { value: "was arriving", label: "was arriving" },
        ],
      },
      {
        id: 2,
        correctAnswer: "had left",
        options: [
          { value: "left", label: "left" },
          { value: "had left", label: "had left" },
          { value: "has left", label: "has left" },
        ],
      },
    ],
    correctMessage:
      'Correct! She "arrived" and realized she "had left" her passport.',
    hint: "The realization and the leaving happened at different past times.",
  },
  {
    id: 15,
    textParts: ["The sun ", " as they ", " the village."],
    fields: [
      {
        id: 1,
        correctAnswer: "was setting",
        options: [
          { value: "set", label: "set" },
          { value: "was setting", label: "was setting" },
          { value: "had set", label: "had set" },
        ],
      },
      {
        id: 2,
        correctAnswer: "approached",
        options: [
          { value: "approached", label: "approached" },
          { value: "were approaching", label: "were approaching" },
          { value: "had approached", label: "had approached" },
        ],
      },
    ],
    correctMessage: 'Correct! The sun "was setting" as they "approached".',
    hint: "One action provides atmosphere, the other is the main event.",
  },
  {
    id: 18,
    textParts: ["They ", " for 12 hours when they finally ", " the border."],
    fields: [
      {
        id: 1,
        correctAnswer: "had been traveling",
        options: [
          { value: "traveled", label: "traveled" },
          { value: "were traveling", label: "were traveling" },
          { value: "had been traveling", label: "had been traveling" },
        ],
      },
      {
        id: 2,
        correctAnswer: "reached",
        options: [
          { value: "reached", label: "reached" },
          { value: "had reached", label: "had reached" },
          { value: "were reaching", label: "were reaching" },
        ],
      },
    ],
    correctMessage:
      'Correct! They "had been traveling" for 12 hours when they "reached" the border.',
    hint: "Emphasize the long duration before reaching the border.",
  },
];

export default function AdvancedTensesPage() {
  const [answers, setAnswers] = useState<
    Map<number, { answer: string; isCorrect: boolean }>
  >(new Map());
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleAnswerChange = (
    questionId: number,
    answer: string | string[],
    isCorrect: boolean,
  ) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      const answerString = Array.isArray(answer) ? answer.join(",") : answer;
      if (answerString === "" || answer.length === 0) {
        newAnswers.delete(questionId);
      } else {
        newAnswers.set(questionId, { answer: answerString, isCorrect });
      }
      return newAnswers;
    });
  };

  const handleCheckScore = () => {
    setShowScoreModal(true);
  };

  const handleReset = () => {
    setAnswers(new Map());
    setShowScoreModal(false);
    setResetKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalQuestions = simpleQuestions.length + compoundQuestions.length;
  const attemptedCount = answers.size;
  const score = Array.from(answers.values()).filter((a) => a.isCorrect).length;

  // Merge and sort all questions
  const allQuestions = [
    ...simpleQuestions.map((q) => ({ type: "simple" as const, data: q })),
    ...compoundQuestions.map((q) => ({ type: "compound" as const, data: q })),
  ].sort((a, b) => a.data.id - b.data.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Tense Forms - Advanced Level (C1-C2)
          </h1>
          <p className="text-gray-600 text-lg">
            Master complex temporal relationships with sophisticated tense
            usage.
          </p>
        </div>

        {/* Introduction Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Mastering Complex Temporal Relationships
          </h2>
          <p className="text-gray-700 mb-4">
            At the advanced level, understanding tenses goes far beyond simply
            identifying when an action occurs. It involves mastering the subtle
            interplay between different time frames, understanding how tenses
            create narrative cohesion, and using sophisticated temporal
            expressions to convey precise meaning. Advanced tense usage is
            essential for academic writing, professional communication, and
            literary expression.
          </p>
          <p className="text-gray-700">
            This level focuses on complex tense sequences, mixed conditionals,
            narrative tenses, backshifting in reported speech, and the nuanced
            differences between similar tense forms. Mastery of these structures
            allows you to express intricate temporal relationships with
            precision and sophistication.
          </p>
        </section>

        {/* Advanced Structures Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Advanced Tense Structures
          </h2>
          <p className="text-gray-700 mb-3">
            Advanced tense usage encompasses several sophisticated structures:
          </p>
          <ul className="space-y-3 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Mixed Conditionals:</strong> Combining different time
              frames in conditional sentences to express complex hypothetical
              situations. Example:{" "}
              <em>
                If I had studied harder (past), I would be more confident now
                (present).
              </em>
            </li>
            <li>
              <strong>Narrative Tenses:</strong> Using past perfect, past
              perfect continuous, and past simple together to create cohesive
              narratives with multiple time layers. Example:{" "}
              <em>
                She had been waiting for hours when he finally arrived, having
                forgotten about their appointment.
              </em>
            </li>
            <li>
              <strong>Future in the Past:</strong> Expressing future actions
              from a past perspective using "would," "was going to," or "was
              about to." Example:{" "}
              <em>He didn't know that his life was about to change forever.</em>
            </li>
            <li>
              <strong>Tense Sequences in Reported Speech:</strong> Understanding
              backshifting and when to maintain original tenses in indirect
              speech. Example:{" "}
              <em>
                She said she had finished the report (backshift) vs. The teacher
                said that water boils at 100°C (permanent truth).
              </em>
            </li>
            <li>
              <strong>Aspectual Distinctions:</strong> Understanding how perfect
              and continuous aspects interact to create precise meanings.
              Example:{" "}
              <em>
                I have lived here for 10 years (still living) vs. I have been
                living here for 10 years (emphasis on duration/temporary).
              </em>
            </li>
          </ul>
        </section>

        {/* Complex Functions Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Complex Tense Functions and Nuances
          </h2>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-4">
            Mixed Conditionals
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc mb-6">
            <li>
              <strong>Past condition → Present result:</strong> If I had taken
              that job (but I didn't), I would be living in Paris now.
            </li>
            <li>
              <strong>Present condition → Past result:</strong> If I were more
              organized (but I'm not), I wouldn't have missed the deadline.
            </li>
            <li>
              <strong>Past condition → Future result:</strong> If she had
              accepted the offer, she would be starting next week.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-4">
            Narrative Tense Sequences
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc mb-6">
            <li>
              <strong>Past Perfect for earlier background:</strong> She realized
              she had left her phone at home (action before main narrative).
            </li>
            <li>
              <strong>Past Perfect Continuous for duration before past:</strong>{" "}
              They had been traveling for 12 hours when they finally reached the
              border.
            </li>
            <li>
              <strong>Past Simple for main narrative events:</strong> He opened
              the door and walked inside.
            </li>
            <li>
              <strong>Past Continuous for atmosphere/background:</strong> The
              sun was setting as they approached the city.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-4">
            Important Distinctions
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Present Perfect vs. Present Perfect Continuous:</strong>{" "}
              "I have read the book" (completed) vs. "I have been reading the
              book" (ongoing/recently finished with emphasis on activity).
            </li>
            <li>
              <strong>Past Simple vs. Present Perfect:</strong> "I lived in
              Paris for 3 years" (finished period) vs. "I have lived in Paris
              for 3 years" (still living there).
            </li>
          </ul>
        </section>

        {/* Examples Table */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Advanced Tense Usage in Context
          </h2>
          <p className="text-gray-700 mb-4">
            Examine how sophisticated tense structures function in complex
            sentences:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Tense Structure
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Example in Context
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Mixed Conditional
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Past → Present
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    If I <strong>had studied</strong> medicine, I{" "}
                    <strong>would be</strong> a doctor now.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Mixed Conditional
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Present → Past
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    If I <strong>were</strong> more careful, I{" "}
                    <strong>wouldn't have made</strong> that mistake.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Narrative Sequence
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Multiple Past Forms
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    She <strong>had been waiting</strong> for hours when he{" "}
                    <strong>finally arrived</strong>, having{" "}
                    <strong>forgotten</strong> their appointment.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Future in the Past
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    "would" perspective
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Little did he know that his discovery{" "}
                    <strong>would revolutionize</strong> the entire field.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Reported Speech
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    With backshifting
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The CEO announced that the company{" "}
                    <strong>had achieved</strong> record profits and{" "}
                    <strong>would expand</strong> internationally.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Reported Speech
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Permanent truth
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The professor explained that light <strong>travels</strong>{" "}
                    faster than sound.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Questions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">
            Advanced Tense Forms Practice
          </h2>
          <p className="text-gray-700 mb-6">
            Choose the correct tense form to complete each sentence, paying
            close attention to temporal relationships and context.
          </p>

          {/* Progress Indicator */}
          <ProgressIndicator
            attempted={attemptedCount}
            total={totalQuestions}
            score={score}
          />

          {allQuestions.map((q) =>
            q.type === "simple" ? (
              <GrammarQuestionCard
                key={`${q.data.id}-${resetKey}`}
                question={q.data}
                onAnswerChange={handleAnswerChange}
              />
            ) : (
              <CompoundQuestionCard
                key={`${q.data.id}-${resetKey}`}
                question={q.data}
                onAnswerChange={handleAnswerChange}
              />
            ),
          )}
        </section>

        {/* Check Score Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleCheckScore}
            disabled={attemptedCount === 0}
            className="bg-accent-blue-dark hover:bg-accent-blue text-white font-bold text-lg py-4 px-12 rounded-lg transition-all border-2 border-accent-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
            Check Your Score
          </button>
        </div>
      </div>

      {/* Score Modal */}
      <ScoreModal
        isOpen={showScoreModal}
        score={score}
        total={totalQuestions}
        onClose={() => setShowScoreModal(false)}
        onReset={handleReset}
      />
    </div>
  );
}
