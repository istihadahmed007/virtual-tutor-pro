import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockTutors, type Tutor } from "@/lib/data";
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  MapPin,
  MessageCircle,
  Calendar,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function TutorsPage() {
  const navigate = useNavigate();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredTutors =
    filter === "all" ? mockTutors : mockTutors.filter((t) => t.subject === filter);
  const subjects = [...new Set(mockTutors.map((t) => t.subject))];

  const handleBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setShowBooking(false);
      setBookingConfirmed(false);
      setSelectedTutor(null);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Expert Tutors</h1>
            <p className="text-xs text-slate-400">Book 1-on-1 sessions with verified educators</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === "all" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Tutors
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === s ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Tutor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="border-slate-200/80 hover:shadow-lg hover:shadow-indigo-500/5 transition-all overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                    {tutor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">{tutor.name}</h3>
                      {tutor.badge && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full whitespace-nowrap">
                          {tutor.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{tutor.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-900">{tutor.rating}</span>
                    <span className="text-xs text-slate-400">({tutor.reviewCount})</span>
                  </div>
                  <span className="text-slate-200">•</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {tutor.yearsExperience} yrs exp
                  </div>
                  <span className="text-slate-200">•</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    {Math.floor(tutor.reviewCount * 1.5)}+ taught
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{tutor.bio}</p>

                <div className="flex items-center gap-2 mb-4">
                  {tutor.languages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
                      {lang}
                    </span>
                  ))}
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${tutor.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {tutor.isAvailable ? "● Available Now" : "● Unavailable"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-lg font-extrabold text-slate-900">৳{tutor.hourlyRate.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1">/hour</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                    disabled={!tutor.isAvailable}
                    onClick={() => {
                      setSelectedTutor(tutor);
                      setShowBooking(true);
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900">No tutors available for this subject</p>
            <p className="text-sm text-slate-500 mt-1">Check back soon or try another subject filter</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && selectedTutor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowBooking(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Session Booked!</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Your 1-on-1 session with {selectedTutor.name} has been confirmed.
                </p>
                <p className="text-xs text-slate-400 mt-4">Check your email for meeting details</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Book a Session</h3>
                <p className="text-sm text-slate-500 mb-6">with {selectedTutor.name} — {selectedTutor.subject}</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Select Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Preferred Time</label>
                    <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white">
                      <option>10:00 AM - 11:00 AM</option>
                      <option>2:00 PM - 3:00 PM</option>
                      <option>5:00 PM - 6:00 PM</option>
                      <option>7:00 PM - 8:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">What do you need help with?</label>
                    <textarea
                      placeholder="Describe your doubt or topic..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="mt-6 p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-sm text-slate-600">Session Fee</span>
                  <span className="text-lg font-extrabold text-slate-900">৳{selectedTutor.hourlyRate.toLocaleString()}</span>
                </div>

                <Button onClick={handleBook} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                  Confirm Booking
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
