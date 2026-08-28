import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  X,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-lg font-bold text-slate-900">Pricing</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3" />
            Simple, transparent pricing
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Choose Your Learning Plan
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            Start free and upgrade when you're ready for unlimited access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">Free</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-slate-900">৳0</span>
              <span className="text-sm text-slate-400">forever</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Perfect for getting started</p>

            <ul className="space-y-3 mb-8">
              {[
                { text: "AI Tutor (5 questions/day)", included: true },
                { text: "Basic mock exams", included: true },
                { text: "Progress tracking", included: true },
                { text: "Mistake book", included: true },
                { text: "Study plans", included: true },
                { text: "Expert tutor sessions", included: false },
                { text: "Exam percentile prediction", included: false },
                { text: "Priority support", included: false },
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  {f.included ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={`text-sm ${f.included ? "text-slate-700" : "text-slate-400"}`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button onClick={() => navigate("/auth")} variant="outline" className="w-full" size="lg">
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl shadow-indigo-500/25">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Most Popular
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-200" />
              <h3 className="text-lg font-bold">Pro</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold">৳499</span>
              <span className="text-sm text-indigo-200">/month</span>
            </div>
            <p className="text-xs text-indigo-200 mb-6">Everything you need to ace your exam</p>

            <ul className="space-y-3 mb-8">
              {[
                "Everything in Free, plus:",
                "Unlimited AI Tutor access",
                "All mock exams with analytics",
                "Expert tutor booking",
                "AI-generated study plans",
                "Exam percentile prediction",
                "Mistake categorization",
                "Priority support",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className={`text-sm ${i === 0 ? "text-indigo-100 font-semibold" : "text-indigo-100"}`}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Button onClick={() => navigate("/auth")} className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold" size="lg">
              Start Pro Trial
            </Button>
            <p className="text-center text-[10px] text-indigo-200 mt-3">7-day free trial • Cancel anytime</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch between Free and Pro?",
                a: "Yes! You can upgrade or downgrade at any time. Your progress is always saved.",
              },
              {
                q: "How do the tutor sessions work?",
                a: "Book a session with any verified tutor, choose a time slot, and join via video call. Sessions are 1 hour and include a detailed prescription.",
              },
              {
                q: "Is the AI tutor accurate for exam prep?",
                a: "Our AI tutor provides step-by-step explanations aligned with Bangladeshi curriculum standards. Always verify with your textbooks for critical exam preparation.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept bKash, Nagad, Rocket, and all major credit/debit cards.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h4 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
