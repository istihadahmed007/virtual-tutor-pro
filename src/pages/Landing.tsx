import { motion } from "framer-motion";
import {
  GraduationCap,
  Brain,
  BookOpen,
  Trophy,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Clock,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-teal-600 bg-clip-text text-transparent">
                VirtualTutor
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#subjects" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Subjects</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Reviews</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCTA}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
              >
                {isAuthenticated ? "Dashboard" : "Get Started Free"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Learning Platform for University Admission
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Your Personal
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                AI Study Partner
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Ace your BUET, Medical & University admission exams with AI-powered tutoring,
              realistic mock exams, and personalized study plans — in English and Bangla.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCTA}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center gap-2.5 text-base active:scale-95"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold rounded-2xl transition-all hover:bg-indigo-50/50 flex items-center gap-2 text-base"
              >
                See How It Works
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["bg-indigo-500", "bg-teal-500", "bg-purple-500", "bg-amber-500"].map((bg, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {["A", "R", "F", "K"][i]}
                    </div>
                  ))}
                </div>
                <span className="font-semibold text-slate-700">2,400+</span> active students
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-700">4.9/5</span> average rating
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-700">94%</span> improvement rate
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-200/60">
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-600 p-1">
                <div className="bg-white rounded-[1.35rem] p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs font-medium text-slate-400">VirtualTutor Dashboard</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-5 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Exam Countdown</p>
                          <p className="text-2xl font-bold text-slate-900">14 Days</p>
                        </div>
                      </div>
                      <div className="w-full bg-indigo-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "72%" }} />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-5 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Weekly Accuracy</p>
                          <p className="text-2xl font-bold text-slate-900">87%</p>
                        </div>
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "87%" }} />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-amber-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Study Streak</p>
                          <p className="text-2xl font-bold text-slate-900">14 Days 🔥</p>
                        </div>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {[92, 78, 85, 65, 95].map((score, i) => (
                      <div key={i} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-lg font-bold text-slate-900">{score}%</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{["Math", "Phy", "Che", "Eng", "Bio"][i]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
              Why VirtualTutor
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                Ace Your Exam
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              A complete learning ecosystem designed for Bangladeshi students preparing for
              competitive university admission exams.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Brain,
                title: "AI Socratic Tutor",
                desc: "Get step-by-step explanations that guide you to the answer, not just give it. Ask in English or Bangla.",
                color: "from-indigo-500 to-purple-600",
                bg: "bg-indigo-50",
              },
              {
                icon: BookOpen,
                title: "Realistic Mock Exams",
                desc: "Full-length timed simulations with negative marking, pace tracking, and BUET-style questions.",
                color: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Users,
                title: "Expert 1-on-1 Tutors",
                desc: "Book live sessions with verified tutors from top universities. Get personalized doubt resolution.",
                color: "from-amber-500 to-orange-600",
                bg: "bg-amber-50",
              },
              {
                icon: TrendingUp,
                title: "Smart Progress Tracking",
                desc: "See mastery per topic, identify weak areas, and get AI-generated study plans tailored to you.",
                color: "from-blue-500 to-indigo-600",
                bg: "bg-blue-50",
              },
              {
                icon: Trophy,
                title: "Mistake Intelligence",
                desc: "AI categorizes your errors — conceptual, calculation, or careless — and builds targeted drills.",
                color: "from-rose-500 to-pink-600",
                bg: "bg-rose-50",
              },
              {
                icon: Clock,
                title: "Exam Countdown & Goals",
                desc: "Set your target exam date and daily study goals. Stay on track with streaks and reminders.",
                color: "from-violet-500 to-purple-600",
                bg: "bg-violet-50",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 bg-gradient-to-r ${f.color} bg-clip-text`} style={{ color: undefined }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
              Complete Coverage
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Master Every Subject
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Comprehensive coverage for all university admission subjects
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Mathematics", icon: "📐", color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", topics: "50+ topics" },
              { name: "Physics", icon: "⚡", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", topics: "40+ topics" },
              { name: "Chemistry", icon: "🧪", color: "from-amber-500 to-amber-600", bg: "bg-amber-50", topics: "35+ topics" },
              { name: "English", icon: "📖", color: "from-rose-500 to-rose-600", bg: "bg-rose-50", topics: "30+ topics" },
              { name: "Biology", icon: "🧬", color: "from-teal-500 to-teal-600", bg: "bg-teal-50", topics: "25+ topics" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 text-center transition-all hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{s.topics}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Three Steps to{" "}
              <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Exam Success
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Take a Diagnostic", desc: "Start with a quick mock exam to identify your strengths and weaknesses across all subjects.", color: "from-indigo-500 to-indigo-600" },
              { step: "02", title: "Follow Your AI Plan", desc: "Get a personalized study plan with daily tasks, targeted practice, and AI tutor support.", color: "from-teal-500 to-teal-600" },
              { step: "03", title: "Track & Improve", desc: "Monitor your progress with detailed analytics, fix mistakes, and watch your scores climb.", color: "from-purple-500 to-purple-600" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-6 -right-4 w-6 h-6 text-slate-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                2,400+ Students
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Tanvir Hasan",
                role: "BUET CSE Aspirant",
                text: "VirtualTutor's AI coach helped me understand integration by parts in a way no textbook could. The Socratic method really works — I went from 45% to 89% in math in just 3 weeks.",
                rating: 5,
                color: "bg-indigo-500",
              },
              {
                name: "Nusrat Jahan",
                role: "Medical Admission 2025",
                text: "The mock exams are incredibly realistic. The timer pressure and negative marking simulate the actual exam environment perfectly. I feel confident going into my medical entrance.",
                rating: 5,
                color: "bg-teal-500",
              },
              {
                name: "Arif Chowdhury",
                role: "Dhaka University A Unit",
                text: "Booking a 1-on-1 session with Dr. Rafiq was a game-changer. He identified exactly where my physics concepts were weak and gave me a focused plan. Highly recommend!",
                rating: 5,
                color: "bg-purple-500",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-500">Start free, upgrade when you're ready</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border-2 border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-900">Free</h3>
              <p className="text-4xl font-extrabold text-slate-900 mt-2">৳0</p>
              <p className="text-sm text-slate-400 mt-1">forever</p>
              <ul className="mt-6 space-y-3">
                {["AI Socratic Tutor (5 questions/day)", "Basic mock exams", "Progress tracking", "Mistake book"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCTA}
                className="w-full mt-8 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Get Started
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl shadow-indigo-500/25"
            >
              <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-bold">Pro</h3>
              <p className="text-4xl font-extrabold mt-2">৳499</p>
              <p className="text-sm text-indigo-200 mt-1">/month</p>
              <ul className="mt-6 space-y-3">
                {["Unlimited AI Tutor access", "All mock exams with analytics", "Expert tutor booking", "Study plan generator", "Priority support", "Exam percentile prediction"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-indigo-100">
                    <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCTA}
                className="w-full mt-8 py-3 px-6 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
              >
                Start Pro Trial
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Your Dream University Is{" "}
              <span className="text-amber-300">14 Days Away</span>
            </h2>
            <p className="mt-6 text-lg text-indigo-100 max-w-xl mx-auto">
              Join thousands of students who transformed their preparation with VirtualTutor.
              Start your free journey today.
            </p>
            <button
              onClick={handleCTA}
              className="mt-10 px-10 py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:bg-indigo-50 flex items-center gap-2.5 mx-auto text-base active:scale-95"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">VirtualTutor</span>
            </div>
            <p className="text-sm">© 2025 VirtualTutor. Built for Bangladeshi Students. All rights reserved.</p>
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
