import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { liveSessions } from "@/lib/data";
import {
  ArrowLeft,
  Search,
  Video,
  Clock,
  Users,
  Calendar,
  Play,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router";

const allSubjects = [...new Set(liveSessions.map((s) => s.subject))];

export default function ClassesPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = liveSessions.filter((s) => {
    if (selectedSubject && s.subject !== selectedSubject) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.teacherName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Button>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Live Classes</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and join upcoming live sessions</p>

          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search classes or teachers..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedSubject("")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                !selectedSubject ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
              }`}
            >
              All
            </button>
            {allSubjects.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === s ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((session) => {
            const date = new Date(session.scheduledAt);
            const isFull = session.enrolledCount >= session.maxStudents;

            return (
              <Card key={session.id} className="border-stone-200/80 hover:shadow-xl hover:shadow-stone-200/50 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full border border-teal-100 uppercase tracking-wider">
                      {session.subject}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      session.sessionType === "1-to-1"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {session.sessionType}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{session.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{session.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                        {session.teacherName.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{session.teacherName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} • {session.durationMinutes}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {session.enrolledCount}/{session.maxStudents}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-xl font-extrabold text-slate-900">৳{session.price.toLocaleString()}</span>
                    <Button
                      className={isFull ? "bg-slate-200 text-slate-500" : "bg-teal-600 hover:bg-teal-700 text-white"}
                      disabled={isFull}
                      onClick={() => navigate(`/classroom?title=${encodeURIComponent(session.title)}&teacher=${encodeURIComponent(session.teacherName)}`)}
                    >
                      {isFull ? "Full" : <><Play className="w-4 h-4 mr-1.5" /> Join</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900">No classes found</p>
            <p className="text-sm text-slate-500 mt-1">Try a different search or subject filter</p>
          </div>
        )}
      </div>
    </main>
  );
}
