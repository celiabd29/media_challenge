'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

export default function QuizPage() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, question_text, answers(id, answer_text, is_correct)")
        .limit(1)
        .single();

      if (error) console.error(error);
      else setQuestion(data);
    };

    fetchQuestion();
  }, []);

  const handleAnswerClick = (id) => {
<<<<<<< HEAD
    if (!selectedAnswer) setSelectedAnswer(id);
=======
    if (!selectedAnswer) {
      setSelectedAnswer(id);
    }
>>>>>>> c727626 (auth, profil, dashboard -celia)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 px-4">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg">
        {question ? (
          <>
            <h1 className="text-xl font-semibold text-center mb-6">
              {question.question_text}
            </h1>
            <div className="grid grid-cols-1 gap-4">
              {question.answers.map((answer) => {
                const isSelected = selectedAnswer === answer.id;
                const isCorrect = answer.is_correct;
                let bgColor = "bg-white";

                if (selectedAnswer) {
                  if (isSelected && isCorrect) bgColor = "bg-green-200";
                  else if (isSelected && !isCorrect) bgColor = "bg-red-200";
                  else if (!isSelected && isCorrect) bgColor = "bg-green-100";
                }

                return (
                  <button
                    key={answer.id}
                    className={`p-4 rounded-xl border transition-colors ${bgColor} ${
                      !selectedAnswer ? "hover:bg-gray-100" : ""
                    }`}
                    onClick={() => handleAnswerClick(answer.id)}
                    disabled={!!selectedAnswer}
                  >
                    {answer.answer_text}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}