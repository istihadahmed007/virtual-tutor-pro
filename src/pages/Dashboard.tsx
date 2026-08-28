import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { EmptyClassesIllustration, EmptyProgressIllustration } from "@/components/images/EmptyIllustrations";
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
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const sessions = useQuery(api.sessions.listUpcoming, {});
  const profileStatus = useQuery(api.users.getProfileStatus);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const upcomingSessions = sessions ?? [];
  const nextSession = upcomingSessions[0];

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-md shadow-teal-600/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Welcome back{user?.name ? `, ${user.name}` : ""} 👋
              </h1>
              <p className="text-xs text-slate-400">
                Here's what's happening with your learning
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Profile completion prompt */}
        {profileStatus &&
          !profileStatus.isComplete &&
          profileStatus.role === "teacher" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Complete your teacher profile
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Your profile is {profileStatus.completionPercentage}% complete.
                  Complete it to get verified and start teaching.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => navigate("/teacher-dashboard")}
              >
                Complete Profile
              </Button>
            </div>
          )}

        {/* Upcoming Class CTA */}
        {nextSession && (
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-xl shadow-teal-600/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-teal-100 uppercase tracking-wider mb-1">
                  Next Class
                </p>
                <h2 className="text-2xl font-extrabold">
                  {nextSession.title}
                </h2>
                <p className="text-teal-200 text-sm mt-1">
                  with {nextSession.teacherName} •{" "}
                  {nextSession.durationMinutes} min •{" "}
                  {nextSession.sessionType}
                </p>
              </div>
              <Button
                onClick={() =>
                  navigate(`/classroom?session=${nextSession._id}`)
                }
                className="bg-white text-teal-700 hover:bg-teal-50 font-bold shadow-lg"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" /> Join Class
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: Users,
                  label: "Find Teachers",
                  color: "bg-teal-500",
                  route: "/teachers",
                },
                {
                  icon: Video,
                  label: "Live Classes",
                  color: "bg-indigo-500",
                  route: "/classes",
                },
                {
                  icon: MessageCircle,
                  label: "Messages",
                  color: "bg-amber-500",
                  route: "/messages",
                },
                {
                  icon: BookOpen,
                  label: "Community",
                  color: "bg-purple-500",
                  route: "/community",
                },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.route)}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all text-left group cursor-pointer active:scale-95"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {action.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-teal-500" /> Upcoming
                Classes
              </h3>
              {upcomingSessions.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="No upcoming classes"
                  description="Your learning journey starts here. Find a teacher and book your first live session to get started."
                  actionLabel="Find a Teacher"
                  actionPath="/teachers"
                  illustration={<EmptyClassesIllustration className="w-full max-w-[200px]" />}
                />
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 5).map((session) => {
                    const date = new Date(session.scheduledAt);
                    return (
                      <div
                        key={session._id}
                        className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-teal-50/50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/classroom?session=${session._id}`)
                        }
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {session.teacherName} •{" "}
                            {session.durationMinutes}min •{" "}
                            {session.sessionType}
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
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Find a Teacher", icon: Users, path: "/teachers" },
                  { label: "Browse Classes", icon: Video, path: "/classes" },
                  { label: "Community", icon: BookOpen, path: "/community" },
                  { label: "Messages", icon: MessageCircle, path: "/messages" },
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

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-teal-500" /> Your
                Progress
              </h3>
              <EmptyState
                icon={TrendingUp}
                title="No progress yet"
                description="Your learning progress will appear after your first class."
                illustration={<EmptyProgressIllustration className="w-full max-w-[180px]" />}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
