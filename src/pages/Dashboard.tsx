import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { liveSessions, conversations, teachers } from "@/lib/data";
import {
  LayoutDashboard,
  LogOut,
  Video,
  Clock,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Flame,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const upcomingClasses = liveSessions
    .filter((s) => s.status === "scheduled")
    .slice(0, 3);

  const myTeachers = teachers.slice(0, 3);

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
              <p className="text-xs text-slate-400">Here's what's happening with your learning</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Upcoming Class CTA */}
        {upcomingClasses[0] && (
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-xl shadow-teal-600/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-teal-100 uppercase tracking-wider mb-1">Next Class Starts In</p>
                <h2 className="text-2xl font-extrabold">{upcomingClasses[0].title}</h2>
                <p className="text-teal-200 text-sm mt-1">
                  with {upcomingClasses[0].teacherName} • {upcomingClasses[0].durationMinutes} min • {upcomingClasses[0].sessionType}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                  <p className="text-3xl font-extrabold">23</p>
                  <p className="text-[10px] text-teal-200 font-medium">MINUTES</p>
                </div>
                <Button
                  onClick={() => navigate(`/classroom?title=${encodeURIComponent(upcomingClasses[0].title)}&teacher=${encodeURIComponent(upcomingClasses[0].teacherName)}`)}
                  className="bg-white text-teal-700 hover:bg-teal-50 font-bold shadow-lg"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" /> Join Class
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Users, label: "Find Teachers", color: "bg-teal-500", route: "/teachers" },
                { icon: Video, label: "Live Classes", color: "bg-indigo-500", route: "/classes" },
                { icon: MessageCircle, label: "Messages", color: "bg-amber-500", route: "/messages" },
                { icon: BookOpen, label: "Community", color: "bg-purple-500", route: "/community" },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.route)}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all text-left group cursor-pointer active:scale-95"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{action.label}</p>
                </button>
              ))}
            </div>

            {/* Upcoming Classes */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.map((session) => {
                    const date = new Date(session.scheduledAt);
                    return (
                      <div key={session.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-teal-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/classroom?title=${encodeURIComponent(session.title)}&teacher=${encodeURIComponent(session.teacherName)}`)}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{session.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {session.teacherName} • {session.durationMinutes}min • {session.sessionType}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-slate-900">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                          <p className="text-xs text-slate-400">
                            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shrink-0">
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* My Teachers */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  My Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {myTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => navigate(`/teachers/${teacher.id}`)}
                      className="p-4 bg-stone-50 rounded-xl hover:bg-teal-50/50 transition-colors cursor-pointer text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
                        {teacher.name.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-2 truncate">{teacher.name}</p>
                      <p className="text-xs text-slate-500">{teacher.subjects[0]}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                        <span className="text-[10px] text-emerald-600 font-medium">Online</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Learning Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Classes", value: "12", icon: Video, color: "text-teal-500" },
                  { label: "Hours", value: "18.5", icon: Clock, color: "text-indigo-500" },
                  { label: "Streak", value: "7 🔥", icon: Flame, color: "text-amber-500" },
                  { label: "Teachers", value: "3", icon: Users, color: "text-purple-500" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded-xl text-center">
                    <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                    <p className="text-lg font-extrabold text-slate-900">{stat.value}</p>
                    <p className="text-[10px] text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-500" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => navigate("/messages")}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {conv.participantNames[0]?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{conv.participantNames[0]}</p>
                        <p className="text-[10px] text-slate-500 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-500" />
                  Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div onClick={() => navigate("/teachers")} className="p-3 bg-teal-50 rounded-xl border border-teal-100 cursor-pointer hover:bg-teal-100/50 transition-colors">
                    <p className="text-xs font-bold text-teal-700">📚 IELTS Speaking Practice</p>
                    <p className="text-[10px] text-teal-600 mt-1">Based on your recent activity</p>
                  </div>
                  <div onClick={() => navigate("/teachers")} className="p-3 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-100/50 transition-colors">
                    <p className="text-xs font-bold text-amber-700">🎯 Math Exam Prep</p>
                    <p className="text-[10px] text-amber-600 mt-1">Join Dr. Rafiq's upcoming session</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
