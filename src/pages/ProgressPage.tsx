import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, TrendingUp, Clock, BookOpen, Flame, Target } from "lucide-react";
import { useNavigate } from "react-router";

export default function ProgressPage() {
  const navigate = useNavigate();
  const progress = useQuery(api.progress.get);
  const subjectBreakdown = useQuery(api.progress.getSubjectBreakdown);

  const subjects = subjectBreakdown ?? [];

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4"><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
          <h1 className="text-2xl font-extrabold text-slate-900">Your Progress</h1>
          <p className="text-sm text-slate-500 mt-1">Track your learning journey</p>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Grid */}
        {progress ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "Hours Learned", value: `${progress.totalHoursLearned}h`, color: "bg-teal-50 text-teal-600" },
              { icon: BookOpen, label: "Classes Completed", value: progress.classesCompleted, color: "bg-indigo-50 text-indigo-600" },
              { icon: Flame, label: "Current Streak", value: `${progress.streakDays} days`, color: "bg-amber-50 text-amber-600" },
              { icon: Target, label: "Subjects Studied", value: progress.subjectsStudied.length, color: "bg-purple-50 text-purple-600" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-5 text-center">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-3`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={TrendingUp} title="No progress yet" description="Complete your first lesson to start tracking your progress." actionLabel="Find a Tutor" actionPath="/teachers" />
        )}

        {/* Subject Breakdown */}
        {subjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
            <h3 className="text-base font-bold text-slate-900 mb-4">Subject Breakdown</h3>
            <div className="space-y-3">
              {subjects.map((s) => {
                const maxHours = Math.max(...subjects.map((x) => x.hoursLearned), 1);
                const pct = (s.hoursLearned / maxHours) * 100;
                return (
                  <div key={s.subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{s.subject}</span>
                      <span className="text-xs text-slate-500">{s.lessonsCompleted} lessons • {s.hoursLearned}h</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subjects Studied */}
        {progress && progress.subjectsStudied.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
            <h3 className="text-base font-bold text-slate-900 mb-3">Subjects You're Studying</h3>
            <div className="flex flex-wrap gap-2">
              {progress.subjectsStudied.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg border border-teal-100">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
