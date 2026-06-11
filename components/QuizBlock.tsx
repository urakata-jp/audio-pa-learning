"use client";

import { useState } from "react";

type QuizBlockProps = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export function QuizBlock({ question, options, answer, explanation }: QuizBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <section className="quiz-block" aria-label="理解度チェック">
      <p className="section-label">理解度チェック</p>
      <h3>{question}</h3>
      <div className="quiz-options">
        {options.map((option, index) => {
          const isCorrect = index === answer;
          const isSelected = selected === index;
          const stateClass = answered && isCorrect ? "is-correct" : answered && isSelected ? "is-wrong" : "";

          return (
            <button
              className={`quiz-option ${stateClass}`}
              key={option}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={isSelected}
            >
              <span>{index + 1}</span>
              {option}
            </button>
          );
        })}
      </div>
      {answered ? (
        <p className={`quiz-result ${selected === answer ? "success" : "error"}`}>
          {selected === answer ? "正解です。" : "もう一度確認しましょう。"}
          {explanation ? ` ${explanation}` : ""}
        </p>
      ) : null}
    </section>
  );
}
