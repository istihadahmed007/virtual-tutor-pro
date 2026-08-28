import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, Video, Clock, CheckCircle, Calendar, Play } from "lucide-react";
import { useNavigate } from "react-router";

export default function LessonsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"upcoming" | "completed" | "all">("upcoming");
  const allLessons = useQuery(api.lessons.listUpcoming, {});

  const lessons = allLessons ?? [];
  const filtered = tab === "upcoming"
    ? lessons.filter((l) => l.status === "scheduled")
    : tab === "completed"
      ? lessons.filter((l) => l.status === "completed")
      : lessons;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4"><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
          <h1 className="text-2xl font-extrabold text-slate-900">My Lessons</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage your learning sessions</p>
          <div className="flex gap-2 mt-4">
            {(["upcoming", "completed", "all"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState icon={Video} title="No lessons found" description={tab === "upcoming" ? "Book your first lesson to get started." : "Lessons you complete will appear here."} actionLabel={tab === "upcoming" ? "Find a Tutor" : undefined} actionPath={tab === "upcoming" ? "/teachers" : undefined} />
        ) : (
          <div className="space-y-3">
            {filtered.map((lesson) => {
              const date = new Date(lesson.scheduledAt);
              return (
                <div key={lesson._id} className="bg-white rounded-2xl border border-stone-200/80 p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/classroom?session=${lesson._id}`)}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${lesson.status === "completed" ? "bg-emerald-500" : "bg-gradient-to-br from-teal-500 to-teal-600"}`}>
                    {lesson.status === "completed" ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{lesson.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{lesson.teacherName} • {lesson.subject} • {lesson.durationMinutes}min</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-900">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    <p className="text-xs text-slate-400">{date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${lesson.status === "completed" ? "bg-emerald-50 text-emerald-700" : lesson.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-700"}`}>{lesson.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
