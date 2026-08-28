import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studyTopics, weeklyProgress } from "@/lib/data";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Clock,
  Trophy,
  BarChart3,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";

function MasteryBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color} transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const navigate = useNavigate();

  const totalQuestions = weeklyProgress.reduce((s, d) => s + d.questions, 0);
  const totalCorrect = weeklyProgress.reduce((s, d) => s + d.correct, 0);
  const totalHours = weeklyProgress.reduce((s, d) => s + d.hours, 0);
  const avgAccuracy = Math.round((totalCorrect / totalQuestions) * 100);

  const weakTopics = studyTopics.filter((t) => t.mastery < 60);
  const strongTopics = studyTopics.filter((t) => t.mastery >= 80);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Progress & Analytics</h1>
            <p className="text-xs text-slate-400">Track your mastery across all subjects</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Trophy, label: "Overall Accuracy", value: `${avgAccuracy}%`, color: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: Target, label: "Total Questions", value: totalQuestions.toLocaleString(), color: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Clock, label: "Study Hours", value: `${totalHours}h`, color: "text-purple-500", bg: "bg-purple-50" },
            { icon: Zap, label: "Strong Topics", value: strongTopics.length.toString(), color: "text-amber-500", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Chart */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  Weekly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyProgress.map((day, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-slate-500 w-8">{day.day}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-teal-500 h-3 rounded-full transition-all duration-700"
                              style={{ width: `${(day.correct / 50) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-20 text-right">
                            {day.correct}/{day.questions} ({Math.round((day.correct / day.questions) * 100)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 w-14 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{day.hours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Topic Mastery */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  Topic Mastery Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyTopics
                    .sort((a, b) => a.mastery - b.mastery)
                    .map((topic, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{topic.topic}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{topic.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{topic.mastery}%</span>
                            {topic.mastery >= 80 ? (
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            ) : topic.mastery < 60 ? (
                              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                            ) : null}
                          </div>
                        </div>
                        <MasteryBar
                          value={topic.mastery}
                          color={
                            topic.mastery >= 80
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                              : topic.mastery >= 60
                                ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                : "bg-gradient-to-r from-red-500 to-red-400"
                          }
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Last practiced: {topic.lastPracticed}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weak Areas */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weakTopics.map((topic, i) => (
                    <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-red-800">{topic.topic}</span>
                        <span className="text-xs font-bold text-red-600">{topic.mastery}%</span>
                      </div>
                      <p className="text-[10px] text-red-500 mt-1">{topic.subject} • {topic.lastPracticed}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs border-red-200 text-red-700 hover:bg-red-100"
                        onClick={() => navigate("/exam")}
                      >
                        Practice Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strong Areas */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strongTopics.map((topic, i) => (
                    <div key={i} className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-800">{topic.topic}</span>
                        <span className="text-xs font-bold text-emerald-600">{topic.mastery}%</span>
                      </div>
                      <p className="text-[10px] text-emerald-500 mt-1">{topic.subject}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendation */}
            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-indigo-900">AI Recommendation</h3>
                </div>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Focus on <strong>Complex Numbers</strong> and <strong>Thermodynamics</strong> — improving these two topics by 20% could boost your overall score by 8-12%. I recommend 30 minutes of targeted practice daily.
                </p>
                <Button
                  size="sm"
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                  onClick={() => navigate("/ai-coach")}
                >
                  Get AI Study Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
