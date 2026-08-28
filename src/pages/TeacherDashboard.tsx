import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { liveSessions } from "@/lib/data";
import {
  LayoutDashboard,
  LogOut,
  Video,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Star,
  MessageCircle,
  Plus,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const mySessions = liveSessions.filter((s) => s.status === "scheduled").slice(0, 4);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-md shadow-teal-600/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Teacher Dashboard</h1>
              <p className="text-xs text-slate-400">Manage your classes and students</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2" size="sm">
              <Plus className="w-4 h-4" /> Create Class
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Classes", value: "3", icon: Video, color: "text-teal-500", bg: "bg-teal-50" },
            { label: "This Week's Earnings", value: "৳45,000", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Total Students", value: "480", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Avg Rating", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-stone-200/80">
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
            {/* Today's Classes */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mySessions.map((session) => {
                    const date = new Date(session.scheduledAt);
                    return (
                      <div key={session.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{session.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {session.enrolledCount}/{session.maxStudents} students • {session.durationMinutes}min
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-slate-900">
                            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
                          onClick={() => navigate(`/classroom?title=${encodeURIComponent(session.title)}&teacher=You`)}
                        >
                          <Play className="w-3.5 h-3.5" /> Start
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Students */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Recent Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Tanvir H.", "Nusrat J.", "Arif C.", "Sabrina M.", "Imran K."].map((name, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{name}</p>
                        <p className="text-xs text-slate-400">{3 + i} sessions completed</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-sm">Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium w-8">{day}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${i < 5 ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-slate-400"}`}>
                        {i < 5 ? "9:00 AM - 5:00 PM" : "Unavailable"}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 text-xs" size="sm">Edit Availability</Button>
              </CardContent>
            </Card>

            {/* Pending */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-sm">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { text: "2 assignments to review", color: "bg-amber-50 text-amber-700 border-amber-100" },
                    { text: "1 new booking request", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                    { text: "3 student messages", color: "bg-teal-50 text-teal-700 border-teal-100" },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-xs font-medium ${item.color}`}>
                      {item.text}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
