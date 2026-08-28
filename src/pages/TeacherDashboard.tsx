import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const sessions = useQuery(api.sessions.listByTeacher);
  const teacherProfile = useQuery(api.teachers.get, { teacherId: user?._id || "" });
  const bookings = useQuery(api.bookings.listByTeacher);

  const sessionList = sessions ?? [];
  const bookingList = bookings ?? [];
  const upcomingSessions = sessionList
    .filter((s) => s.status === "scheduled" && s.scheduledAt > Date.now())
    .sort((a, b) => a.scheduledAt - b.scheduledAt)
    .slice(0, 4);

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
            <Button variant="outline" size="sm" className="gap-2" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Verification Status */}
        {teacherProfile && !teacherProfile.isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <p className="text-sm font-bold text-amber-800">Your profile is under review</p>
            <p className="text-xs text-amber-600 mt-1">Our team is reviewing your credentials. You'll be notified once verified.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Sessions", value: sessionList.length.toString(), icon: Video, color: "text-teal-500", bg: "bg-teal-50" },
            { label: "Total Bookings", value: bookingList.length.toString(), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Students", value: teacherProfile?.totalStudents?.toString() || "0", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Rating", value: teacherProfile?.rating?.toString() || "New", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
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
                  <Calendar className="w-4 h-4 text-teal-500" /> Your Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <EmptyState icon={Video} title="No upcoming sessions" description="Create a live session to start teaching students." actionLabel="Create Session" />
                ) : (
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => {
                      const date = new Date(session.scheduledAt);
                      return (
                        <div key={session._id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
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
                              {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                            <p className="text-xs text-slate-400">
                              {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
                            onClick={() => navigate(`/classroom?session=${session._id}`)}>
                            <Play className="w-3.5 h-3.5" /> Start
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Bookings */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-500" /> Pending Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingList.filter((b) => b.status === "pending").length === 0 ? (
                  <EmptyState icon={MessageCircle} title="No pending bookings" description="Booking requests from students will appear here." />
                ) : (
                  <div className="space-y-3">
                    {bookingList.filter((b) => b.status === "pending").slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                          {booking.studentName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{booking.studentName}</p>
                          <p className="text-xs text-slate-400">{booking.subject} • {booking.date} • {booking.timeSlot}</p>
                        </div>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">Accept</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-sm">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                {teacherProfile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Verification</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${teacherProfile.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {teacherProfile.isVerified ? "Verified" : "Under Review"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Available</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${teacherProfile.isAvailable ? "bg-teal-50 text-teal-700" : "bg-stone-100 text-slate-500"}`}>
                        {teacherProfile.isAvailable ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <EmptyState icon={Users} title="Complete your profile" description="Set up your teaching profile to start getting students." />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
