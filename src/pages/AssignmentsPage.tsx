import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"pending" | "submitted" | "all">("pending");
  const assignments = useQuery(api.assignments.getPending);

  const assignmentList = assignments ?? [];
  const filtered = tab === "pending"
    ? assignmentList
    : tab === "submitted"
      ? assignmentList.filter((a) => a.status === "submitted")
      : assignmentList;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4"><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
          <h1 className="text-2xl font-extrabold text-slate-900">Assignments</h1>
          <div className="flex gap-2 mt-4">
            {(["pending", "submitted", "all"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="No assignments" description="Assignments from your tutors will appear here." />
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => {
              const isOverdue = a.status === "assigned" && new Date(a.dueDate) < new Date();
              return (
                <div key={a._id} className="bg-white rounded-2xl border border-stone-200/80 p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.status === "graded" ? "bg-emerald-100" : isOverdue ? "bg-red-100" : "bg-amber-100"}`}>
                      {a.status === "graded" ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : isOverdue ? <AlertCircle className="w-5 h-5 text-red-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${a.status === "graded" ? "bg-emerald-50 text-emerald-700" : a.status === "submitted" ? "bg-blue-50 text-blue-700" : isOverdue ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{a.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{a.subject} • by {a.teacherName}</p>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{a.description}</p>
                      {a.grade && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm font-bold text-emerald-700">Grade: {a.grade}</p>
                          {a.feedback && <p className="text-xs text-emerald-600 mt-1">{a.feedback}</p>}
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-2">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                    </div>
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
