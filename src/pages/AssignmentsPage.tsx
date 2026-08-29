import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

type Tab = "pending" | "graded" | "all";

const statusLabels: Record<string, string> = {
  assigned: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  graded: "Graded",
  returned: "Needs revision",
};

const statusVariants: Record<string, "warning" | "info" | "success" | "error" | "neutral"> = {
  assigned: "warning",
  in_progress: "info",
  submitted: "info",
  graded: "success",
  returned: "error",
};

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("pending");
  const assignments = useQuery(api.assignments.getPending);

  const assignmentList = assignments ?? [];
  const filtered =
    tab === "pending"
      ? assignmentList.filter(
          (a) => a.status === "assigned" || a.status === "in_progress",
        )
      : tab === "graded"
        ? assignmentList.filter((a) => a.status === "graded" || a.status === "submitted")
        : assignmentList;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <PageHeader
          title="Assignments"
          description="View, submit, and track your assignment progress"
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "pending" as Tab, label: "Needs attention" },
            { key: "graded" as Tab, label: "Completed" },
            { key: "all" as Tab, label: "All" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Assignment list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={
              tab === "pending"
                ? "No pending assignments"
                : tab === "graded"
                  ? "No graded assignments yet"
                  : "No assignments yet"
            }
            description={
              tab === "pending"
                ? "All caught up! Assignments from your tutors will appear here when assigned."
                : tab === "graded"
                  ? "Graded assignments with feedback will appear here."
                  : "Assignments from your tutors will appear here."
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => {
              const isOverdue =
                (a.status === "assigned" || a.status === "in_progress") &&
                new Date(a.dueDate) < new Date();
              const dueDate = new Date(a.dueDate);
              const daysUntilDue = Math.ceil(
                (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={a._id}
                  className="bg-white rounded-xl border border-stone-200/80 p-5 hover:border-stone-300/80 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        a.status === "graded"
                          ? "bg-emerald-100"
                          : isOverdue
                            ? "bg-red-100"
                            : "bg-amber-100"
                      }`}
                    >
                      {a.status === "graded" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : isOverdue ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">
                          {a.title}
                        </h3>
                        <StatusBadge
                          label={
                            isOverdue
                              ? "Overdue"
                              : statusLabels[a.status] || a.status
                          }
                          variant={
                            isOverdue
                              ? "error"
                              : statusVariants[a.status] || "neutral"
                          }
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {a.subject} · Assigned by {a.teacherName}
                      </p>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                        {a.description}
                      </p>

                      {/* Grade and feedback */}
                      {a.grade && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <p className="text-sm font-bold text-emerald-700">
                            Grade: {a.grade}
                          </p>
                          {a.feedback && (
                            <p className="text-xs text-emerald-600 mt-1">
                              {a.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Due date info */}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-slate-400">
                          {a.status === "graded"
                            ? `Graded on ${dueDate.toLocaleDateString()}`
                            : isOverdue
                              ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? "s" : ""}`
                              : daysUntilDue === 0
                                ? "Due today"
                                : daysUntilDue === 1
                                  ? "Due tomorrow"
                                  : daysUntilDue > 0
                                    ? `Due in ${daysUntilDue} days`
                                    : `Due ${dueDate.toLocaleDateString()}`}
                        </span>
                      </div>
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
