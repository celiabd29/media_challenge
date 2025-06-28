'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import ecouteImg from '../assets/img/ecoute2.png';
import communicationImg from '../assets/img/communication.png';
import protectionImg from '../assets/img/protection.png';
import identiteImg from '../assets/img/identite.png';
import emotionImg from '../assets/img/emotion2.png';

const imageMap = {
  'ecoute2.png': ecouteImg,
  'communication.png': communicationImg,
  'protection.png': protectionImg,
  'identite.png': identiteImg,
  'emotion2.png': emotionImg,
};

const getResultMessage = (score, total) => {
  if (score === 0)
    return {
      title: "Oups...",
      msg: "Aucune bonne réponse. C'est l'intention qui compte ! Allez, on réessaie ?",
    };
  if (score === 1)
    return {
      title: "Pas tout à fait ça…",
      msg: "Tu as 1 bonne réponse. Tu es sur la bonne voie, continue !",
    };
  if (score === 2)
    return {
      title: "Pas mal !",
      msg: "Tu as 2 bonnes réponses. Un petit effort de plus et ce sera parfait !",
    };
  if (score === 3)
    return {
      title: "Bien joué !",
      msg: "Tu as 3 bonnes réponses. Tu maîtrises une bonne partie du sujet !",
    };
  if (score === 4)
    return {
      title: "Excellent !",
      msg: "Tu as 4 bonnes réponses. Encore une petite marche vers la perfection !",
    };
  if (score === total)
    return {
      title: "Bravo !",
      msg: "Tu as fait un sans faute ! 5/5, tu es incollable !",
    };
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
        .select("id, question_text, image_url")
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
      const isCorrect = questions[currentIndex].answers.find(
        (a) => a.id === id
      )?.is_correct;
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
      <div className="min-h-screen bg-[#E9C4DE] flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#E9C4DE] flex items-center justify-center">
        <div className="text-white text-lg">Aucune question disponible.</div>
      </div>
    );
  }

  if (quizFinished) {
    const total = questions.length;
    const { title, msg } = getResultMessage(score, total);
    return (
      <div className="min-h-screen bg-[#E9C4DE] flex flex-col">
        {/* Header avec bouton fermer */}
        <div className="flex justify-end p-4">
          <button
            className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-gray-100 transition text-xl md:text-3xl"
            onClick={() => router.back()}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Contenu centré */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center text-white max-w-sm">
            <div className="text-5xl md:text-7xl font-bold mb-4">{score}/{total}</div>
            <div className="text-xl md:text-3xl font-medium mb-6">{title}</div>
            <div className="text-base md:text-xl leading-relaxed mb-12">
              {msg}
            </div>
          </div>
        </div>

        {/* Boutons en bas */}
        <div className="px-6 pb-8 space-y-4">
          <button
            className="w-full bg-white text-gray-800 font-medium py-4 md:py-6 mb-8 rounded-xl hover:bg-gray-100 transition text-base md:text-lg"
            onClick={handleRestart}
          >
            Refaire le test
          </button>
          <button
            className="w-full bg-white text-gray-800 font-medium py-4 md:py-6 rounded-xl hover:bg-gray-100 transition text-base md:text-lg"
            onClick={() => router.back()}
          >
            Revenir à l'article
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#E9C4DE] flex flex-col">
      {/* Header fixe avec bouton fermer et titre */}
      <div className="flex items-center justify-between p-4 bg-[#E9C4DE]">
        <div className="w-8"></div> {/* Spacer pour centrer le titre */}
        <h2 className="text-black font-medium text-m md:text-2xl">Quiz</h2>
        <button
          className="w-8 h-8 md:w-12 md:h-12 rounded-full text-black bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition text-xl md:text-2xl"
          onClick={() => router.back()}
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      {/* Barre de progression */}
      <div className="px-4 pb-6">
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= currentIndex ? "bg-[#C376AC]" : "bg-white bg-opacity-30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Zone principale - occupe tout l'espace restant */}
      <div className="flex-1 flex flex-col">
        {/* Zone de contenu avec question et image */}
        <div className="flex-1 px-6 pb-8 flex flex-col justify-center relative">
          {/* Question centrée */}
          <h1 className="text-2xl md:text-4xl text-white font-medium text-center leading-tight mb-10 z-10 relative">
            {question.question_text}
          </h1>
          
          {/* Image positionnée en bas à droite */}
          {question.image_url && (
            <div className="absolute bottom-0 right-0 z-0">
              {question.image_url.startsWith('http') ? (
                <img
                  src={question.image_url}
                  alt="illustration"
                  className="h-40 w-auto md:h-60 object-contain"
                />
              ) : imageMap[question.image_url] ? (
                <img
                  src={imageMap[question.image_url].src}
                  alt="illustration"
                  className="h-40 w-auto md:h-60 object-contain"
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Zone des réponses - toujours en bas */}
        <div className="bg-white px-4 py-6 md:py-12 grid grid-cols-2 gap-3 md:gap-8 shadow-lg">
          {question.answers.map((answer) => {
            const isSelected = selectedAnswer === answer.id;
            const isCorrect = answer.is_correct;
            let bgColor = "bg-white";
            let borderColor = "border-gray-200";
            
            if (showCorrection) {
              if (isSelected && isCorrect) {
                bgColor = "bg-[#A5C580]";
                borderColor = "border-[#A5C580]";
              } else if (isSelected && !isCorrect) {
                bgColor = "bg-[#E44F4F]";
                borderColor = "border-[#E44F4F]";
              } else if (!isSelected && isCorrect) {
                bgColor = "bg-green-50";
                borderColor = "border-green-200";
              }
            }
            
            return (
              <button
                key={answer.id}
                className={`
                  p-4 md:py-6 rounded-xl text-sm md:text-lg text-gray-800 shadow-xl border-none transition-all duration-200
                  ${bgColor} ${borderColor}
                  ${!selectedAnswer ? "hover:bg-gray-50 hover:border-gray-300 active:scale-95" : ""}
                  font-medium leading-tight
                `}
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