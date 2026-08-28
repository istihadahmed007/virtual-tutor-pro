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
  Target,
  TrendingUp,
  CheckCircle,
  Play,
  Pen,
  MonitorUp,
  Hand,
  Smile,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { subjects } from "@/lib/data";
import { LazyImage } from "@/components/images/LazyImage";
import { HERO_IMAGE, LIVE_CLASS_IMAGE } from "@/lib/images";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const teachers = useQuery(api.teachers.list);
  const stats = useQuery(api.users.getStats);
  const teacherCount = teachers?.length ?? 0;

  const handleCTA = (path = "/auth") => {
    navigate(isAuthenticated ? "/dashboard" : path);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] overflow-hidden">
      {/* Navigation */}
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
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Features</a>
              <a href="#subjects" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Subjects</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleCTA()} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-600/20 transition-all hover:shadow-lg active:scale-95">
                {isAuthenticated ? "Dashboard" : "Get Started"}
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-xs font-semibold mb-6">
                <Video className="w-3.5 h-3.5" />
                Live classes with real tutors
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Learn from Real Tutors.
                <span className="block text-teal-600">Practice with AI.</span>
                <span className="block text-slate-700">Grow with Confidence.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-xl leading-relaxed">
                Book live 1-on-1 sessions with verified tutors, practice with AI study tools, and track your learning progress — all in one platform.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <button onClick={() => handleCTA("/auth")} className="group px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-xl shadow-teal-600/20 transition-all hover:shadow-2xl flex items-center gap-2.5 text-base active:scale-95">
                  Start Learning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => handleCTA("/auth")} className="px-8 py-4 bg-white border-2 border-stone-200 hover:border-teal-300 text-slate-700 font-semibold rounded-2xl transition-all hover:bg-teal-50/50 flex items-center gap-2 text-base">
                  Become a Tutor
                </button>
              </div>

              {/* Trust indicators — only show real data */}
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-500" />
                  <span className="font-semibold text-slate-700">{teacherCount}</span> verified tutors
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-500" />
                  <span className="font-semibold text-slate-700">All tutors verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">{stats?.totalLessons ?? 0}</span> lessons completed
                </div>
              </div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative">
                <LazyImage
                  src={HERO_IMAGE}
                  alt="A tutor conducting a live video lesson with a student, engaged in a friendly and focused conversation"
                  aspectRatio="4/3"
                  className="rounded-3xl"
                  wrapperClassName="rounded-3xl shadow-2xl shadow-slate-200/80"
                  priority
                />
                {/* Floating card: Live */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3.5 shadow-xl shadow-slate-200/60 border border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Video className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Live Session</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">In progress</p>
                    </div>
                  </div>
                </div>
                {/* Floating card: Rating */}
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl p-3 shadow-xl shadow-slate-200/60 border border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-900">4.9</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How LiveClass Works</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">From sign-up to your first lesson in minutes</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create Your Profile", desc: "Select subjects, education level, learning goals, and preferred language.", icon: Target, color: "from-teal-500 to-teal-600" },
              { step: "02", title: "Find the Right Tutor", desc: "Filter by subject, experience, language, price, and availability.", icon: Search, color: "from-amber-500 to-amber-600" },
              { step: "03", title: "Join a Live Class", desc: "Video, whiteboard, screen share, chat, file sharing, and more.", icon: Video, color: "from-indigo-500 to-indigo-600" },
              { step: "04", title: "Track Your Growth", desc: "Lessons, progress, assignments, tutor feedback, and certificates.", icon: TrendingUp, color: "from-rose-500 to-rose-600" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {s.step}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-7 -right-3 w-5 h-5 text-slate-300" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Class Experience */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <LazyImage
                  src={LIVE_CLASS_IMAGE}
                  alt="Teacher explaining a topic on a digital whiteboard during a live video class, with real-time interaction and screen sharing"
                  aspectRatio="4/3"
                  className="rounded-3xl"
                  wrapperClassName="rounded-3xl shadow-2xl shadow-slate-200/60"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3.5 shadow-xl shadow-slate-200/60 border border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Real-time chat</p>
                      <p className="text-[10px] text-slate-400">Ask questions live</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                Your classroom, <span className="text-teal-600">wherever you are</span>
              </h2>
              <p className="mt-5 text-lg text-slate-500 leading-relaxed">
                Not pre-recorded videos. Not chatbots. A real tutor explaining concepts, answering your questions, and guiding you through practice — live, in real-time.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { icon: Video, label: "HD Video" },
                  { icon: MessageCircle, label: "Live Chat" },
                  { icon: Pen, label: "Whiteboard" },
                  { icon: MonitorUp, label: "Screen Share" },
                  { icon: Hand, label: "Hand Raise" },
                  { icon: Smile, label: "Reactions" },
                  { icon: FileText, label: "Notes" },
                  { icon: Clock, label: "Timer" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-stone-200/80">
                    <f.icon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-slate-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Everything You Need to Learn</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Video, title: "Live Video Classes", desc: "Real-time interaction with your tutor. Not pre-recorded — actual live learning.", color: "bg-teal-50 text-teal-600" },
              { icon: Shield, title: "Verified Experts", desc: "Every tutor is credential-verified. Learn from verified professionals.", color: "bg-indigo-50 text-indigo-600" },
              { icon: BookOpen, title: "AI Study Assistant", desc: "After each class, get AI-generated summaries, practice questions, and homework.", color: "bg-purple-50 text-purple-600" },
              { icon: TrendingUp, title: "Progress Tracking", desc: "Track completed lessons, hours, streaks, and subject mastery.", color: "bg-rose-50 text-rose-600" },
              { icon: Globe, title: "Learn in Your Language", desc: "Tutors available in English, বাংলা, and other languages.", color: "bg-emerald-50 text-emerald-600" },
              { icon: Zap, title: "Flexible Scheduling", desc: "Book sessions that fit your schedule. Morning, evening, or weekends.", color: "bg-amber-50 text-amber-600" },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-5 rounded-2xl border border-stone-200/80 hover:shadow-lg hover:shadow-stone-200/50 transition-all">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                  <f.icon className="w-5 h-5" />
                </div>
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
            <p className="mt-3 text-slate-500">From mathematics to programming, find the right tutor for every subject</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((s, i) => (
              <motion.button key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} onClick={() => handleCTA("/auth")} className="p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 text-center transition-all group">
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
            <p className="mt-6 text-lg text-teal-100 max-w-xl mx-auto">Join students learning from real tutors through live, interactive classes.</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => handleCTA("/auth")} className="px-10 py-4 bg-white text-teal-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:bg-teal-50 flex items-center gap-2.5 text-base active:scale-95">
                Start Learning <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => handleCTA("/auth")} className="px-10 py-4 bg-teal-500/30 text-white font-semibold rounded-2xl border border-teal-400/30 hover:bg-teal-500/40 transition-all text-base">
                Become a Tutor
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
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
