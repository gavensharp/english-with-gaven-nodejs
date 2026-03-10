"use client";

import { useState } from "react";
import { Metadata } from "next";
import GrammarQuestionCard, {
  GrammarQuestion,
} from "@/components/grammar/GrammarQuestionCard";
import CompoundQuestionCard, {
  CompoundQuestion,
} from "@/components/grammar/CompoundQuestionCard";
import ProgressIndicator from "@/components/grammar/ProgressIndicator";
import ScoreModal from "@/components/grammar/ScoreModal";

const questions: GrammarQuestion[] = [
  {
    id: 1,
    questionText:
      "The research findings were presented ____ academic standards.",
    correctAnswer: "in accordance with",
    options: [
      { value: "in accordance with", label: "in accordance with" },
      { value: "according to", label: "according to" },
      { value: "in agreement to", label: "in agreement to" },
    ],
    hint: "This formal phrasal preposition means following rules or standards.",
  },
  {
    id: 2,
    questionText:
      "The committee insisted ____ implementing the new policy immediately.",
    correctAnswer: "on",
    options: [
      { value: "on", label: "on" },
      { value: "for", label: "for" },
      { value: "at", label: "at" },
    ],
    hint: "This verb-preposition pair means to demand firmly.",
  },
  {
    id: 4,
    questionText:
      "The project's success depends ____ securing adequate funding.",
    correctAnswer: "on",
    options: [
      { value: "on", label: "on" },
      { value: "from", label: "from" },
      { value: "with", label: "with" },
    ],
    hint: "This preposition is used with 'depend' to show reliance.",
  },
  {
    id: 5,
    questionText: "____ the financial crisis, many regulations were reformed.",
    correctAnswer: "In the wake of",
    options: [
      { value: "In the wake of", label: "In the wake of" },
      { value: "Because of", label: "Because of" },
      { value: "After to", label: "After to" },
    ],
    hint: "This complex phrase means following as a consequence or aftermath.",
  },
  {
    id: 6,
    questionText:
      "She is highly capable ____ managing complex projects under pressure.",
    correctAnswer: "of",
    options: [
      { value: "of", label: "of" },
      { value: "to", label: "to" },
      { value: "for", label: "for" },
    ],
    hint: "This adjective-preposition collocation shows ability.",
  },
  {
    id: 7,
    questionText: "The meeting was postponed ____ unforeseen circumstances.",
    correctAnswer: "due to",
    options: [
      { value: "due to", label: "due to" },
      { value: "because", label: "because" },
      { value: "owing", label: "owing" },
    ],
    hint: "This compound preposition means caused by or attributable to.",
  },
  {
    id: 8,
    questionText: "The decision was made ____ the board of directors.",
    correctAnswer: "at the behest of",
    options: [
      { value: "at the behest of", label: "at the behest of" },
      { value: "by the request of", label: "by the request of" },
      { value: "on the demand of", label: "on the demand of" },
    ],
    hint: "This formal phrase means at the request or command of someone.",
  },
  {
    id: 10,
    questionText:
      "The company succeeded ____ its innovative approach to marketing.",
    correctAnswer: "by virtue of",
    options: [
      { value: "by virtue of", label: "by virtue of" },
      { value: "because of", label: "because of" },
      { value: "due to", label: "due to" },
    ],
    hint: "This phrasal preposition means because of or as a result of a particular quality.",
  },
  {
    id: 11,
    questionText:
      "The scientist must account ____ any discrepancies in the data.",
    correctAnswer: "for",
    options: [
      { value: "for", label: "for" },
      { value: "to", label: "to" },
      { value: "of", label: "of" },
    ],
    hint: "This verb-preposition pair means to explain or provide a reason.",
  },
  {
    id: 12,
    questionText: "____ the criticism, she remained committed to her vision.",
    correctAnswer: "In spite of",
    options: [
      { value: "In spite of", label: "In spite of" },
      { value: "Despite of", label: "Despite of" },
      { value: "Although", label: "Although" },
    ],
    hint: "This phrasal preposition means despite and introduces a contrast.",
  },
  {
    id: 13,
    questionText:
      "The policy was implemented ____ a comprehensive training program.",
    correctAnswer: "by means of",
    options: [
      { value: "by means of", label: "by means of" },
      { value: "through of", label: "through of" },
      { value: "by way", label: "by way" },
    ],
    hint: "This phrasal preposition means through the use of or by using a particular method.",
  },
  {
    id: 14,
    questionText:
      "We had everyone present ____ the chairman, who was traveling abroad.",
    correctAnswer: "except for",
    options: [
      { value: "except for", label: "except for" },
      { value: "besides", label: "besides" },
      { value: "apart", label: "apart" },
    ],
    hint: "This compound preposition means apart from or with the exception of.",
  },
  {
    id: 16,
    questionText:
      "The team was ____ a major breakthrough when funding was cut.",
    correctAnswer: "on the verge of",
    options: [
      { value: "on the verge of", label: "on the verge of" },
      { value: "at the edge of", label: "at the edge of" },
      { value: "in the brink of", label: "in the brink of" },
    ],
    hint: "This complex phrase means very close to or about to.",
  },
  {
    id: 17,
    questionText:
      "The researchers are seeking a solution ____ the environmental crisis.",
    correctAnswer: "to",
    options: [
      { value: "to", label: "to" },
      { value: "for", label: "for" },
      { value: "of", label: "of" },
    ],
    hint: "This noun-preposition collocation is fixed with 'solution'.",
  },
  {
    id: 18,
    questionText: "The expansion was pursued ____ employee satisfaction.",
    correctAnswer: "at the expense of",
    options: [
      { value: "at the expense of", label: "at the expense of" },
      { value: "at the cost for", label: "at the cost for" },
      { value: "with the price of", label: "with the price of" },
    ],
    hint: "This complex phrase means at the cost or sacrifice of something else.",
  },
  {
    id: 20,
    questionText:
      "____ maintaining neutrality, the mediator refrained from expressing personal opinions.",
    correctAnswer: "For the sake of",
    options: [
      { value: "For the sake of", label: "For the sake of" },
      { value: "In order of", label: "In order of" },
      { value: "With the purpose", label: "With the purpose" },
    ],
    hint: "This complex phrase means for the purpose of or in order to achieve.",
  },
];

const compoundQuestions: CompoundQuestion[] = [
  {
    id: 3,
    textParts: [
      "The ambassador spoke ",
      " the government ",
      " the new treaty.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "on behalf of",
        options: [
          { value: "on behalf of", label: "on behalf of" },
          { value: "in place of", label: "in place of" },
          { value: "instead of", label: "instead of" },
        ],
      },
      {
        id: 2,
        correctAnswer: "with regard to",
        options: [
          { value: "with regard to", label: "with regard to" },
          { value: "concerning about", label: "concerning about" },
          { value: "about to", label: "about to" },
        ],
      },
    ],
    correctMessage:
      'Correct! The ambassador spoke "on behalf of" the government "with regard to" the treaty.',
    hint: "Think about formal diplomatic language for representing and concerning.",
  },
  {
    id: 9,
    textParts: [
      "The delegates participated ",
      " the conference and objected ",
      " several proposals.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "in",
        options: [
          { value: "in", label: "in" },
          { value: "at", label: "at" },
          { value: "on", label: "on" },
        ],
      },
      {
        id: 2,
        correctAnswer: "to",
        options: [
          { value: "to", label: "to" },
          { value: "for", label: "for" },
          { value: "on", label: "on" },
        ],
      },
    ],
    correctMessage:
      'Correct! They participated "in" the conference and objected "to" the proposal.',
    hint: "Think about standard verb-preposition collocations.",
  },
  {
    id: 15,
    textParts: [
      "She apologized ",
      " the delay and waited ",
      " their response.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "for",
        options: [
          { value: "for", label: "for" },
          { value: "about", label: "about" },
          { value: "to", label: "to" },
        ],
      },
      {
        id: 2,
        correctAnswer: "for",
        options: [
          { value: "for", label: "for" },
          { value: "to", label: "to" },
          { value: "on", label: "on" },
        ],
      },
    ],
    correctMessage:
      'Correct! She apologized "for" the delay and waited "for" their response.',
    hint: "Both verbs use the same preposition.",
  },
  {
    id: 19,
    textParts: [
      "She is responsible ",
      " the budget and aware ",
      " all financial constraints.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "for",
        options: [
          { value: "for", label: "for" },
          { value: "of", label: "of" },
          { value: "to", label: "to" },
        ],
      },
      {
        id: 2,
        correctAnswer: "of",
        options: [
          { value: "of", label: "of" },
          { value: "about", label: "about" },
          { value: "to", label: "to" },
        ],
      },
    ],
    correctMessage:
      'Correct! She is responsible "for" the budget and aware "of" the constraints.',
    hint: "Think about adjective-preposition collocations.",
  },
];

export default function AdvancedPrepositionsPage() {
  const [answers, setAnswers] = useState<
    Map<number, { answer: string; isCorrect: boolean }>
  >(new Map());
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Combine and sort all questions by ID for sequential display
  const allQuestions = [
    ...questions.map((q) => ({ ...q, type: "regular" as const })),
    ...compoundQuestions.map((q) => ({ ...q, type: "compound" as const })),
  ].sort((a, b) => a.id - b.id);

  const handleAnswerChange = (
    questionId: number,
    answer: string | string[],
    isCorrect: boolean,
  ) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      // For compound questions, answer can be an empty array
      if (answer === "" || (Array.isArray(answer) && answer.length === 0)) {
        newAnswers.delete(questionId);
      } else {
        const answerStr = Array.isArray(answer) ? answer.join(", ") : answer;
        newAnswers.set(questionId, { answer: answerStr, isCorrect });
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
            Prepositions - Advanced Level (C1-C2)
          </h1>
          <p className="text-gray-600 text-lg">
            Master advanced English prepositions with 20 interactive exercises.
          </p>
        </div>

        {/* Introduction Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            A Deeper Understanding of Prepositions
          </h2>
          <p className="text-gray-700 mb-4">
            A deeper understanding of prepositions encompasses not just their
            basic definitions but also an exploration of how they function to
            connect ideas in a sentence. This means analyzing their roles in
            indicating relationships of time, place, direction, and more, and
            understanding subtle differences in usage that can change the
            meaning of a sentence. By delving into these nuances, learners can
            improve their writing and communication skills, crafting more
            precise and engaging language.
          </p>
          <p className="text-gray-700">
            At the advanced level, mastering prepositions involves understanding
            idiomatic expressions, recognizing collocations, and applying
            prepositions accurately in complex grammatical structures. This
            knowledge is essential for achieving fluency and sophistication in
            both written and spoken English.
          </p>
        </section>

        {/* Advanced Prepositional Structures */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Advanced Prepositional Structures
          </h2>
          <p className="text-gray-700 mb-4">
            Prepositions can serve a variety of complex functions in a sentence.
            Here are some of the key advanced structures:
          </p>
          <ul className="space-y-3 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Verb-Preposition Pairs (Prepositional Verbs):</strong>{" "}
              Verbs that require specific prepositions to convey their intended
              meaning. The preposition is essential to the verb's meaning.
              Examples:{" "}
              <em>
                rely on, participate in, insist on, account for, apologize for,
                care for, depend on, object to, wait for
              </em>
              .
            </li>
            <li>
              <strong>Phrasal Prepositions:</strong> Multi-word expressions that
              function as a single preposition, often adding nuance or
              formality. Examples:{" "}
              <em>
                in spite of, out of spite, in accordance with, by means of, on
                behalf of, with regard to, in lieu of, by virtue of
              </em>
              .
            </li>
            <li>
              <strong>Compound Prepositions:</strong> Prepositions made up of
              two or more words acting as a single unit to express complex
              relationships. Examples:{" "}
              <em>
                because of, due to, except for, instead of, apart from, aside
                from, according to, as for
              </em>
              .
            </li>
            <li>
              <strong>Complex Prepositional Phrases:</strong> Extended phrases
              where the preposition combines with modifiers and objects to
              create sophisticated expressions. Examples:{" "}
              <em>
                in the wake of, in front of, on top of, at the behest of, in the
                midst of, for the sake of, at the expense of, on the verge of
              </em>
              .
            </li>
            <li>
              <strong>Adjective-Preposition Collocations:</strong> Fixed
              combinations of adjectives with specific prepositions. Examples:{" "}
              <em>
                fond of, keen on, aware of, capable of, responsible for,
                satisfied with, familiar with, interested in
              </em>
              .
            </li>
            <li>
              <strong>Noun-Preposition Collocations:</strong> Fixed combinations
              of nouns with specific prepositions. Examples:{" "}
              <em>
                effect on, impact on, influence on, access to, approach to,
                reaction to, solution to, answer to
              </em>
              .
            </li>
          </ul>
        </section>

        {/* Prepositional Functions and Nuances */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Prepositional Functions and Nuances
          </h2>
          <p className="text-gray-700 mb-4">
            Let's explore the advanced functions and subtle distinctions in
            prepositional usage:
          </p>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Verb-Preposition Pairs
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>rely on:</strong> To depend on or trust someone/something
              (cannot use *rely for/at).
            </li>
            <li>
              <strong>participate in:</strong> To take part in an activity (not
              *participate at/on).
            </li>
            <li>
              <strong>insist on:</strong> To demand firmly or refuse to change
              one's opinion about something.
            </li>
            <li>
              <strong>account for:</strong> To explain or provide a reason for
              something.
            </li>
            <li>
              <strong>apologize for:</strong> To express regret for an action or
              mistake.
            </li>
            <li>
              <strong>object to:</strong> To express disagreement or opposition
              to something.
            </li>
            <li>
              <strong>wait for:</strong> To remain in a place until
              someone/something arrives.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Phrasal Prepositions
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>in spite of:</strong> Despite; used to introduce a
              contrast (more formal than "despite").
            </li>
            <li>
              <strong>out of spite:</strong> Motivated by malice or desire to
              hurt someone.
            </li>
            <li>
              <strong>in accordance with:</strong> In agreement with; following
              a rule or standard.
            </li>
            <li>
              <strong>by means of:</strong> Through the use of; by using a
              particular method.
            </li>
            <li>
              <strong>on behalf of:</strong> As a representative of; in the
              interests of someone.
            </li>
            <li>
              <strong>with regard to:</strong> Concerning; about (formal usage).
            </li>
            <li>
              <strong>in lieu of:</strong> Instead of; as a substitute for.
            </li>
            <li>
              <strong>by virtue of:</strong> Because of; as a result of a
              particular quality or position.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Compound Prepositions
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>because of:</strong> For the reason that; introduces
              cause.
            </li>
            <li>
              <strong>due to:</strong> Caused by; attributable to (often follows
              "be").
            </li>
            <li>
              <strong>except for:</strong> Apart from; with the exception of.
            </li>
            <li>
              <strong>instead of:</strong> As an alternative to; in place of.
            </li>
            <li>
              <strong>apart from:</strong> In addition to; except for (can have
              both meanings depending on context).
            </li>
            <li>
              <strong>according to:</strong> As stated by; in agreement with.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Complex Prepositional Phrases
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>in the wake of:</strong> Following as a consequence; in
              the aftermath of.
            </li>
            <li>
              <strong>at the behest of:</strong> At the request or command of
              someone.
            </li>
            <li>
              <strong>in the midst of:</strong> In the middle of; during.
            </li>
            <li>
              <strong>for the sake of:</strong> For the purpose of; in order to
              achieve.
            </li>
            <li>
              <strong>at the expense of:</strong> At the cost or sacrifice of
              something else.
            </li>
            <li>
              <strong>on the verge of:</strong> Very close to; about to.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Important Distinctions
          </h3>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>"on time" vs "in time":</strong> "On time" means
              punctual/at the scheduled time; "in time" means with time to
              spare/before it's too late.
            </li>
            <li>
              <strong>"at the end" vs "in the end":</strong> "At the end" refers
              to a physical location or specific point; "in the end" means
              finally or ultimately.
            </li>
            <li>
              <strong>"made of" vs "made from":</strong> "Made of" shows
              material that hasn't changed form; "made from" shows material that
              has been transformed.
            </li>
            <li>
              <strong>"bored with" vs "bored of":</strong> "Bored with" is
              standard; "bored of" is informal British English.
            </li>
          </ul>
        </section>

        {/* Usage in Context Table */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Advanced Prepositional Usage in Context
          </h2>
          <p className="text-gray-700 mb-4">
            Examine how sophisticated prepositional structures function in
            complex sentences:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    Prepositional Structure
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    Example in Context
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">rely on</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Verb-Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    The success of the project <strong>relies on</strong> the
                    collaboration of all departments.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    in spite of
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Phrasal Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong>In spite of</strong> the economic downturn, the
                    company managed to increase its profits.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    by virtue of
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Phrasal Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    She was granted access <strong>by virtue of</strong> her
                    position as director.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    in the wake of
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Complex Phrase
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong>In the wake of</strong> the scandal, the CEO
                    resigned from his position.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    at the behest of
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Complex Phrase
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    The investigation was launched{" "}
                    <strong>at the behest of</strong> shareholders.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    capable of
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Adjective-Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    The new technology is <strong>capable of</strong> processing
                    vast amounts of data.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    solution to
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Noun-Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Researchers are seeking a <strong>solution to</strong> the
                    climate crisis.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    account for
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Verb-Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    These expenses <strong>account for</strong> nearly half of
                    the annual budget.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    with regard to
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Phrasal Preposition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong>With regard to</strong> your inquiry, we will
                    respond within five business days.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    on the verge of
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Complex Phrase
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    The company was <strong>on the verge of</strong> bankruptcy
                    before the merger.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Practice Section */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary-dark mb-2">
              Advanced Prepositions Practice
            </h2>
            <p className="text-gray-600">
              Choose the correct preposition or prepositional phrase to complete
              each sentence.
            </p>
          </div>

          <ProgressIndicator
            attempted={attemptedCount}
            total={questions.length + compoundQuestions.length}
            score={score}
          />

          {/* Questions */}
          {allQuestions.map((question) =>
            question.type === "regular" ? (
              <GrammarQuestionCard
                key={`${resetKey}-${question.id}`}
                question={question as GrammarQuestion}
                onAnswerChange={handleAnswerChange}
              />
            ) : (
              <CompoundQuestionCard
                key={`${resetKey}-${question.id}`}
                question={question as CompoundQuestion}
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
        total={questions.length + compoundQuestions.length}
        onClose={() => setShowScoreModal(false)}
        onReset={handleReset}
      />
    </div>
  );
}
