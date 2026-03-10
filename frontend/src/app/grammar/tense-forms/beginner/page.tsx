"use client";

import { useState } from "react";
import GrammarQuestionCard, {
  GrammarQuestion,
} from "@/components/grammar/GrammarQuestionCard";
import ProgressIndicator from "@/components/grammar/ProgressIndicator";
import ScoreModal from "@/components/grammar/ScoreModal";

const questions: GrammarQuestion[] = [
  // PRESENT SIMPLE
  {
    id: 1,
    questionText: "I ____ breakfast every morning.",
    correctAnswer: "eat",
    options: [
      { value: "eat", label: "eat" },
      { value: "eats", label: "eats" },
      { value: "eating", label: "eating" },
      { value: "ate", label: "ate" },
    ],
    hint: "Use simple present for daily habits",
  },
  {
    id: 2,
    questionText: "She ____ to school by bus.",
    correctAnswer: "goes",
    options: [
      { value: "go", label: "go" },
      { value: "goes", label: "goes" },
      { value: "going", label: "going" },
      { value: "went", label: "went" },
    ],
    hint: "Add -s for he/she/it in present simple",
  },
  {
    id: 3,
    questionText: "They ____ English and Spanish.",
    correctAnswer: "speak",
    options: [
      { value: "speak", label: "speak" },
      { value: "speaks", label: "speaks" },
      { value: "speaking", label: "speaking" },
      { value: "spoke", label: "spoke" },
    ],
    hint: "Use base form for they/we/I/you",
  },
  {
    id: 4,
    questionText: "He ____ coffee in the morning.",
    correctAnswer: "drinks",
    options: [
      { value: "drink", label: "drink" },
      { value: "drinks", label: "drinks" },
      { value: "drinking", label: "drinking" },
      { value: "drank", label: "drank" },
    ],
    hint: "Present simple routine with he",
  },
  {
    id: 5,
    questionText: "We ____ homework every day.",
    correctAnswer: "do",
    options: [
      { value: "do", label: "do" },
      { value: "does", label: "does" },
      { value: "doing", label: "doing" },
      { value: "did", label: "did" },
    ],
    hint: "Daily activity with we",
  },

  // PAST SIMPLE
  {
    id: 6,
    questionText: "I ____ to the movies yesterday.",
    correctAnswer: "went",
    options: [
      { value: "go", label: "go" },
      { value: "went", label: "went" },
      { value: "will go", label: "will go" },
      { value: "going", label: "going" },
    ],
    hint: "Past time word 'yesterday'",
  },
  {
    id: 7,
    questionText: "She ____ her homework last night.",
    correctAnswer: "finished",
    options: [
      { value: "finish", label: "finish" },
      { value: "finished", label: "finished" },
      { value: "will finish", label: "will finish" },
      { value: "finishing", label: "finishing" },
    ],
    hint: "Completed action in the past",
  },
  {
    id: 8,
    questionText: "They ____ football last weekend.",
    correctAnswer: "played",
    options: [
      { value: "play", label: "play" },
      { value: "plays", label: "plays" },
      { value: "played", label: "played" },
      { value: "will play", label: "will play" },
    ],
    hint: "Past action with 'last weekend'",
  },
  {
    id: 9,
    questionText: "He ____ a letter to his friend.",
    correctAnswer: "wrote",
    options: [
      { value: "write", label: "write" },
      { value: "wrote", label: "wrote" },
      { value: "will write", label: "will write" },
      { value: "writing", label: "writing" },
    ],
    hint: "Irregular past tense verb",
  },
  {
    id: 10,
    questionText: "We ____ TV last weekend.",
    correctAnswer: "watched",
    options: [
      { value: "watch", label: "watch" },
      { value: "watches", label: "watches" },
      { value: "watched", label: "watched" },
      { value: "watching", label: "watching" },
    ],
    hint: "Past time expression 'last weekend'",
  },

  // FUTURE SIMPLE
  {
    id: 11,
    questionText: "I will ____ you tomorrow.",
    correctAnswer: "call",
    options: [
      { value: "call", label: "call" },
      { value: "called", label: "called" },
      { value: "be calling", label: "be calling" },
      { value: "have called", label: "have called" },
    ],
    hint: "'tomorrow' indicates future simple",
  },
  {
    id: 12,
    questionText: "She will ____ to university next year.",
    correctAnswer: "go",
    options: [
      { value: "go", label: "go" },
      { value: "went", label: "went" },
      { value: "be going", label: "be going" },
      { value: "goes", label: "goes" },
    ],
    hint: "Future plan with 'next year'",
  },
  {
    id: 13,
    questionText: "They will ____ the test next week.",
    correctAnswer: "take",
    options: [
      { value: "take", label: "take" },
      { value: "took", label: "took" },
      { value: "be taking", label: "be taking" },
      { value: "takes", label: "takes" },
    ],
    hint: "Future event with specific time",
  },
  {
    id: 14,
    questionText: "He will ____ his car next month.",
    correctAnswer: "buy",
    options: [
      { value: "buy", label: "buy" },
      { value: "bought", label: "bought" },
      { value: "be buying", label: "be buying" },
      { value: "buys", label: "buys" },
    ],
    hint: "Future decision or plan",
  },
  {
    id: 15,
    questionText: "We will ____ English every day.",
    correctAnswer: "practice",
    options: [
      { value: "practice", label: "practice" },
      { value: "practiced", label: "practiced" },
      { value: "be practicing", label: "be practicing" },
      { value: "practices", label: "practices" },
    ],
    hint: "Future promise or intention",
  },

  // PRESENT CONTINUOUS
  {
    id: 16,
    questionText: "I ____ lunch right now.",
    correctAnswer: "am eating",
    options: [
      { value: "eat", label: "eat" },
      { value: "ate", label: "ate" },
      { value: "am eating", label: "am eating" },
      { value: "will eat", label: "will eat" },
    ],
    hint: "'right now' = action happening at this moment",
  },
  {
    id: 17,
    questionText: "She ____ to music at the moment.",
    correctAnswer: "is listening",
    options: [
      { value: "listen", label: "listen" },
      { value: "listened", label: "listened" },
      { value: "is listening", label: "is listening" },
      { value: "will listen", label: "will listen" },
    ],
    hint: "'at the moment' indicates present continuous",
  },
  {
    id: 18,
    questionText: "They ____ basketball now.",
    correctAnswer: "are playing",
    options: [
      { value: "play", label: "play" },
      { value: "played", label: "played" },
      { value: "are playing", label: "are playing" },
      { value: "will play", label: "will play" },
    ],
    hint: "Action in progress now",
  },

  // PAST CONTINUOUS
  {
    id: 19,
    questionText: "I ____ when you called me.",
    correctAnswer: "was sleeping",
    options: [
      { value: "sleep", label: "sleep" },
      { value: "slept", label: "slept" },
      { value: "was sleeping", label: "was sleeping" },
      { value: "will sleep", label: "will sleep" },
    ],
    hint: "Action in progress when another action happened",
  },
  {
    id: 20,
    questionText: "They ____ dinner when I arrived.",
    correctAnswer: "were eating",
    options: [
      { value: "eat", label: "eat" },
      { value: "ate", label: "ate" },
      { value: "were eating", label: "were eating" },
      { value: "will eat", label: "will eat" },
    ],
    hint: "Background action when something else occurred",
  },
];

export default function BeginnerTensesPage() {
  const [answers, setAnswers] = useState<
    Map<number, { answer: string; isCorrect: boolean }>
  >(new Map());
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleAnswerChange = (
    questionId: number,
    answer: string,
    isCorrect: boolean,
  ) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      if (answer === "") {
        newAnswers.delete(questionId);
      } else {
        newAnswers.set(questionId, { answer, isCorrect });
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

  const attemptedCount = answers.size;
  const score = Array.from(answers.values()).filter((a) => a.isCorrect).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Tense Forms - Beginner Level (A1-A2)
          </h1>
          <p className="text-gray-600 text-lg">
            Choose the correct tense form to complete each sentence.
          </p>
        </div>

        {/* Introduction Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            What are Tenses?
          </h2>
          <p className="text-gray-700 mb-4">
            Tenses tell us <strong>when</strong> something happens. In English,
            we use different verb forms to show if something happened in the
            past, is happening now, or will happen in the future. Understanding
            tenses helps you talk about time correctly.
          </p>
        </section>

        {/* Types Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Types of Tenses (Beginner Level)
          </h2>
          <p className="text-gray-700 mb-3">
            At the beginner level, we focus on five important tenses:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Present Simple:</strong> For habits, facts, and routines.
              Example: <em>I eat breakfast every day.</em>
            </li>
            <li>
              <strong>Past Simple:</strong> For completed actions in the past.
              Example: <em>I walked to school yesterday.</em>
            </li>
            <li>
              <strong>Future Simple:</strong> For predictions, decisions, and
              plans. Example: <em>I will study tomorrow.</em>
            </li>
            <li>
              <strong>Present Continuous:</strong> For actions happening right
              now. Example: <em>I am eating lunch.</em>
            </li>
            <li>
              <strong>Past Continuous:</strong> For actions that were in
              progress in the past. Example:{" "}
              <em>I was sleeping when you called.</em>
            </li>
          </ul>
        </section>

        {/* How They Work Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            How Do Tenses Work?
          </h2>
          <p className="text-gray-700 mb-4">
            Each tense has a specific structure and use. Let's look at how they
            work:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Present Simple:</strong> Use the base form of the verb
              (add -s/-es for he/she/it). <em>Example: He works every day.</em>
            </li>
            <li>
              <strong>Past Simple:</strong> Use the past form of the verb
              (usually add -ed, but many verbs are irregular).{" "}
              <em>Example: She played tennis yesterday.</em>
            </li>
            <li>
              <strong>Future Simple:</strong> Use "will" + base form of the
              verb. <em>Example: They will arrive tomorrow.</em>
            </li>
            <li>
              <strong>Present Continuous:</strong> Use am/is/are + verb-ing.{" "}
              <em>Example: I am reading a book now.</em>
            </li>
            <li>
              <strong>Past Continuous:</strong> Use was/were + verb-ing.{" "}
              <em>Example: We were watching TV at 8 PM.</em>
            </li>
          </ul>
        </section>

        {/* Examples Table */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Tense Forms with Examples
          </h2>
          <p className="text-gray-700 mb-4">
            Here are examples of each tense to help you understand when to use
            them:
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
                    Present Simple
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Daily routines, habits, facts
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    I <strong>drink</strong> coffee every morning.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Present Simple
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    General truths
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The sun <strong>rises</strong> in the east.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Past Simple
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Completed actions in the past
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    She <strong>visited</strong> Paris last year.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Past Simple
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Past events with specific time
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    They <strong>played</strong> football yesterday.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Future Simple
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Predictions about the future
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    It <strong>will rain</strong> tomorrow.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Future Simple
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Decisions made at the moment
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    I <strong>will help</strong> you with that.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Present Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Actions happening right now
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    I <strong>am studying</strong> English now.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Present Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Temporary situations
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    She <strong>is living</strong> in London this month.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Past Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Actions in progress at a past time
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    We <strong>were eating</strong> dinner at 7 PM.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Past Continuous
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Background action when something else happened
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    I <strong>was reading</strong> when the phone rang.
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
            total={questions.length}
            score={score}
          />

          {questions.map((question) => (
            <GrammarQuestionCard
              key={`${question.id}-${resetKey}`}
              question={question}
              onAnswerChange={handleAnswerChange}
            />
          ))}
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
        total={questions.length}
        onClose={() => setShowScoreModal(false)}
        onReset={handleReset}
      />
    </div>
  );
}
