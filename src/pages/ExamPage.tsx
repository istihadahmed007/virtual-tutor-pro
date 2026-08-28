import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mathQuestions, physicsQuestions, type Question } from "@/lib/data";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router";

type ExamState = "intro" | "active" | "review";

export default function ExamPage() {
  const navigate = useNavigate();
  const [examState, setExamState] = useState<ExamState>("intro");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [examDuration, setExamDuration] = useState(0);

  useEffect(() => {
    if (examState !== "active" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    if (timeLeft === 0) handleSubmit();
    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  const startExam = (subject: string) => {
    const qs = subject === "Mathematics" ? mathQuestions : physicsQuestions;
    const duration = subject === "Mathematics" ? 60 * 60 : 45 * 60;
    setQuestions(qs);
    setSelectedSubject(subject);
    setExamDuration(duration);
    setTimeLeft(duration);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setExamState("active");
  };

  const selectAnswer = (qId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const toggleFlag = (qId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    setExamState("review");
  }, []);

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Results calculation
  const results =
    examState === "review"
      ? questions.reduce(
          (acc, q) => {
            const userAns = answers[q.id];
            if (userAns) {
              acc.answered++;
              if (userAns === q.correctAnswer) acc.correct++;
            }
            return acc;
          },
          { answered: 0, correct: 0 },
        )
      : null;

  // Intro View
  if (examState === "intro") {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <header className="bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900">Mock Exam Simulator</h1>
            <p className="text-slate-500 mt-2">
              Realistic timed examinations with negative marking and pace tracking
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer" onClick={() => startExam("Mathematics")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    Mathematics • {mathQuestions.length} Questions
                  </span>
                  <span className="text-xs text-slate-400">60 Mins</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Higher Mathematics Mock Test</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Calculus, Integration, Matrix Algebra, Complex Numbers, and Series
                </p>
                <Button className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                  Start Timed Simulation
                </Button>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer" onClick={() => startExam("Physics")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                    Physics • {physicsQuestions.length} Questions
                  </span>
                  <span className="text-xs text-slate-400">45 Mins</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Physics Comprehensive Test</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Kinematics, Mechanics, Electrostatics, Waves, and Thermodynamics
                </p>
                <Button className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                  Start Physics Mock
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Review / Results View
  if (examState === "review" && results) {
    const percentage = Math.round((results.correct / questions.length) * 100);
    const grade =
      percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : percentage >= 60 ? "B" : percentage >= 50 ? "C" : "D";

    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <header className="bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
            <h2 className="text-sm font-bold text-slate-900">Exam Results</h2>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8 shadow-xl shadow-indigo-500/20">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-300" />
            <h2 className="text-2xl font-extrabold">{selectedSubject} Exam Complete!</h2>
            <div className="mt-6 flex items-center justify-center gap-12">
              <div>
                <p className="text-5xl font-extrabold">{percentage}%</p>
                <p className="text-sm text-indigo-200 mt-1">Score</p>
              </div>
              <div className="w-px h-16 bg-white/20" />
              <div>
                <p className="text-5xl font-extrabold">{grade}</p>
                <p className="text-sm text-indigo-200 mt-1">Grade</p>
              </div>
              <div className="w-px h-16 bg-white/20" />
              <div>
                <p className="text-5xl font-extrabold">{results.correct}/{questions.length}</p>
                <p className="text-sm text-indigo-200 mt-1">Correct</p>
              </div>
            </div>
          </div>

          {/* Detailed Review */}
          <h3 className="text-lg font-bold text-slate-900 mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <Card key={q.id} className={`border-2 ${userAns ? (isCorrect ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30") : "border-slate-200"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${userAns ? (isCorrect ? "bg-emerald-100" : "bg-red-100") : "bg-slate-100"}`}>
                        {userAns ? (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 mb-3">
                          {i + 1}. {q.text}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {q.options.map((opt) => (
                            <div
                              key={opt.id}
                              className={`text-xs px-3 py-2 rounded-lg border ${
                                opt.id === q.correctAnswer
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold"
                                  : userAns === opt.id
                                    ? "bg-red-100 border-red-300 text-red-700"
                                    : "bg-slate-50 border-slate-200 text-slate-600"
                              }`}
                            >
                              <span className="font-bold mr-1">{opt.id}.</span> {opt.text}
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-xs font-semibold text-slate-700 mb-1">Explanation:</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 mt-8">
            <Button onClick={() => setExamState("intro")} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" /> Retake Exam
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              <BarChart3 className="w-4 h-4 mr-2" /> View Full Progress
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Active Exam View
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-white">{selectedSubject} Mock Exam</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full ${timeLeft < 300 ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-white"}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              disabled={answeredCount === 0}
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        {/* Question Panel */}
        <div className="flex-1">
          {currentQ && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-slate-400">
                  Question {currentIndex + 1} • {currentQ.difficulty}
                </span>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    flagged.has(currentQ.id)
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  {flagged.has(currentQ.id) ? "Flagged" : "Flag"}
                </button>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 leading-relaxed mb-6">{currentQ.text}</h2>
              <div className="space-y-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectAnswer(currentQ.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentQ.id] === opt.id
                        ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold text-sm mr-2">{opt.id}.</span>
                    <span className="text-sm text-slate-700">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="bg-white border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <Button
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex === questions.length - 1}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Question Map Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 sticky top-20">
            <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Question Map</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${
                    i === currentIndex
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                      : answers[q.id]
                        ? flagged.has(q.id)
                          ? "bg-amber-100 text-amber-700 border border-amber-300"
                          : "bg-emerald-100 text-emerald-700"
                        : flagged.has(q.id)
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-200" />
                <span className="text-slate-500">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-200" />
                <span className="text-slate-500">Flagged ({flagged.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-200" />
                <span className="text-slate-500">Unanswered ({questions.length - answeredCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
