import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { EmptyClassesIllustration } from "@/components/images/EmptyIllustrations";
import {
  Video,
  Users,
  BookOpen,
  MessageCircle,
  Calendar,
  Play,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Target,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lessons = useQuery(api.lessons.listUpcoming, {});
  const progress = useQuery(api.progress.get);
  const assignments = useQuery(api.assignments.getPending);
  const profileStatus = useQuery(api.users.getProfileStatus);

  const upcomingLessons = lessons ?? [];
  const nextLesson = upcomingLessons[0];
  const pendingAssignments = assignments ?? [];

  const needsProfile =
    profileStatus && !profileStatus.isComplete && profileStatus.role === "student";

  // Determine the "next step" for the user
  const getNextStep = () => {
    if (needsProfile) {
      return {
        title: "Complete your profile",
        description:
          "Fill in your subjects and learning goals so we can recommend the right tutors for you.",
        action: "Complete profile",
        path: "/profile",
        icon: Target,
        color: "bg-amber-50 text-amber-600",
      };
    }
    if (pendingAssignments.length > 0) {
      return {
        title: `${pendingAssignments.length} assignment${pendingAssignments.length > 1 ? "s" : ""} need${pendingAssignments.length === 1 ? "s" : ""} attention`,
        description: `You have pending assignments to submit. Don't fall behind.`,
        action: "View assignments",
        path: "/assignments",
        icon: BookOpen,
        color: "bg-amber-50 text-amber-600",
      };
    }
    if (nextLesson) {
      const date = new Date(nextLesson.scheduledAt);
      const now = new Date();
      const hoursUntil = Math.round(
        (date.getTime() - now.getTime()) / (1000 * 60 * 60),
      );
      const timeLabel =
        hoursUntil < 1
          ? "Starting soon"
          : hoursUntil < 24
            ? `In ${hoursUntil} hours`
            : `In ${Math.round(hoursUntil / 24)} days`;

      return {
        title: `Next lesson: ${nextLesson.title}`,
        description: `With ${nextLesson.teacherName} · ${timeLabel} · ${nextLesson.durationMinutes} min`,
        action: "Open classroom",
        path: `/classroom?session=${nextLesson._id}`,
        icon: Video,
        color: "bg-teal-50 text-teal-600",
      };
    }
    return {
      title: "Find a tutor",
      description:
        "Browse verified tutors, check availability, and book your first lesson.",
      action: "Browse tutors",
      path: "/teachers",
      icon: Users,
      color: "bg-teal-50 text-teal-600",
    };
  };

  const nextStep = getNextStep();

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <PageHeader
          title={`Hi${user?.name ? `, ${user.name}` : ""}`}
          description="Here's what's happening with your learning"
        />

        {/* Profile completion banner */}
        {needsProfile && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Complete your learning profile
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Your profile is {profileStatus.completionPercentage}% complete.
                  Complete it to get better tutor recommendations.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              onClick={() => navigate("/profile")}
            >
              Complete profile
            </Button>
          </div>
        )}

        {/* Next step panel */}
        <div className="bg-white rounded-xl border border-stone-200/80 p-5 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Next step
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${nextStep.color} flex items-center justify-center shrink-0`}
              >
                <nextStep.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {nextStep.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {nextStep.description}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white shrink-0 gap-1.5"
              onClick={() => navigate(nextStep.path)}
            >
              {nextStep.action} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={Calendar}
            label="Upcoming lessons"
            value={upcomingLessons.length}
            iconBg="bg-teal-50"
          />
          <StatCard
            icon={BookOpen}
            label="Pending assignments"
            value={pendingAssignments.length}
            iconBg="bg-amber-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Hours studied"
            value={progress?.totalHoursLearned ?? 0}
            iconBg="bg-indigo-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Lessons completed"
            value={progress?.classesCompleted ?? 0}
            iconBg="bg-emerald-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Lessons */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" /> Upcoming lessons
                </h3>
                {upcomingLessons.length > 0 && (
                  <button
                    onClick={() => navigate("/lessons")}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    View all
                  </button>
                )}
              </div>
              {upcomingLessons.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="No upcoming lessons"
                  description="Book your first lesson to see it here. Find a tutor who teaches your subject."
                  actionLabel="Find a tutor"
                  actionPath="/teachers"
                  illustration={
                    <EmptyClassesIllustration className="w-full max-w-[200px]" />
                  }
                />
              ) : (
                <div className="space-y-2">
                  {upcomingLessons.slice(0, 4).map((lesson) => {
                    const date = new Date(lesson.scheduledAt);
                    return (
                      <button
                        key={lesson._id}
                        onClick={() =>
                          navigate(`/classroom?session=${lesson._id}`)
                        }
                        className="w-full flex items-center gap-4 p-3 bg-[#FAFAF8] rounded-xl hover:bg-teal-50/50 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {lesson.teacherName} · {lesson.durationMinutes} min ·{" "}
                            {lesson.subject}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-slate-900">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-slate-400">
                            {date.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pending Assignments */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" /> Pending
                  assignments
                </h3>
                {pendingAssignments.length > 0 && (
                  <button
                    onClick={() => navigate("/assignments")}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    View all
                  </button>
                )}
              </div>
              {pendingAssignments.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No pending assignments"
                  description="Assignments from your tutors will appear here."
                />
              ) : (
                <div className="space-y-2">
                  {pendingAssignments.slice(0, 4).map((a) => {
                    const dueDate = new Date(a.dueDate);
                    const isOverdue = dueDate.getTime() < Date.now();
                    return (
                      <div
                        key={a._id}
                        className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {a.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {a.subject} · Due{" "}
                            {dueDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <StatusBadge
                          label={isOverdue ? "Overdue" : "Due soon"}
                          variant={isOverdue ? "error" : "warning"}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning progress */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-teal-500" /> Your progress
              </h3>
              {progress ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Hours learned
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {progress.totalHoursLearned}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Classes completed
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {progress.classesCompleted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Current streak
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {progress.streakDays} days 🔥
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Subjects studied
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {progress.subjectsStudied.length}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate("/progress")}
                  >
                    View full progress
                  </Button>
                </div>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No progress yet"
                  description="Your learning progress will appear after your first lesson."
                />
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Quick actions
              </h3>
              <div className="space-y-1.5">
                {[
                  { label: "Find a tutor", icon: Users, path: "/teachers" },
                  { label: "My lessons", icon: Video, path: "/lessons" },
                  { label: "Messages", icon: MessageCircle, path: "/messages" },
                  {
                    label: "AI assistant",
                    icon: Sparkles,
                    path: "/ai-assistant",
                  },
                ].map((link, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(link.path)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors text-left"
                  >
                    <link.icon className="w-4 h-4" /> {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent learning */}
            {progress &&
              progress.subjectsStudied.length > 0 &&
              progress.streakDays > 0 && (
                <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl border border-teal-200/60 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-teal-800">
                      Keep it up!
                    </h3>
                  </div>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    You've been learning for {progress.streakDays} days
                    straight. {progress.classesCompleted} lessons completed across{" "}
                    {progress.subjectsStudied.length} subjects.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
