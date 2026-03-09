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
    questionText: "When I walk my dog, she always walks ____ me.",
    correctAnswer: "beside",
    options: [
      { value: "above", label: "above" },
      { value: "beside", label: "beside" },
      { value: "under", label: "under" },
    ],
    hint: "Think about where someone walks when they are next to you.",
  },
  {
    id: 2,
    questionText: "I sat ____ the table to enjoy dinner.",
    correctAnswer: "at",
    options: [
      { value: "at", label: "at" },
      { value: "by", label: "by" },
      { value: "beside", label: "beside" },
    ],
    hint: "We use this preposition for specific locations like tables, desks, etc.",
  },
  {
    id: 3,
    questionText: "The café is located ____ the bank.",
    correctAnswer: "opposite",
    options: [
      { value: "over", label: "over" },
      { value: "opposite", label: "opposite" },
      { value: "around", label: "around" },
    ],
    hint: "The café is facing or across from the bank.",
  },
  {
    id: 4,
    questionText: "My best friend sits ____ me in class.",
    correctAnswer: "in front of",
    options: [
      { value: "on", label: "on" },
      { value: "under", label: "under" },
      { value: "in front of", label: "in front of" },
    ],
    hint: "Your friend is ahead of you, between you and the teacher.",
  },
  {
    id: 5,
    questionText: "I have been living in this city ____ I was born.",
    correctAnswer: "since",
    options: [
      { value: "since", label: "since" },
      { value: "for", label: "for" },
      { value: "from", label: "from" },
    ],
    hint: "This preposition indicates a specific point in time when something started.",
  },
  {
    id: 6,
    questionText: "Mary was scared of the dark, so she hid ____ the covers.",
    correctAnswer: "beneath",
    options: [
      { value: "above", label: "above" },
      { value: "below", label: "below" },
      { value: "beneath", label: "beneath" },
    ],
    hint: "She is directly under the covers, a more polite way to say 'under'.",
  },
  {
    id: 7,
    questionText: "There is a beautiful forest ____ that mountain.",
    correctAnswer: "beyond",
    options: [
      { value: "beyond", label: "beyond" },
      { value: "under", label: "under" },
      { value: "at", label: "at" },
    ],
    hint: "The forest is further away, on the other side of the mountain.",
  },
  {
    id: 8,
    questionText: "She is the kind ____ person to volunteer at the shelter.",
    correctAnswer: "of",
    options: [
      { value: "of", label: "of" },
      { value: "to", label: "to" },
      { value: "for", label: "for" },
    ],
    hint: "This preposition of possession shows what type or category.",
  },
  {
    id: 9,
    questionText: "The flight was delayed ____ heavy snow.",
    correctAnswer: "due to",
    options: [
      { value: "due to", label: "due to" },
      { value: "because", label: "because" },
      { value: "over", label: "over" },
    ],
    hint: "This phrase explains the reason or cause for the delay.",
  },
  {
    id: 10,
    questionText:
      "The price of petrol has gone up again, it now costs $5 ____ liter.",
    correctAnswer: "per",
    options: [
      { value: "per", label: "per" },
      { value: "for", label: "for" },
      { value: "in", label: "in" },
    ],
    hint: "This preposition of measure is used to express rate or ratio.",
  },
];

const compoundQuestions: CompoundQuestion[] = [
  {
    id: 11,
    textParts: [
      "A valuable employee always tries to go ",
      " and ",
      " what is expected from them.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "above",
        options: [
          { value: "above", label: "above" },
          { value: "beyond", label: "beyond" },
          { value: "over", label: "over" },
        ],
      },
      {
        id: 2,
        correctAnswer: "beyond",
        options: [
          { value: "beyond", label: "beyond" },
          { value: "above", label: "above" },
          { value: "over", label: "over" },
        ],
      },
    ],
    correctMessage:
      'Correct! "Above and beyond" means doing more than expected.',
    hint: "Think of a common phrase about exceeding expectations.",
  },
  {
    id: 12,
    textParts: [
      "The bird was spotted flying ",
      " the forest and landed ",
      " the tall pine trees.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "through",
        options: [
          { value: "through", label: "through" },
          { value: "up", label: "up" },
        ],
      },
      {
        id: 2,
        correctAnswer: "among",
        options: [
          { value: "among", label: "among" },
          { value: "over", label: "over" },
        ],
      },
    ],
    correctMessage:
      'Correct! The bird flew "through" the forest and landed "among" the trees.',
    hint: "Think about how the bird moves and where it lands.",
  },
  {
    id: 13,
    textParts: ["The car went ", " the tunnel and stopped ", " the stop sign."],
    fields: [
      {
        id: 1,
        correctAnswer: "through",
        options: [
          { value: "through", label: "through" },
          { value: "past", label: "past" },
          { value: "along", label: "along" },
        ],
      },
      {
        id: 2,
        correctAnswer: "at",
        options: [
          { value: "by", label: "by" },
          { value: "near", label: "near" },
          { value: "at", label: "at" },
        ],
      },
    ],
    correctMessage:
      'Correct! The car went "through" the tunnel and stopped "at" the stop sign.',
    hint: "Think about how the car moves and where it stops.",
  },
  {
    id: 14,
    textParts: [
      "The students stayed in the library ",
      " the exams began, and left ",
      " finishing their exam.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "until",
        options: [
          { value: "during", label: "during" },
          { value: "until", label: "until" },
          { value: "behind", label: "behind" },
        ],
      },
      {
        id: 2,
        correctAnswer: "after",
        options: [
          { value: "after", label: "after" },
          { value: "until", label: "until" },
          { value: "since", label: "since" },
        ],
      },
    ],
    correctMessage:
      'Correct! The students stayed "until" the exams began and left "after" finishing their exam.',
    hint: "Think about the time sequence - they stayed up to a point and then left when something was completed.",
  },
  {
    id: 15,
    textParts: [
      "The audience was laughing ",
      " the show, but were crying ",
      " the end of it.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "during",
        options: [
          { value: "during", label: "during" },
          { value: "until", label: "until" },
          { value: "across", label: "across" },
        ],
      },
      {
        id: 2,
        correctAnswer: "by",
        options: [
          { value: "by", label: "by" },
          { value: "with", label: "with" },
          { value: "for", label: "for" },
        ],
      },
    ],
    correctMessage:
      'Correct! The audience was laughing "during" the show and crying "by" the end.',
    hint: "Think about when they were laughing (time) and when they were crying (at what point).",
  },
  {
    id: 16,
    textParts: ["The dog ran ", " the park and dashed ", " the open field."],
    fields: [
      {
        id: 1,
        correctAnswer: "toward",
        options: [
          { value: "toward", label: "toward" },
          { value: "by", label: "by" },
          { value: "at", label: "at" },
        ],
      },
      {
        id: 2,
        correctAnswer: "into",
        options: [
          { value: "into", label: "into" },
          { value: "in", label: "in" },
          { value: "out", label: "out" },
        ],
      },
    ],
    correctMessage:
      'Correct! The dog ran "toward" the park and dashed "into" the open field.',
    hint: "Think about the direction of movement - first approaching, then entering.",
  },
  {
    id: 17,
    textParts: [
      "In a right triangle, the height ",
      " the base is always ",
      " a 90° angle.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "adjacent to",
        options: [
          { value: "adjacent to", label: "adjacent to" },
          { value: "beside", label: "beside" },
          { value: "opposite", label: "opposite" },
        ],
      },
      {
        id: 2,
        correctAnswer: "at",
        options: [
          { value: "at", label: "at" },
          { value: "on", label: "on" },
          { value: "by", label: "by" },
        ],
      },
    ],
    correctMessage:
      'Correct! In a right triangle, the height is "adjacent to" the base and is "at" a 90° angle.',
    hint: "Think about geometric terms - the height's position relative to the base and the angle it forms.",
  },
  {
    id: 18,
    textParts: [
      "",
      " winter I wear a thick sweater with a shirt and vest ",
      ".",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "During",
        options: [
          { value: "During", label: "During" },
          { value: "on", label: "On" },
          { value: "at", label: "At" },
        ],
      },
      {
        id: 2,
        correctAnswer: "underneath",
        options: [
          { value: "underneath", label: "underneath" },
          { value: "under", label: "under" },
          { value: "below", label: "below" },
        ],
      },
    ],
    correctMessage:
      '"During" winter I wear layers, with a shirt and vest "underneath" the sweater.',
    hint: "Think about the time period and the position of the clothes.",
  },
  {
    id: 19,
    textParts: [
      "Excited to play ",
      " the snow, the children ran ",
      " the door.",
    ],
    fields: [
      {
        id: 1,
        correctAnswer: "in",
        options: [
          { value: "over", label: "over" },
          { value: "in", label: "in" },
          { value: "across", label: "across" },
        ],
      },
      {
        id: 2,
        correctAnswer: "out",
        options: [
          { value: "out", label: "out" },
          { value: "in", label: "in" },
          { value: "at", label: "at" },
        ],
      },
    ],
    correctMessage:
      'Correct! The children were excited to play "in" the snow and ran "out" the door.',
    hint: "Think about where they want to play and their movement through the door.",
  },
  {
    id: 20,
    textParts: ["The car was speeding ", " 200 miles ", " hour."],
    fields: [
      {
        id: 1,
        correctAnswer: "at",
        options: [
          { value: "at", label: "at" },
          { value: "by", label: "by" },
          { value: "on", label: "on" },
        ],
      },
      {
        id: 2,
        correctAnswer: "per",
        options: [
          { value: "per", label: "per" },
          { value: "in", label: "in" },
          { value: "at", label: "at" },
        ],
      },
    ],
    correctMessage: 'Correct! The car was speeding "at" 200 miles "per" hour.',
    hint: "Insert the proper prepositions that describe speed.",
  },
];

export default function IntermediatePrepositionsPage() {
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
            Prepositions - Intermediate Level (B1-B2)
          </h1>
          <p className="text-gray-600 text-lg">
            Choose the correct preposition to complete each sentence.
          </p>
        </div>

        {/* Introduction Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            What are Prepositions?
          </h2>
          <p className="text-gray-700 mb-4">
            Prepositions are words that connect verbs or nouns or pronouns with
            other words in a sentence to form prepositional phrases. These
            phrases provide extra details about time, place, or direction.
            Understanding how prepositions work with verbs and nouns helps
            clarify the meaning of a sentence, making your speaking and writing
            more accurate.
          </p>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Types of Prepositions
          </h3>
          <p className="text-gray-700 mb-3">
            Below is an extended list of preposition categories often
            encountered at the intermediate level:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Prepositions of Place:</strong> in, on, at, under, above,
              near, between, among, beside, behind, beyond, opposite, across,
              adjacent to, in front of, on top of, next to, below, beneath,
              underneath, against
            </li>
            <li>
              <strong>Prepositions of Time:</strong> at, on, in, during, before,
              after, since, until, by
            </li>
            <li>
              <strong>Prepositions of Direction/Movement:</strong> to, from, out
              of, into, out, onto, through, toward, up, down, across, around,
              past, over, along
            </li>
            <li>
              <strong>Prepositions of Manner:</strong> by, with, like, as
            </li>
            <li>
              <strong>Prepositions of Cause/Reason:</strong> because of, due to,
              owing to, on account of, in response to
            </li>
            <li>
              <strong>Prepositions of Agent/Instrument:</strong> by, via, with
            </li>
            <li>
              <strong>Compound Prepositions:</strong> in front of, on top of,
              out of, next to, in spite of, adjacent to
            </li>
            <li>
              <strong>Prepositions of Comparison:</strong> like, as, than
            </li>
            <li>
              <strong>Prepositions of Measure:</strong> per, by
            </li>
            <li>
              <strong>Prepositions of Source:</strong> from, out of
            </li>
            <li>
              <strong>Prepositions of Possession:</strong> of, with
            </li>
          </ul>
        </section>

        {/* What do they do Section - Shortened for intermediate level */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            What do they do?
          </h2>
          <p className="text-gray-700 mb-4">
            At the intermediate level, you'll work with more complex
            prepositions and phrases. Here are some key uses:
          </p>
          <ul className="space-y-3 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Beside</strong>: Shows that something is next to or at the
              side of something else.
            </li>
            <li>
              <strong>Opposite</strong>: Shows that something is facing or
              across from something else.
            </li>
            <li>
              <strong>In front of</strong>: Shows that something is ahead of
              something else (opposite of behind).
            </li>
            <li>
              <strong>Beneath</strong>: Shows that something is under something
              else (more formal or polite than "under").
            </li>
            <li>
              <strong>Beyond</strong>: Shows that something is further away than
              something else.
            </li>
            <li>
              <strong>Since</strong>: Shows that something has been happening
              from a specific time until now.
            </li>
            <li>
              <strong>Due to</strong>: Shows the reason or cause of something
              (similar to "because of").
            </li>
            <li>
              <strong>Per</strong>: Used as a preposition of measure (e.g.,
              "miles per hour").
            </li>
          </ul>
        </section>

        {/* Example Table */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Types of Prepositions with Examples
          </h2>
          <p className="text-gray-700 mb-4">
            Here are examples of intermediate-level prepositions in sentences:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Preposition
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">beside</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The dog walks <strong>beside</strong> me.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">opposite</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The café is <strong>opposite</strong> the bank.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    in front of
                  </td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The bus stopped <strong>in front of</strong> the cinema.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">beneath</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    She hid <strong>beneath</strong> the covers.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">beyond</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The forest is <strong>beyond</strong> the mountain.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">since</td>
                  <td className="border border-gray-300 px-4 py-3">Time</td>
                  <td className="border border-gray-300 px-4 py-3">
                    I have lived here <strong>since</strong> 2010.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">during</td>
                  <td className="border border-gray-300 px-4 py-3">Time</td>
                  <td className="border border-gray-300 px-4 py-3">
                    It rained <strong>during</strong> the night.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">through</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Direction/Movement
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The car went <strong>through</strong> the tunnel.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">due to</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Cause/Reason
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The flight was delayed <strong>due to</strong> snow.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">per</td>
                  <td className="border border-gray-300 px-4 py-3">Measure</td>
                  <td className="border border-gray-300 px-4 py-3">
                    It costs $5 <strong>per</strong> liter.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">among</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The bird landed <strong>among</strong> the trees.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">via</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Agent/Instrument
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The file was sent <strong>via</strong> email.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Questions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">
            Practice Questions
          </h2>
          <p className="text-gray-700 mb-6">
            Now it's time to practice! Choose the correct preposition to
            complete each sentence. Some questions have multiple dropdowns that
            need to be filled correctly.
          </p>

          {/* Progress Indicator */}
          <ProgressIndicator
            attempted={attemptedCount}
            total={questions.length + compoundQuestions.length}
            score={score}
          />

          {/* Simple Questions */}
          {questions.map((question) => (
            <GrammarQuestionCard
              key={`${question.id}-${resetKey}`}
              question={question}
              onAnswerChange={handleAnswerChange}
            />
          ))}

          {/* Compound Questions */}
          {compoundQuestions.map((question) => (
            <CompoundQuestionCard
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
        total={questions.length + compoundQuestions.length}
        onClose={() => setShowScoreModal(false)}
        onReset={handleReset}
      />
    </div>
  );
}
