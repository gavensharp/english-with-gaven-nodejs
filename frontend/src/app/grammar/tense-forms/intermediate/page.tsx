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
    questionText: "I ____ in this city for ten years.",
    correctAnswer: "have lived",
    options: [
      { value: "live", label: "live" },
      { value: "lived", label: "lived" },
      { value: "have lived", label: "have lived" },
      { value: "am living", label: "am living" },
    ],
    hint: "Present perfect shows connection between past and present",
  },
  {
    id: 2,
    questionText: "She ____ English since she was a child.",
    correctAnswer: "has been studying",
    options: [
      { value: "studies", label: "studies" },
      { value: "studied", label: "studied" },
      { value: "has studied", label: "has studied" },
      { value: "has been studying", label: "has been studying" },
    ],
    hint: "Use present perfect continuous to emphasize duration",
  },
  {
    id: 4,
    questionText: "By next month, I ____ this project.",
    correctAnswer: "will have finished",
    options: [
      { value: "finish", label: "finish" },
      { value: "will finish", label: "will finish" },
      { value: "will have finished", label: "will have finished" },
      { value: "have finished", label: "have finished" },
    ],
    hint: "Future perfect shows completion before a future time",
  },
  {
    id: 5,
    questionText: "They ____ for two hours.",
    correctAnswer: "have been waiting",
    options: [
      { value: "wait", label: "wait" },
      { value: "waited", label: "waited" },
      { value: "are waiting", label: "are waiting" },
      { value: "have been waiting", label: "have been waiting" },
    ],
    hint: "Use present perfect continuous for duration up to now",
  },
  {
    id: 6,
    questionText: "She ____ there for five years when she got promoted.",
    correctAnswer: "had been working",
    options: [
      { value: "worked", label: "worked" },
      { value: "was working", label: "was working" },
      { value: "had been working", label: "had been working" },
      { value: "has been working", label: "has been working" },
    ],
    hint: "Past perfect continuous shows duration before a past moment",
  },
  {
    id: 7,
    questionText: "This time tomorrow, I ____ to Paris.",
    correctAnswer: "will be flying",
    options: [
      { value: "fly", label: "fly" },
      { value: "will fly", label: "will fly" },
      { value: "will be flying", label: "will be flying" },
      { value: "am flying", label: "am flying" },
    ],
    hint: "Future continuous shows action in progress at a specific future time",
  },
  {
    id: 8,
    questionText: "I ____ such a beautiful sunset before.",
    correctAnswer: "have never seen",
    options: [
      { value: "never see", label: "never see" },
      { value: "never saw", label: "never saw" },
      { value: "have never seen", label: "have never seen" },
      { value: "had never seen", label: "had never seen" },
    ],
    hint: "Use present perfect for life experiences",
  },
  {
    id: 10,
    questionText: "By 2030, scientists ____ a cure for many diseases.",
    correctAnswer: "will have discovered",
    options: [
      { value: "discover", label: "discover" },
      { value: "will discover", label: "will discover" },
      { value: "will have discovered", label: "will have discovered" },
      { value: "have discovered", label: "have discovered" },
    ],
    hint: "Future perfect for completion before a future time",
  },
  {
    id: 11,
    questionText: "The ground was wet because it ____ all night.",
    correctAnswer: "had been raining",
    options: [
      { value: "rained", label: "rained" },
      { value: "was raining", label: "was raining" },
      { value: "had rained", label: "had rained" },
      { value: "had been raining", label: "had been raining" },
    ],
    hint: "Past perfect continuous shows the cause of a past situation",
  },
  {
    id: 12,
    questionText: "She has ____ her exam.",
    correctAnswer: "just finished",
    options: [
      { value: "just finished", label: "just finished" },
      { value: "finished", label: "finished" },
      { value: "been finishing", label: "been finishing" },
      { value: "finishes", label: "finishes" },
    ],
    hint: "Use present perfect with 'just' for very recent actions",
  },
  {
    id: 14,
    questionText: "He said he ____ that movie before.",
    correctAnswer: "had seen",
    options: [
      { value: "saw", label: "saw" },
      { value: "has seen", label: "has seen" },
      { value: "had seen", label: "had seen" },
      { value: "sees", label: "sees" },
    ],
    hint: "Use past perfect in reported speech for actions before the reporting",
  },
  {
    id: 15,
    questionText: "We ____ in this apartment since January.",
    correctAnswer: "have been living",
    options: [
      { value: "live", label: "live" },
      { value: "lived", label: "lived" },
      { value: "are living", label: "are living" },
      { value: "have been living", label: "have been living" },
    ],
    hint: "Use present perfect continuous with 'since' for duration",
  },
  {
    id: 17,
    questionText: "You look exhausted. What have you been ____ ?",
    correctAnswer: "doing",
    options: [
      { value: "doing", label: "doing" },
      { value: "done", label: "done" },
      { value: "do", label: "do" },
      { value: "did", label: "did" },
    ],
    hint: "Use present perfect continuous to ask about recent activity with visible results",
  },
  {
    id: 18,
    questionText: "By next summer, we ____ English for three years.",
    correctAnswer: "will have been studying",
    options: [
      { value: "will study", label: "will study" },
      { value: "will be studying", label: "will be studying" },
      { value: "will have studied", label: "will have studied" },
      { value: "will have been studying", label: "will have been studying" },
    ],
    hint: "Future perfect continuous shows duration up to a future point",
  },
  {
    id: 20,
    questionText: "I have ____ this book twice.",
    correctAnswer: "already read",
    options: [
      { value: "already read", label: "already read" },
      { value: "read", label: "read" },
      { value: "been reading", label: "been reading" },
      { value: "reads", label: "reads" },
    ],
    hint: "Use present perfect with 'already' for completed actions with present relevance",
  },
];

const compoundQuestions: CompoundQuestion[] = [
  {
    id: 3,
    textParts: ["The train ", " before we ", " at the station."],
    fields: [
      {
        id: 1,
        correctAnswer: "had left",
        options: [
          { value: "left", label: "left" },
          { value: "had left", label: "had left" },
          { value: "has left", label: "has left" },
        ],
      },
      {
        id: 2,
        correctAnswer: "arrived",
        options: [
          { value: "arrive", label: "arrive" },
          { value: "arrived", label: "arrived" },
          { value: "had arrived", label: "had arrived" },
        ],
      },
    ],
    correctMessage: 'Correct! The train "had left" before we "arrived".',
    hint: "Which action happened first in the past? Use past perfect for the earlier action.",
  },
  {
    id: 9,
    textParts: ["When I ", " at the party, she ", "."],
    fields: [
      {
        id: 1,
        correctAnswer: "arrived",
        options: [
          { value: "arrive", label: "arrive" },
          { value: "arrived", label: "arrived" },
          { value: "had arrived", label: "had arrived" },
        ],
      },
      {
        id: 2,
        correctAnswer: "had already left",
        options: [
          { value: "already left", label: "already left" },
          { value: "has already left", label: "has already left" },
          { value: "had already left", label: "had already left" },
        ],
      },
    ],
    correctMessage: 'Correct! When I "arrived", she "had already left".',
    hint: "She left before my arrival - which tense shows earlier past action?",
  },
  {
    id: 13,
    textParts: ["Next year, they ", " married ", " 25 years."],
    fields: [
      {
        id: 1,
        correctAnswer: "will have been",
        options: [
          { value: "will be", label: "will be" },
          { value: "have been", label: "have been" },
          { value: "will have been", label: "will have been" },
        ],
      },
      {
        id: 2,
        correctAnswer: "for",
        options: [
          { value: "for", label: "for" },
          { value: "since", label: "since" },
          { value: "in", label: "in" },
        ],
      },
    ],
    correctMessage:
      'Correct! Next year, they "will have been" married "for" 25 years.',
    hint: "Duration up to a future point requires future perfect continuous.",
  },
  {
    id: 16,
    textParts: ["By the time you ", ", I ", " cooking dinner."],
    fields: [
      {
        id: 1,
        correctAnswer: "arrive",
        options: [
          { value: "arrive", label: "arrive" },
          { value: "will arrive", label: "will arrive" },
          { value: "arrived", label: "arrived" },
        ],
      },
      {
        id: 2,
        correctAnswer: "will have finished",
        options: [
          { value: "will finish", label: "will finish" },
          { value: "will have finished", label: "will have finished" },
          { value: "finish", label: "finish" },
        ],
      },
    ],
    correctMessage:
      'Correct! By the time you "arrive", I "will have finished" cooking.',
    hint: "The cooking will be complete before the arrival.",
  },
  {
    id: 19,
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
          { value: "crashes", label: "crashes" },
          { value: "crashed", label: "crashed" },
          { value: "had crashed", label: "had crashed" },
        ],
      },
    ],
    correctMessage:
      'Correct! She "had been working" on the project when the computer "crashed".',
    hint: "She was in the middle of working when the crash happened.",
  },
];

export default function IntermediateTensesPage() {
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
            Tense Forms - Intermediate Level (B1-B2)
          </h1>
          <p className="text-gray-600 text-lg">
            Choose the correct tense form to complete each sentence.
          </p>
        </div>

        {/* Introduction Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            What are Perfect and Continuous Tenses?
          </h2>
          <p className="text-gray-700 mb-4">
            At the intermediate level, we expand our understanding of tenses to
            include Perfect and Continuous forms. These tenses help us express
            more complex time relationships, show actions in progress, and
            connect past events to the present. Mastering these forms will make
            your English more natural and precise.
          </p>
        </section>

        {/* Types Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Types of Intermediate Tenses
          </h2>
          <p className="text-gray-700 mb-3">
            Below are the tense forms covered at the intermediate level:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Present Perfect:</strong> have/has + past participle -
              connects past to present
            </li>
            <li>
              <strong>Present Perfect Continuous:</strong> have/has been +
              verb-ing - shows duration up to now
            </li>
            <li>
              <strong>Past Perfect:</strong> had + past participle - shows which
              past action happened first
            </li>
            <li>
              <strong>Past Perfect Continuous:</strong> had been + verb-ing -
              shows duration before a past moment
            </li>
            <li>
              <strong>Future Perfect:</strong> will have + past participle -
              shows completion before a future time
            </li>
            <li>
              <strong>Future Perfect Continuous:</strong> will have been +
              verb-ing - shows duration up to a future point
            </li>
            <li>
              <strong>Future Continuous:</strong> will be + verb-ing - shows
              action in progress at a future time
            </li>
          </ul>
        </section>

        {/* How They Work Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            How Do These Tenses Work?
          </h2>
          <p className="text-gray-700 mb-4">
            Each intermediate tense has specific uses and structures:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Present Perfect:</strong> Use for experiences, recent
              actions, or unfinished time periods.{" "}
              <em>Example: I have visited Paris three times.</em>
            </li>
            <li>
              <strong>Present Perfect Continuous:</strong> Use to emphasize the
              duration of an action from the past until now.{" "}
              <em>Example: I have been studying English for five years.</em>
            </li>
            <li>
              <strong>Past Perfect:</strong> Use to show which of two past
              actions happened first.{" "}
              <em>Example: She had left before I arrived.</em>
            </li>
            <li>
              <strong>Past Perfect Continuous:</strong> Use to show an action
              was in progress before another past action.{" "}
              <em>
                Example: He had been working there for ten years when he
                retired.
              </em>
            </li>
            <li>
              <strong>Future Perfect:</strong> Use to show an action will be
              completed before a specific future time.{" "}
              <em>Example: By next month, I will have finished this course.</em>
            </li>
            <li>
              <strong>Future Perfect Continuous:</strong> Use to show duration
              of an action up to a future point.{" "}
              <em>
                Example: By 2025, they will have been living here for 20 years.
              </em>
            </li>
            <li>
              <strong>Future Continuous:</strong> Use to show an action in
              progress at a specific future time.{" "}
              <em>Example: This time tomorrow, I will be flying to Tokyo.</em>
            </li>
          </ul>
        </section>

        {/* Examples Table */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Intermediate Tense Forms with Examples
          </h2>
          <p className="text-gray-700 mb-4">
            Here are examples showing how these tenses function in context:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Tense
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    When to Use
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Present Perfect
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Life experiences
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    I <strong>have traveled</strong> to fifteen countries.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Present Perfect
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Recent actions with present relevance
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    She <strong>has just finished</strong> her homework.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Present Perfect Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Duration from past to present
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    They <strong>have been waiting</strong> for two hours.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Past Perfect
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Earlier past action before another
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The train <strong>had left</strong> before we arrived.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Past Perfect Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Duration before a past moment
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    She <strong>had been studying</strong> for hours when I
                    called.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Future Perfect
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Completion before future time
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    By June, I <strong>will have graduated</strong> from
                    university.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Future Perfect Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Duration up to future point
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Next year, we{" "}
                    <strong>will have been working together</strong> for a
                    decade.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Future Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Action in progress at future time
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    This time next week, I <strong>will be relaxing</strong> on
                    the beach.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Questions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">
            Tense Forms Practice
          </h2>
          <p className="text-gray-700 mb-6">
            Now it's time to practice! Choose the correct tense form to complete
            each sentence.
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
