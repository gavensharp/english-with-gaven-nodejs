"use client";

import { useState } from "react";
import Image from "next/image";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface GrammarQuestion {
  id: number;
  questionText: string;
  correctAnswer: string;
  options: QuestionOption[];
  imageSrc?: string;
  imageAlt?: string;
  hint?: string;
}

interface GrammarQuestionCardProps {
  question: GrammarQuestion;
  onAnswerChange: (
    questionId: number,
    answer: string,
    isCorrect: boolean,
  ) => void;
}

export default function GrammarQuestionCard({
  question,
  onAnswerChange,
}: GrammarQuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleChange = (value: string) => {
    if (value === "blank") {
      setSelectedAnswer("");
      setShowResult(false);
      onAnswerChange(question.id, "", false);
      return;
    }

    setSelectedAnswer(value);
    setShowResult(true);
    const isCorrect = value === question.correctAnswer;
    onAnswerChange(question.id, value, isCorrect);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
      {/* Question Card */}
      <div className="bg-white border-2 border-neutral rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
        <h3 className="text-lg font-semibold mb-4 text-primary-dark">
          Question {question.id}
        </h3>
        <p className="text-gray-700 mb-4 text-lg">
          {question.questionText.split("____")[0]}
          <select
            value={selectedAnswer}
            onChange={(e) => handleChange(e.target.value)}
            className="mx-2 px-3 py-2 border-2 border-neutral rounded-lg focus:border-accent-orchid focus:outline-none transition-colors text-base min-w-[120px] cursor-pointer">
            <option value="">____</option>
            {question.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {question.questionText.split("____")[1]}
        </p>

        {/* Result Display with Animation */}
        {showResult && (
          <div
            className={`mt-3 p-3 rounded-lg font-semibold text-center transition-all duration-300 ${
              isCorrect
                ? "bg-green-100 text-green-700 animate-pulse"
                : "bg-red-100 text-red-700"
            }`}>
            {isCorrect ? "✅ Correct!" : "❌ Try again!"}
          </div>
        )}

        {/* Hint Button */}
        {question.hint && (
          <div className="mt-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-accent-orange hover:text-accent-orange/80 font-semibold text-sm underline transition-colors">
              {showHint ? "Hide Hint" : "💡 Show Hint"}
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-accent-orange rounded text-sm text-gray-700">
                {question.hint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      {question.imageSrc && (
        <div className="flex justify-center">
          <div className="relative w-full max-w-[240px] h-[240px]">
            <Image
              src={question.imageSrc}
              alt={question.imageAlt || "Grammar exercise image"}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, 240px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
