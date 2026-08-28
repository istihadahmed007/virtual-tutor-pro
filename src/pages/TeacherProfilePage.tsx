import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teachers, teacherReviews, sessionTypes } from "@/lib/data";
import {
  ArrowLeft,
  Star,
  Shield,
  Clock,
  Users,
  Globe,
  BookOpen,
  Calendar,
  CheckCircle,
  Award,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

export default function TeacherProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = teachers.find((t) => t.id === id);
  const reviews = teacherReviews.filter((r) => !r.subject || teacher?.subjects.includes(r.subject));

  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!teacher) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">Teacher not found</p>
          <Button onClick={() => navigate("/teachers")} className="mt-4">Browse Teachers</Button>
        </div>
      </main>
    );
  }

  const handleBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setShowBooking(false);
      setBookingConfirmed(false);
      setBookingStep(1);
      setSelectedType("");
      setSelectedDate("");
      setSelectedTime("");
    }, 3000);
  };

  const times = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "8:00 PM"];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teachers")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Teachers
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-teal-500/20">
                {teacher.name.charAt(0)}
              </div>
              {teacher.isAvailable && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900">{teacher.name}</h1>
                {teacher.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold rounded-full">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
                {teacher.badge && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                    {teacher.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">{teacher.title}</p>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-base font-bold text-slate-900">{teacher.rating}</span>
                  <span className="text-xs text-slate-400">({teacher.reviewCount} reviews)</span>
                </div>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  {teacher.totalStudents} students
                </div>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {teacher.yearsExperience} years
                </div>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <BookOpen className="w-4 h-4" />
                  {teacher.totalHours.toLocaleString()} hours taught
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {teacher.languages.map((l) => (
                  <span key={l} className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-slate-600 text-xs font-medium rounded-full">
                    <Globe className="w-3 h-3" /> {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">{teacher.bio}</p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base">Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {teacher.expertise.map((e) => (
                    <span key={e} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg border border-teal-100">
                      {e}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How I Teach */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base">How I Teach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher.teachingStyle.map((style, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-teal-700">{i + 1}</span>
                      </div>
                      <span className="text-sm text-slate-700">{style}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base">Education & Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{teacher.education}</span>
                  </div>
                  {teacher.certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-stone-200/80">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Reviews
                  <span className="text-xs font-normal text-slate-400">({reviews.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">{review.createdAt}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-slate-400 mt-2">— {review.studentName}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Booking Sidebar */}
          <div className="space-y-6">
            <Card className="border-stone-200/80 sticky top-20">
              <CardContent className="p-5">
                <div className="text-center mb-4">
                  <p className="text-3xl font-extrabold text-slate-900">৳{teacher.hourlyRate.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">per hour</p>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {teacher.isAvailable ? "Available for booking" : "Currently unavailable"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    {teacher.totalStudents} students taught
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {teacher.languages.join(", ")}
                  </div>
                </div>

                <Button
                  onClick={() => setShowBooking(true)}
                  disabled={!teacher.isAvailable}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  size="lg"
                >
                  Book a Live Session
                </Button>

                <p className="text-[10px] text-slate-400 text-center mt-3">
                  Free cancellation up to 2 hours before class
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setShowBooking(false); setBookingStep(1); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Session Booked!</h3>
                <p className="text-sm text-slate-500 mt-2">Your session with {teacher.name} has been confirmed.</p>
                <p className="text-xs text-slate-400 mt-4">Check your email for meeting details</p>
              </div>
            ) : (
              <div className="p-6">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${bookingStep >= s ? "bg-teal-600 text-white" : "bg-stone-100 text-slate-400"}`}>
                        {s}
                      </div>
                      {s < 3 && <div className={`flex-1 h-0.5 ${bookingStep > s ? "bg-teal-600" : "bg-stone-200"}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 1: Session Type */}
                {bookingStep === 1 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Choose Session Type</h3>
                    <p className="text-sm text-slate-500 mb-4">Select the type of session you want</p>
                    <div className="space-y-2">
                      {sessionTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => { setSelectedType(type.value); setBookingStep(2); }}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedType === type.value
                              ? "border-teal-500 bg-teal-50"
                              : "border-stone-200 hover:border-teal-200"
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900">{type.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {bookingStep === 2 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Choose Date & Time</h3>
                    <p className="text-sm text-slate-500 mb-4">When would you like to meet?</p>

                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Date</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {dates.map((d) => {
                        const date = new Date(d);
                        const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                        return (
                          <button
                            key={d}
                            onClick={() => setSelectedDate(d)}
                            className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                              selectedDate === d
                                ? "border-teal-500 bg-teal-50 text-teal-700"
                                : "border-stone-200 text-slate-600 hover:border-teal-200"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Time</label>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {times.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                            selectedTime === t
                              ? "border-teal-500 bg-teal-50 text-teal-700"
                              : "border-stone-200 text-slate-600 hover:border-teal-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setBookingStep(1)} className="flex-1">Back</Button>
                      <Button
                        onClick={() => setBookingStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirm */}
                {bookingStep === 3 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Confirm Booking</h3>
                    <div className="bg-stone-50 rounded-xl p-4 space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Teacher</span>
                        <span className="font-medium text-slate-900">{teacher.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Session Type</span>
                        <span className="font-medium text-slate-900">{sessionTypes.find((t) => t.value === selectedType)?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date</span>
                        <span className="font-medium text-slate-900">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Time</span>
                        <span className="font-medium text-slate-900">{selectedTime}</span>
                      </div>
                      <div className="border-t border-stone-200 pt-3 flex justify-between">
                        <span className="text-sm font-bold text-slate-900">Total</span>
                        <span className="text-lg font-extrabold text-slate-900">৳{teacher.hourlyRate.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setBookingStep(2)} className="flex-1">Back</Button>
                      <Button onClick={handleBook} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                        Confirm & Pay
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
