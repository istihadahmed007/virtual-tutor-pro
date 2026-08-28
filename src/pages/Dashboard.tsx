import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { EmptyClassesIllustration } from "@/components/images/EmptyIllustrations";
import {
  LayoutDashboard,
  LogOut,
  Video,
  Users,
  BookOpen,
  MessageCircle,
  Calendar,
  Play,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const lessons = useQuery(api.lessons.listUpcoming, {});
  const progress = useQuery(api.progress.get);
  const assignments = useQuery(api.assignments.getPending);
  const teachers = useQuery(api.teachers.list);
  const profileStatus = useQuery(api.users.getProfileStatus);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const upcomingLessons = lessons ?? [];
  const nextLesson = upcomingLessons[0];
  const pendingAssignments = assignments ?? [];
  const tutorList = teachers ?? [];

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-md shadow-teal-600/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Welcome back{user?.name ? `, ${user.name}` : ""} 👋</h1>
              <p className="text-xs text-slate-400">Here's what's happening with your learning</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Profile completion prompt */}
        {profileStatus && !profileStatus.isComplete && profileStatus.role === "student" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-amber-800">Complete your learning profile</p>
              <p className="text-xs text-amber-600 mt-1">Your profile is {profileStatus.completionPercentage}% complete. Complete it to get better tutor recommendations.</p>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => navigate("/profile")}>Complete Profile</Button>
          </div>
        )}

        {/* Next Lesson CTA */}
        {nextLesson && (
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-xl shadow-teal-600/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-teal-100 uppercase tracking-wider mb-1">Next Lesson</p>
                <h2 className="text-2xl font-extrabold">{nextLesson.title}</h2>
                <p className="text-teal-200 text-sm mt-1">with {nextLesson.teacherName} • {nextLesson.durationMinutes} min • {nextLesson.subject}</p>
              </div>
              <Button onClick={() => navigate(`/classroom?session=${nextLesson._id}`)} className="bg-white text-teal-700 hover:bg-teal-50 font-bold shadow-lg" size="lg">
                <Play className="w-4 h-4 mr-2" /> Join Lesson
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Users, label: "Find Tutors", color: "bg-teal-500", route: "/teachers" },
                { icon: Video, label: "My Lessons", color: "bg-indigo-500", route: "/lessons" },
                { icon: MessageCircle, label: "Messages", color: "bg-amber-500", route: "/messages" },
                { icon: Sparkles, label: "AI Assistant", color: "bg-purple-500", route: "/ai-assistant" },
              ].map((action, i) => (
                <button key={i} onClick={() => navigate(action.route)} className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all text-left group cursor-pointer active:scale-95">
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{action.label}</p>
                </button>
              ))}
            </div>

            {/* Upcoming Lessons */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-teal-500" /> Upcoming Lessons
              </h3>
              {upcomingLessons.length === 0 ? (
                <EmptyState icon={Video} title="No upcoming lessons" description="Book your first lesson to see it here." actionLabel="Find a Tutor" actionPath="/teachers" illustration={<EmptyClassesIllustration className="w-full max-w-[200px]" />} />
              ) : (
                <div className="space-y-3">
                  {upcomingLessons.slice(0, 5).map((lesson) => {
                    const date = new Date(lesson.scheduledAt);
                    return (
                      <div key={lesson._id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-teal-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/classroom?session=${lesson._id}`)}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{lesson.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{lesson.teacherName} • {lesson.durationMinutes}min • {lesson.subject}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-slate-900">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                          <p className="text-xs text-slate-400">{date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"><Play className="w-3.5 h-3.5" /></Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pending Assignments */}
            {pendingAssignments.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-amber-500" /> Pending Assignments
                </h3>
                <div className="space-y-3">
                  {pendingAssignments.slice(0, 3).map((a) => (
                    <div key={a._id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900">{a.title}</p>
                        <p className="text-xs text-slate-500">{a.subject} • Due {new Date(a.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-teal-500" /> Your Progress
              </h3>
              {progress ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Hours Learned</span>
                    <span className="text-sm font-bold text-slate-900">{progress.totalHoursLearned}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Classes Completed</span>
                    <span className="text-sm font-bold text-slate-900">{progress.classesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Current Streak</span>
                    <span className="text-sm font-bold text-slate-900">{progress.streakDays} days 🔥</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Subjects Studied</span>
                    <span className="text-sm font-bold text-slate-900">{progress.subjectsStudied.length}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate("/progress")}>View Full Progress</Button>
                </div>
              ) : (
                <EmptyState icon={TrendingUp} title="No progress yet" description="Your learning progress will appear after your first lesson." />
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "Find a Tutor", icon: Users, path: "/teachers" },
                  { label: "My Lessons", icon: Video, path: "/lessons" },
                  { label: "Assignments", icon: BookOpen, path: "/assignments" },
                  { label: "Messages", icon: MessageCircle, path: "/messages" },
                  { label: "AI Assistant", icon: Sparkles, path: "/ai-assistant" },
                  { label: "Calendar", icon: Calendar, path: "/calendar" },
                ].map((link, i) => (
                  <button key={i} onClick={() => navigate(link.path)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors text-left">
                    <link.icon className="w-4 h-4" /> {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Tutors */}
            {tutorList.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Recommended Tutors</h3>
                <div className="space-y-3">
                  {tutorList.slice(0, 3).map((t) => (
                    <div key={t._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors" onClick={() => navigate(`/teachers/${t.userId}`)}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{t.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{t.title}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


