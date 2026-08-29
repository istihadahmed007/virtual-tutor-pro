import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  Video,
  Users,
  Calendar,
  Clock,
  Star,
  MessageCircle,
  Play,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sessions = useQuery(api.sessions.listByTeacher);
  const teacherProfile = useQuery(api.teachers.getMyProfile);
  const bookings = useQuery(api.bookings.listByTeacher);

  const sessionList = sessions ?? [];
  const bookingList = bookings ?? [];
  const pendingBookings = bookingList.filter((b) => b.status === "pending");
  const upcomingSessions = sessionList
    .filter((s) => s.status === "scheduled" && s.scheduledAt > Date.now())
    .sort((a, b) => a.scheduledAt - b.scheduledAt);

  const needsAttention = pendingBookings.length > 0;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <PageHeader
          title="Teacher dashboard"
          description="Manage your classes, students, and schedule"
        />

        {/* Verification/Profile Status */}
        {teacherProfile && !teacherProfile.isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Your profile is under review
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Our team is reviewing your credentials. You'll be notified once
                  verified.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-700 shrink-0"
              onClick={() => navigate("/profile")}
            >
              View profile
            </Button>
          </div>
        )}

        {teacherProfile && !teacherProfile.isAvailable && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-sky-800">
                  Set your availability
                </p>
                <p className="text-xs text-sky-600 mt-0.5">
                  Students can't book you until you set your available times.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-sky-600 hover:bg-sky-700 text-white shrink-0"
              onClick={() => navigate("/profile")}
            >
              Set availability
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={Video}
            label="Total sessions"
            value={sessionList.length}
            iconBg="bg-teal-50"
          />
          <StatCard
            icon={BookOpen}
            label="Pending bookings"
            value={pendingBookings.length}
            iconBg="bg-amber-50"
          />
          <StatCard
            icon={Users}
            label="Students"
            value={teacherProfile?.totalStudents ?? 0}
            iconBg="bg-indigo-50"
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={teacherProfile?.rating ? `${teacherProfile.rating} ★` : "New"}
            iconBg="bg-amber-50"
          />
        </div>

        {/* Pending bookings alert */}
        {needsAttention && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4" /> Booking requests needing
              attention
            </h3>
            <div className="space-y-2">
              {pendingBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-100"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                    {booking.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {booking.studentName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {booking.subject} · {booking.date} · {booking.timeSlot}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs shrink-0"
                  >
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's / Upcoming sessions */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" /> Upcoming
                  sessions
                </h3>
                {upcomingSessions.length > 0 && (
                  <button
                    onClick={() => navigate("/calendar")}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    View calendar
                  </button>
                )}
              </div>
              {upcomingSessions.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="No upcoming sessions"
                  description="Create a live session to start teaching students."
                  actionLabel="Create session"
                />
              ) : (
                <div className="space-y-2">
                  {upcomingSessions.slice(0, 5).map((session) => {
                    const date = new Date(session.scheduledAt);
                    const isToday =
                      new Date().toDateString() === date.toDateString();
                    return (
                      <div
                        key={session._id}
                        className="flex items-center gap-4 p-3 bg-[#FAFAF8] rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {session.enrolledCount}/{session.maxStudents}{" "}
                            students · {session.durationMinutes} min
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <StatusBadge
                            label={isToday ? "Today" : "Upcoming"}
                            variant={isToday ? "success" : "info"}
                          />
                          <p className="text-xs text-slate-400 mt-1">
                            {date.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white shrink-0 gap-1"
                          onClick={() =>
                            navigate(`/classroom?session=${session._id}`)
                          }
                        >
                          <Play className="w-3.5 h-3.5" /> Start
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* All bookings */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-500" /> All bookings
              </h3>
              {bookingList.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  title="No bookings yet"
                  description="Booking requests from students will appear here."
                />
              ) : (
                <div className="space-y-2">
                  {bookingList.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                        {booking.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {booking.studentName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {booking.subject} · {booking.date} · {booking.timeSlot}
                        </p>
                      </div>
                      <StatusBadge
                        label={
                          booking.status === "pending"
                            ? "Pending"
                            : booking.status === "confirmed"
                              ? "Confirmed"
                              : booking.status === "completed"
                                ? "Completed"
                                : "Cancelled"
                        }
                        variant={
                          booking.status === "pending"
                            ? "warning"
                            : booking.status === "confirmed"
                              ? "success"
                              : booking.status === "completed"
                                ? "info"
                                : "neutral"
                        }
                        dot
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200/80 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Profile status
              </h3>
              {teacherProfile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Verification</span>
                    <StatusBadge
                      label={
                        teacherProfile.isVerified ? "Verified" : "Under review"
                      }
                      variant={
                        teacherProfile.isVerified ? "success" : "pending"
                      }
                      dot
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Available</span>
                    <StatusBadge
                      label={teacherProfile.isAvailable ? "Yes" : "No"}
                      variant={
                        teacherProfile.isAvailable ? "success" : "neutral"
                      }
                      dot
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Profile</span>
                    <span className="text-sm font-bold text-slate-900">
                      {teacherProfile.profileCompletionPct}%
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate("/profile")}
                  >
                    Edit profile
                  </Button>
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="Complete your profile"
                  description="Set up your teaching profile to start getting students."
                  actionLabel="Create profile"
                  actionPath="/profile"
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
                  { label: "Set availability", icon: Clock, path: "/profile" },
                  { label: "Messages", icon: MessageCircle, path: "/messages" },
                  { label: "Calendar", icon: Calendar, path: "/calendar" },
                  { label: "Earnings", icon: TrendingUp, path: "/progress" },
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
          </div>
        </div>
      </div>
    </main>
  );
}
