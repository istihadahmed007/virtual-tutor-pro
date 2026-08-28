import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  LogOut,
  Target,
  TrendingUp,
  Zap,
  BookOpen,
  Brain,
  Users,
  Clock,
  Flame,
  ArrowRight,
  Trophy,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router";
import { weeklyProgress } from "@/lib/data";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 14);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
                <p className="text-xs text-slate-400 -mt-0.5">Welcome back{user?.name ? `, ${user.name}` : ""}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Countdown Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-full text-xs font-semibold mb-3">
                    <Target className="w-3 h-3" />
                    Target Exam
                  </div>
                  <h2 className="text-2xl font-extrabold">BUET & University Admission</h2>
                  <p className="text-indigo-200 text-sm mt-1">HSC 2025 Batch • Countdown Active</p>
                </div>
                <div className="text-center bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
                  <p className="text-5xl font-extrabold leading-none">14</p>
                  <p className="text-xs text-indigo-200 mt-1 font-medium">DAYS LEFT</p>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-indigo-200 mb-2">
                  <span>Preparation Progress</span>
                  <span className="font-semibold text-white">72%</span>
                </div>
                <div className="w-full bg-white/15 rounded-full h-2.5">
                  <div className="bg-white rounded-full h-2.5 shadow-sm" style={{ width: "72%" }} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Brain, label: "AI Tutor", sub: "Ask anything", color: "bg-indigo-500", route: "/ai-coach" },
                  { icon: BookOpen, label: "Mock Exam", sub: "Timed test", color: "bg-emerald-500", route: "/exam" },
                  { icon: Users, label: "Find Tutor", sub: "Book session", color: "bg-amber-500", route: "/tutors" },
                  { icon: TrendingUp, label: "Progress", sub: "View stats", color: "bg-blue-500", route: "/progress" },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.route)}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group cursor-pointer active:scale-95"
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{action.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  This Week's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyProgress.map((day, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-slate-500 w-8">{day.day}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-teal-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${(day.questions / 50) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-16 text-right">
                            {day.correct}/{day.questions} ✓
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 w-12 text-right">{day.hours}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Practice */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Recommended Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", topic: "Complex Numbers", reason: "Weakest topic (45% mastery)", priority: "high" },
                    { subject: "Physics", topic: "Thermodynamics", reason: "Needs improvement (60% mastery)", priority: "medium" },
                    { subject: "Mathematics", topic: "Limits & Series", reason: "Can boost score (68% mastery)", priority: "medium" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${item.priority === "high" ? "bg-red-500" : "bg-amber-500"}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{item.topic}</p>
                        <p className="text-xs text-slate-400">{item.subject} • {item.reason}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate("/exam")}>
                        Practice
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats Sidebar */}
          <div className="space-y-6">
            {/* Streak */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">14 🔥</p>
              <p className="text-sm text-slate-500">Day Study Streak</p>
              <p className="text-xs text-amber-600 font-semibold mt-1">Personal best: 21 days</p>
            </div>

            {/* Score Cards */}
            <div className="space-y-3">
              {[
                { label: "Overall Accuracy", value: "82%", trend: "+5% this week", icon: Trophy, color: "text-emerald-500" },
                { label: "Questions Solved", value: "1,247", trend: "235 this week", icon: BookOpen, color: "text-indigo-500" },
                { label: "Study Hours", value: "42.5h", trend: "18.5h this week", icon: Clock, color: "text-purple-500" },
                { label: "Avg Session Time", value: "45 min", trend: "Optimal range", icon: Target, color: "text-teal-500" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 ml-13">{stat.trend}</p>
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <Card className="border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-sm">Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs font-semibold text-indigo-700">Math Tutoring</p>
                    <p className="text-xs text-indigo-500 mt-1">Today, 5:00 PM with Dr. Rafiq</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                    <p className="text-xs font-semibold text-teal-700">Physics Mock Exam</p>
                    <p className="text-xs text-teal-500 mt-1">Tomorrow, 10:00 AM</p>
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
