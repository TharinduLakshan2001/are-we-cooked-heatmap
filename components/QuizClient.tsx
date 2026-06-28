"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type Question = {
  text: string;
  options: { text: string; points: number }[];
};

const QUESTIONS: Question[] = [
  {
    text: "Did you check the weather before leaving today?",
    options: [
      { text: "Yes, I'm fully prepared.", points: 0 },
      { text: "No, I live on the edge.", points: 15 },
      { text: "I haven't left my room in days.", points: 30 },
    ],
  },
  {
    text: "How many fans or AC units are currently running in your room?",
    options: [
      { text: "2 or more (Chilled zone)", points: 0 },
      { text: "Only 1 (Fighting for survival)", points: 15 },
      { text: "0 (I am sitting in a sauna)", points: 30 },
    ],
  },
  {
    text: "Have you said 'it's so hot' out loud today?",
    options: [
      { text: "Not once.", points: 0 },
      { text: "Maybe once or twice.", points: 10 },
      { text: "Every 5 minutes, it is my mantra.", points: 25 },
    ],
  },
  {
    text: "Did you study for the exam/meeting you have tomorrow?",
    options: [
      { text: "Yes, I am completely locked in.", points: 0 },
      { text: "Cramming starts at midnight.", points: 15 },
      { text: "We will wing it and pray.", points: 30 },
    ],
  },
  {
    text: "Have you replied to that text message from 3 days ago?",
    options: [
      { text: "Yes, I reply immediately.", points: 0 },
      { text: "Still drafting the perfect response.", points: 15 },
      { text: "Left on read. It is history now.", points: 30 },
    ],
  },
];

export default function QuizClient() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  const handleSelect = (points: number) => {
    if (transitioning) return;

    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
        setTransitioning(false);
      }, 200);
    } else {
      // Calculate final score
      const totalPoints = nextAnswers.reduce((sum, p) => sum + p, 0);
      const maxPoints = QUESTIONS.reduce((sum, q) => sum + q.options.reduce((m, o) => Math.max(m, o.points), 0), 0);
      const scorePercent = Math.round((totalPoints / maxPoints) * 100);

      setTransitioning(true);
      router.push(`/quiz/result/${scorePercent}`);
    }
  };

  const progressPercent = Math.round((currentIdx / QUESTIONS.length) * 100);
  const currentQuestion = QUESTIONS[currentIdx];

  return (
    <div className="w-full max-w-xl rounded-2xl border border-line bg-panel p-6 sm:p-8 shadow-xl">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-mist">
          Question {currentIdx + 1} of {QUESTIONS.length}
        </span>
        <span className="font-mono text-xs font-semibold text-frost">
          {progressPercent}% Done
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-panel-2 overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-ember to-crimson transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question panel */}
      <div
        className={`transition-all duration-200 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <h2 className="font-display text-lg sm:text-xl font-black text-ink leading-snug mb-6">
          {currentQuestion.text}
        </h2>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.points)}
              aria-label={`Answer option: ${opt.text}`}
              className="flex w-full items-center justify-between rounded-xl border border-line bg-panel-2 px-5 py-4 text-left text-sm font-semibold text-ink transition-all hover:border-frost/40 hover:bg-white/[0.02] active:scale-[0.99] cursor-pointer"
            >
              <span>{opt.text}</span>
              <ArrowRight size={15} className="text-mist opacity-0 transition-opacity group-hover:opacity-100 shrink-0 ml-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
