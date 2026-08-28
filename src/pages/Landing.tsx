import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  GraduationCap,
  Video,
  Users,
  Star,
  ArrowRight,
  Search,
  MessageCircle,
  BookOpen,
  Shield,
  Clock,
  Zap,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { subjects } from "@/lib/data";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const teachers = useQuery(api.teachers.list);
  const teacherCount = teachers?.length ?? 0;

  const handleCTA = (path = "/auth") => {
    navigate(isAuthenticated ? "/dashboard" : path);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] overflow-hidden">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-stone-200/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-md shadow-teal-600/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Live<span className="text-teal-600">Class</span></span>
            </button>
            <div className="hidden md:flex items-center gap-6">
              <a href="#teachers" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Teachers</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">How It Works</a>
              <a href="#subjects" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Subjects</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleCTA()} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-600/20 transition-all hover:shadow-lg active:scale-95">
                {isAuthenticated ? "Dashboard" : "Find a Teacher"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-xs font-semibold mb-6">
              <Video className="w-3.5 h-3.5" />
              Live classes with real teachers
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Learn Directly from
              <span className="block text-teal-600">People Who Know</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Book live classes, ask questions in real-time, practice together, and get
              personalized feedback from expert teachers who care about your success.
            </p>

            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="What do you want to learn?" className="w-full pl-12 pr-32 py-4 bg-white border border-stone-200 rounded-2xl text-slate-900 placeholder:text-slate-400 shadow-lg shadow-stone-200/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all text-base" onClick={() => handleCTA("/teachers")} />
                <button onClick={() => handleCTA("/teachers")} className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors">Search</button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {subjects.slice(0, 8).map((s) => (
                  <button key={s.name} onClick={() => navigate("/teachers")} className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-slate-600 hover:border-teal-300 hover:text-teal-700 transition-colors">
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => handleCTA("/teachers")} className="group px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-xl shadow-teal-600/20 transition-all hover:shadow-2xl flex items-center gap-2.5 text-base active:scale-95">
                Find a Teacher
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => handleCTA("/auth")} className="px-8 py-4 bg-white border-2 border-stone-200 hover:border-teal-300 text-slate-700 font-semibold rounded-2xl transition-all hover:bg-teal-50/50 flex items-center gap-2 text-base">
                Become a Teacher
              </button>
            </div>

            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                <span className="font-semibold text-slate-700">{teacherCount}</span> {teacherCount === 1 ? "teacher" : "teachers"} on the platform
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-700">4.8/5</span> avg rating
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Teachers Available Now */}
      <section id="teachers" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Teachers Available Now</h2>
              <p className="mt-2 text-slate-500">Expert educators ready to help you learn</p>
            </div>
            <button onClick={() => navigate("/teachers")} className="hidden sm:flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View all teachers <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {teachers === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse">
                  <div className="flex items-start gap-4"><div className="w-14 h-14 rounded-2xl bg-stone-200" /><div className="flex-1 space-y-2"><div className="h-4 bg-stone-200 rounded w-3/4" /><div className="h-3 bg-stone-100 rounded w-1/2" /></div></div>
                </div>
              ))}
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-900">No teachers yet</p>
              <p className="text-sm text-slate-500 mt-1">Be the first teacher to join the platform!</p>
              <button onClick={() => navigate("/auth")} className="mt-4 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Become a Teacher
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teachers.slice(0, 6).map((teacher, i) => (
                <motion.div key={teacher._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/5 transition-all cursor-pointer group" onClick={() => navigate(`/teachers/${teacher.userId}`)}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">{teacher.name.charAt(0)}</div>
                      {teacher.isAvailable && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 truncate">{teacher.name}</h3>
                        {teacher.isVerified && <Shield className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{teacher.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{teacher.bio}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {teacher.subjects.map((s) => <span key={s} className="px-2 py-0.5 bg-stone-100 text-slate-600 text-[10px] font-medium rounded-full">{s}</span>)}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-900">{teacher.rating > 0 ? teacher.rating : "New"}</span>
                      </div>
                      <span className="text-xs text-slate-400">{teacher.reviewCount} reviews</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">৳{teacher.hourlyRate.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 ml-0.5">/hr</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How LiveClass Works</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">Meet a teacher → Talk → Practice → Get feedback → Improve</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Find a Teacher", desc: "Browse expert teachers by subject, rating, and availability.", icon: Search, color: "from-teal-500 to-teal-600" },
              { step: "2", title: "Book a Session", desc: "Choose a time that works. Book 1-on-1, small group, or trial classes.", icon: Clock, color: "from-amber-500 to-amber-600" },
              { step: "3", title: "Join Live Class", desc: "Connect via video. Ask questions, use the whiteboard, interact live.", icon: Video, color: "from-indigo-500 to-indigo-600" },
              { step: "4", title: "Keep Growing", desc: "Get teacher feedback, AI summaries, homework, and track progress.", icon: Zap, color: "from-rose-500 to-rose-600" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}><s.icon className="w-6 h-6 text-white" /></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {s.step}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-7 -right-3 w-5 h-5 text-slate-300" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LiveClass */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Students Love LiveClass</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Video, title: "Live Video Classes", desc: "Real-time interaction with your teacher. Not pre-recorded — actual live learning.", color: "bg-teal-50 text-teal-600" },
              { icon: MessageCircle, title: "Ask Anything, Anytime", desc: "Raise your hand, ask questions in chat, or unmute and talk directly.", color: "bg-amber-50 text-amber-600" },
              { icon: Shield, title: "Verified Experts", desc: "Every teacher is credential-verified. Learn from verified professionals.", color: "bg-indigo-50 text-indigo-600" },
              { icon: Users, title: "Small Class Sizes", desc: "Intimate learning with 1-8 students. Get the attention you deserve.", color: "bg-rose-50 text-rose-600" },
              { icon: BookOpen, title: "AI Learning Assistant", desc: "After each class, get AI-generated summaries, practice questions, and homework.", color: "bg-purple-50 text-purple-600" },
              { icon: Globe, title: "Learn in Your Language", desc: "Teachers available in English, বাংলা, and other languages.", color: "bg-emerald-50 text-emerald-600" },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-5 rounded-2xl border border-stone-200/80 hover:shadow-lg hover:shadow-stone-200/50 transition-all">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-3`}><f.icon className="w-5 h-5" /></div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Learn Anything</h2>
            <p className="mt-3 text-slate-500">From mathematics to programming, find the right teacher for every subject</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((s, i) => (
              <motion.button key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} onClick={() => navigate("/teachers")} className="p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 text-center transition-all group">
                <div className="text-3xl mb-2">{s.icon}</div>
                <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Your Learning Journey Starts with <span className="text-amber-300">One Conversation</span>
            </h2>
            <p className="mt-6 text-lg text-teal-100 max-w-xl mx-auto">Join students learning from real teachers through live, interactive classes.</p>
            <button onClick={() => handleCTA("/teachers")} className="mt-10 px-10 py-4 bg-white text-teal-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:bg-teal-50 flex items-center gap-2.5 mx-auto text-base active:scale-95">
              Find Your Teacher <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-bold text-white">LiveClass</span>
            </div>
            <p className="text-sm">© 2025 LiveClass. Learn from real people. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
