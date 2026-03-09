"use client";

import { useState } from "react";
import { Metadata } from "next";
import GrammarQuestionCard, {
  GrammarQuestion,
} from "@/components/grammar/GrammarQuestionCard";
import ProgressIndicator from "@/components/grammar/ProgressIndicator";
import ScoreModal from "@/components/grammar/ScoreModal";

const questions: GrammarQuestion[] = [
  {
    id: 1,
    questionText: "The cat sits ____ the table.",
    correctAnswer: "on",
    options: [
      { value: "on", label: "on" },
      { value: "under", label: "under" },
    ],
    imageSrc: "/grammar/prepbasic-images/cat-on-table.jpg",
    imageAlt: "Cat on the table",
    hint: "Think about where the cat is positioned on top of the surface.",
  },
  {
    id: 2,
    questionText: "The cat is ____ the box.",
    correctAnswer: "in",
    options: [
      { value: "on", label: "on" },
      { value: "in", label: "in" },
    ],
    imageSrc: "/grammar/prepbasic-images/cat-in-box.jpg",
    imageAlt: "Cat in a box",
    hint: "The cat is inside the box, not on top of it.",
  },
  {
    id: 3,
    questionText: "The kids are ____ the trees.",
    correctAnswer: "between",
    options: [
      { value: "between", label: "between" },
      { value: "in", label: "in" },
      { value: "next to", label: "next to" },
    ],
    imageSrc: "/grammar/prepbasic-images/kids-between-trees.jpg",
    imageAlt: "Kids between trees",
    hint: "The kids are in the middle of two trees.",
  },
  {
    id: 4,
    questionText: "The kitten is playing ____ the blanket.",
    correctAnswer: "under",
    options: [
      { value: "under", label: "under" },
      { value: "on", label: "on" },
      { value: "over", label: "over" },
    ],
    imageSrc: "/grammar/prepbasic-images/kitten-under-blanket.jpg",
    imageAlt: "Kitten playing under the blanket",
    hint: "The kitten is beneath the blanket, covered by it.",
  },
  {
    id: 5,
    questionText: "The boy is skateboarding ____ his friend.",
    correctAnswer: "with",
    options: [
      { value: "with", label: "with" },
      { value: "on", label: "on" },
      { value: "to", label: "to" },
    ],
    imageSrc: "/grammar/prepbasic-images/boy-skateboarding.jpg",
    imageAlt: "Boy skateboarding with his friend",
    hint: "He is doing the activity together with his friend.",
  },
  {
    id: 6,
    questionText: "The giraffe is ____ the tree.",
    correctAnswer: "behind",
    options: [
      { value: "behind", label: "behind" },
      { value: "next to", label: "next to" },
      { value: "in front of", label: "in front of" },
    ],
    imageSrc: "/grammar/prepbasic-images/giraffe-behind-tree.jpg",
    imageAlt: "Giraffe behind the tree",
    hint: "The giraffe is at the back of the tree, not visible from the front.",
  },
  {
    id: 7,
    questionText: "The lion is ____ the zebra.",
    correctAnswer: "next to",
    options: [
      { value: "next to", label: "next to" },
      { value: "in", label: "in" },
      { value: "under", label: "under" },
    ],
    imageSrc: "/grammar/prepbasic-images/lion-next-to-zebra.jpg",
    imageAlt: "Lion next to zebra",
    hint: "The lion is beside the zebra, very close to it.",
  },
  {
    id: 8,
    questionText: "The garbage bin is ____ the tree.",
    correctAnswer: "near",
    options: [
      { value: "near", label: "near" },
      { value: "over", label: "over" },
      { value: "behind", label: "behind" },
    ],
    imageSrc: "/grammar/prepbasic-images/bin-near-tree.jpg",
    imageAlt: "Bin near tree",
    hint: "The bin is close to the tree but not touching it.",
  },
  {
    id: 9,
    questionText: "The window is ____ the book.",
    correctAnswer: "above",
    options: [
      { value: "above", label: "above" },
      { value: "below", label: "below" },
      { value: "next to", label: "next to" },
    ],
    imageSrc: "/grammar/prepbasic-images/window-above-book.jpg",
    imageAlt: "Window above the book",
    hint: "The window is higher than the book but not touching it.",
  },
  {
    id: 10,
    questionText: "The umbrella is hanging ____ the door.",
    correctAnswer: "on",
    options: [
      { value: "by", label: "by" },
      { value: "next to", label: "next to" },
      { value: "on", label: "on" },
    ],
    imageSrc: "/grammar/prepbasic-images/umbrella-by-door.jpg",
    imageAlt: "Umbrella by the door",
    hint: "The umbrella is attached to or resting on the door surface.",
  },
  {
    id: 11,
    questionText: "The dog jumps ____ the pool.",
    correctAnswer: "into",
    options: [
      { value: "into", label: "into" },
      { value: "onto", label: "onto" },
      { value: "over", label: "over" },
    ],
    imageSrc: "/grammar/prepbasic-images/dog-into-pool.jpg",
    imageAlt: "Dog jumping into pool",
    hint: "The dog is going from outside to inside the water.",
  },
  {
    id: 12,
    questionText: "We will go camping ____ Saturday.",
    correctAnswer: "on",
    options: [
      { value: "on", label: "on" },
      { value: "in", label: "in" },
      { value: "at", label: "at" },
    ],
    imageSrc: "/grammar/prepbasic-images/on-saturday.jpg",
    imageAlt: "Camping on Saturday",
    hint: "We use this preposition for specific days of the week.",
  },
  {
    id: 13,
    questionText: "My birthday is ____ June.",
    correctAnswer: "in",
    options: [
      { value: "in", label: "in" },
      { value: "on", label: "on" },
      { value: "at", label: "at" },
    ],
    imageSrc: "/grammar/prepbasic-images/in-june.jpg",
    imageAlt: "Birthday in June",
    hint: "We use this preposition for months, years, and seasons.",
  },
  {
    id: 14,
    questionText: "The penguin jumps ____ the ice.",
    correctAnswer: "on",
    options: [
      { value: "on", label: "on" },
      { value: "in", label: "in" },
      { value: "behind", label: "behind" },
    ],
    imageSrc: "/grammar/prepbasic-images/penguin-onto-ice.jpg",
    imageAlt: "Penguin jumping onto ice",
    hint: "The penguin is landing on top of the ice surface.",
  },
  {
    id: 15,
    questionText: "The rabbit jumps ____ the rock.",
    correctAnswer: "over",
    options: [
      { value: "over", label: "over" },
      { value: "in", label: "in" },
      { value: "at", label: "at" },
    ],
    imageSrc: "/grammar/prepbasic-images/rabbit-over-rock.jpg",
    imageAlt: "Rabbit jumping over rock",
    hint: "The rabbit is going above and across the rock.",
  },
];

export default function BeginnerPrepositionsPage() {
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
            Prepositions - Beginner Level (A1-A2)
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
            Prepositions are words that tell us <strong>where</strong>,{" "}
            <strong>when</strong>, or <strong>how</strong> something happens.
            They connect a noun or verbs with other words in a sentence.
            Prepositions help us show the time, place, or direction of
            something.
          </p>

          <h3 className="text-xl font-semibold text-primary-dark mb-3 mt-6">
            Types of Prepositions
          </h3>
          <p className="text-gray-700 mb-3">
            There are different kinds of prepositions. Let's look at some of
            them:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4 list-disc">
            <li>
              <strong>Prepositions of Place:</strong> These tell us where
              something is. Examples:{" "}
              <em>
                in, on, at, under, above, next to, near, behind, between, by
              </em>
              .
            </li>
            <li>
              <strong>Prepositions of Time:</strong> These tell us when
              something happens. Examples: <em>at, on, in</em>.
            </li>
            <li>
              <strong>Prepositions of Direction/Movement:</strong> These show
              movement to a place. Examples: <em>to, into, onto, over</em>.
            </li>
            <li>
              <strong>Prepositions of Manner:</strong> These show how something
              is done. Examples: <em>by, with</em>.
            </li>
          </ul>
        </section>

        {/* What do they do Section */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            What do they do?
          </h2>
          <p className="text-gray-700 mb-4">
            Prepositions help to explain where, when, or how something happens.
            For example:
          </p>
          <ul className="space-y-3 text-gray-700 ml-4 list-disc">
            <li>
              <strong>In</strong>: We use "in" for large places, like countries,
              cities, or rooms. And to say that something is in something else.
            </li>
            <li>
              <strong>On</strong>: We use "on" for surfaces, like tables or
              walls. And to say that something is on something else.
            </li>
            <li>
              <strong>At</strong>: We use "at" for specific places or times,
              like "at the bus stop" or "at 5 o'clock."
            </li>
            <li>
              <strong>Under</strong>: We use "under" to show that something is
              being covered by something else.
            </li>
            <li>
              <strong>Above</strong>: We use "above" to show that something is
              higher than something else but not touching it.
            </li>
            <li>
              <strong>Next to</strong>: We use "next to" to show that something
              is very close to the side of something else.
            </li>
            <li>
              <strong>Near</strong>: We use "near" to show that something is
              close to something else.
            </li>
            <li>
              <strong>Behind</strong>: We use "behind" to show that something is
              at the back of something else.
            </li>
            <li>
              <strong>Between</strong>: We use "between" to show that something
              is in the middle of two things.
            </li>
            <li>
              <strong>On</strong>: We use "on" as a preposition of time to
              indicate specific days or dates.
            </li>
            <li>
              <strong>In</strong>: We use "in" as a preposition of time to say
              something happens in a period of time, such as seasons, months, or
              years.
            </li>
            <li>
              <strong>To</strong>: We use "to" to say something is going from
              one place to another place.
            </li>
            <li>
              <strong>Into</strong>: We use "into" to say something is going
              from outside to inside a place.
            </li>
            <li>
              <strong>Onto</strong>: We use "onto" to say something is going to
              the top of something else.
            </li>
            <li>
              <strong>Over</strong>: We use "over" as a preposition of movement
              to say that something is going above or higher than something
              else.
            </li>
            <li>
              <strong>By</strong>: We use "by" to show the position of something
              close to something else, or that something is being done by
              someone.
            </li>
            <li>
              <strong>With</strong>: We use "with" to show that someone is doing
              something with someone else.
            </li>
          </ul>
        </section>

        {/* Example Table */}
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border-2 border-neutral">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Types of Prepositions with Examples
          </h2>
          <p className="text-gray-700 mb-4">
            There are different types of prepositions. Let's look at some
            examples of them:
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
                  <td className="border border-gray-300 px-4 py-3">in</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The cat is <strong>in</strong> the box.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">on</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The book is <strong>on</strong> the table.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">at</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    We are <strong>at</strong> the park.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">under</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The dog is <strong>under</strong> the chair.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">in</td>
                  <td className="border border-gray-300 px-4 py-3">Time</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The meeting is <strong>in</strong> the morning.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">on</td>
                  <td className="border border-gray-300 px-4 py-3">Time</td>
                  <td className="border border-gray-300 px-4 py-3">
                    We will meet <strong>on</strong> Monday.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">to</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Direction
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    She is going <strong>to</strong> the store.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">with</td>
                  <td className="border border-gray-300 px-4 py-3">Manner</td>
                  <td className="border border-gray-300 px-4 py-3">
                    I am going to the park <strong>with</strong> my friend.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">behind</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The car is <strong>behind</strong> the house.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">above</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The picture is <strong>above</strong> the sofa.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">near</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The school is <strong>near</strong> the park.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">by</td>
                  <td className="border border-gray-300 px-4 py-3">Position</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The chair is <strong>by</strong> the window.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">by</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Means/Agent
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The song was written <strong>by</strong> the musician.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">between</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The ball is <strong>between</strong> the two chairs.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">next to</td>
                  <td className="border border-gray-300 px-4 py-3">Place</td>
                  <td className="border border-gray-300 px-4 py-3">
                    The bakery is <strong>next to</strong> the supermarket.
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
            complete each sentence.
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
            className="bg-primary hover:bg-primary-light text-primary-dark font-bold text-lg py-4 px-12 rounded-lg transition-all border-2 border-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
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
