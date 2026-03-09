"use client";

import { useState, ReactElement } from "react";

export interface CompoundField {
  id: number;
  correctAnswer: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface CompoundQuestion {
  id: number;
  textParts: string[]; // Text split by the blank positions
  fields: CompoundField[];
  correctMessage: string;
  hint: string;
}

interface CompoundQuestionCardProps {
  question: CompoundQuestion;
  onAnswerChange: (
    questionId: number,
    answers: string[],
    isCorrect: boolean,
  ) => void;
}

export default function CompoundQuestionCard({
  question,
  onAnswerChange,
}: CompoundQuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    new Array(question.fields.length).fill(""),
  );
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleChange = (fieldIndex: number, value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[fieldIndex] = value;
    setSelectedAnswers(newAnswers);

    // Check if all fields are answered
    if (newAnswers.every((ans) => ans !== "")) {
      // Check if all are correct
      const allCorrect = newAnswers.every(
        (ans, idx) => ans === question.fields[idx].correctAnswer,
      );
      setIsCorrect(allCorrect);
      setShowResult(true);
      setShowHint(!allCorrect);
      onAnswerChange(question.id, newAnswers, allCorrect);
    } else {
      setShowResult(false);
      setShowHint(false);
      // If not all answered, report as not complete
      onAnswerChange(question.id, [], false);
    }
  };

  // Build the question text with dropdowns
  const renderQuestionWithDropdowns = () => {
    const elements: ReactElement[] = [];

    question.textParts.forEach((part, index) => {
      // Add text part
      elements.push(
        <span key={`text-${index}`} className="text-gray-700">
          {part}
        </span>,
      );

      // Add dropdown if not the last part
      if (index < question.fields.length) {
        const field = question.fields[index];
        elements.push(
          <select
            key={`field-${index}`}
            value={selectedAnswers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            className="inline-block mx-1 px-2 py-1 border-2 border-neutral rounded bg-white text-gray-700 focus:outline-none focus:border-accent-orchid transition-colors cursor-pointer">
            <option value="">____</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>,
        );
      }
    });

    return <div className="leading-relaxed">{elements}</div>;
  };

  return (
    <div className="bg-white border-2 border-neutral rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <span className="text-primary-dark font-semibold text-lg">
          Question {question.id}
        </span>
      </div>

      <div className="mb-4">{renderQuestionWithDropdowns()}</div>

      {/* Result Feedback */}
      {showResult && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            isCorrect
              ? "bg-green-50 text-green-800 border-2 border-green-300 animate-pulse"
              : "bg-red-50 text-red-800 border-2 border-red-300"
          }`}>
          {isCorrect ? (
            <div className="flex items-start">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-medium">{question.correctMessage}</span>
            </div>
          ) : (
            <div>
              <div className="flex items-start mb-2">
                <span className="text-2xl mr-2">❌</span>
                <span className="font-medium">Not quite right. Try again!</span>
              </div>
              {showHint && (
                <div className="mt-2 text-sm">
                  <span className="font-semibold">Hint:</span> {question.hint}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
