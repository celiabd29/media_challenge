"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";

const getResultMessage = (score, total) => {
  if (score === 0) return { title: "Oups...", msg: "Aucune bonne réponse. C'est l'intention qui compte ! Allez, on réessaie ?" };
  if (score === 1) return { title: "Pas tout à fait ça…", msg: "Tu as 1 bonne réponse. Tu es sur la bonne voie, continue !" };
  if (score === 2) return { title: "Pas mal !", msg: "Tu as 2 bonnes réponses. Un petit effort de plus et ce sera parfait !" };
  if (score === 3) return { title: "Bien joué !", msg: "Tu as 3 bonnes réponses. Tu maîtrises une bonne partie du sujet !" };
  if (score === 4) return { title: "Excellent !", msg: "Tu as 4 bonnes réponses. Encore une petite marche vers la perfection !" };
  if (score === total) return { title: "Bravo !", msg: "Tu as fait un sans faute ! 5/5, tu es incollable !" };
  return { title: "Résultat", msg: "" };
};

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const articleId = searchParams.get("id");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("questions")
        .select("id, question_text")
        .order("id", { ascending: true });
      if (error) {
        setQuestions([]);
        setLoading(false);
        return;
      }
      const { data: answers, error: errorAnswers } = await supabase
        .from("answers")
        .select("id, question_id, answer_text, is_correct");
      if (errorAnswers) {
        setQuestions([]);
        setLoading(false);
        return;
      }
      const questionsWithAnswers = data.map((q) => ({
        ...q,
        answers: answers.filter((a) => a.question_id === q.id),
      }));
      setQuestions(questionsWithAnswers);
      setLoading(false);
    };
    fetchQuestions();
  }, [articleId]);

  useEffect(() => {
    if (quizFinished) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [quizFinished]);

  const handleAnswerClick = (id) => {
    if (!selectedAnswer) {
      setSelectedAnswer(id);
      setShowCorrection(true);
      const isCorrect = questions[currentIndex].answers.find(a => a.id === id)?.is_correct;
      if (isCorrect) setScore((prev) => prev + 1);
      setTimeout(() => {
        if (currentIndex === questions.length - 1) {
          setQuizFinished(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowCorrection(false);
        }
      }, 1000);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowCorrection(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 px-4">
        <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 px-4">
        <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg">
          <p>Aucune question disponible.</p>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const total = questions.length;
    const { title, msg } = getResultMessage(score, total);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200 px-4">
        <div className="max-w-xl w-full bg-pink-200 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <button
            className="ml-auto mb-4 rounded-full border border-gray-300 p-2 bg-white hover:bg-gray-100 transition"
            onClick={() => router.back()}
            aria-label="Fermer"
          >
            <span className="text-xl">×</span>
          </button>
          <div className="text-center mt-2">
            <div className="text-3xl font-bold mb-2">{score}/{total}</div>
            <div className="text-lg font-semibold mb-2">{title}</div>
            <div className="text-base text-white mb-8 whitespace-pre-line">{msg}</div>
            <button
              className="w-full bg-white text-gray-800 font-semibold py-2 rounded-xl shadow mb-4 hover:bg-gray-50 transition"
              onClick={handleRestart}
            >
              Refaire le test
            </button>
            <button
              className="w-full bg-white text-gray-800 font-semibold py-2 rounded-xl shadow hover:bg-gray-50 transition"
              onClick={() => router.back()}
            >
              Revenir à l'article
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const total = questions.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 px-4">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg">
        {/* Compteur de questions */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  idx <= currentIndex ? "bg-pink-400" : "bg-pink-200"
                }`}
              ></div>
            ))}
          </div>
        </div>
        {/* Image à importer ici selon la question */}
        <div className="flex justify-center mb-6">
          {/* <img src={...} alt="illustration" className="h-32" /> */}
        </div>
        <h1 className="text-xl font-semibold text-center mb-6">
          {question.question_text}
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {question.answers.map((answer) => {
            const isSelected = selectedAnswer === answer.id;
            const isCorrect = answer.is_correct;
            let bgColor = "bg-white";
            if (showCorrection) {
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
      </div>
    </div>
  );
}
