import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowLeft,
  Send,
  Brain,
  User,
  Sparkles,
  BookOpen,
  Lightbulb,
  Calculator,
  GraduationCap,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

// AI response generation (simulated — replace with OpenAI API in production)
function generateAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("integration") || lower.includes("integral")) {
    return `Great question! Let me walk you through integration step by step.\n\n**Integration** is the reverse of differentiation — finding the area under a curve or the antiderivative.\n\n**Key Methods:**\n1. **Direct Integration**: Apply standard formulas directly\n2. **Substitution (u-sub)**: When you see a function and its derivative together\n3. **Integration by Parts**: ∫u·dv = uv - ∫v·du — use when product of two different types\n4. **Partial Fractions**: For rational functions\n\n**Example:**\n∫ 2x·e^(x²) dx\n→ Let u = x², so du = 2x dx\n→ ∫ e^u du = e^u + C = e^(x²) + C\n\nWould you like me to explain any specific method in more detail? I can also give you practice problems! 🎯`;
  }

  if (lower.includes("matrix") || lower.includes("determinant")) {
    return `**Matrix Algebra** is crucial for university admission exams! Let me break it down.\n\n**Determinant of a 2×2 Matrix:**\n|a  b|\n|c  d| = ad - bc\n\n**Example:**\n|3  7|  = (3)(5) - (7)(2) = 15 - 14 = 1\n|2  5|\n\n**Key Properties:**\n• det(AB) = det(A) × det(B)\n• If det(A) = 0, the matrix is singular (no inverse)\n• Row operations: swapping rows flips the sign\n\n**For 3×3 matrices:** Use cofactor expansion along any row or column.\n\nWant me to walk through a 3×3 determinant example? 📐`;
  }

  if (lower.includes("limit") || lower.includes("limits")) {
    return `**Limits** are the foundation of calculus! Here's what you need to know.\n\n**Standard Limits to Memorize:**\n• lim(x→0) sin(x)/x = 1\n• lim(x→0) (1-cos x)/x² = 1/2\n• lim(x→∞) (1+1/x)^x = e\n\n**Techniques:**\n1. **Direct Substitution** — try plugging in the value first\n2. **Factor & Cancel** — for 0/0 indeterminate forms\n3. **L'Hôpital's Rule** — differentiate numerator & denominator\n4. **Rationalization** — multiply by conjugate\n\n**Example:**\nlim(x→0) sin(3x)/(2x)\n= (3/2) × lim(x→0) sin(3x)/(3x)\n= (3/2) × 1 = 3/2 ✅\n\nShall I give you a practice problem on limits?`;
  }

  if (lower.includes("complex number")) {
    return `**Complex Numbers** can be tricky, but once you get the pattern, they're straightforward!\n\n**Key Concepts:**\n• z = a + bi, where i² = -1\n• |z| = √(a² + b²) — the modulus\n• z̄ = a - bi — the conjugate\n\n**Operations:**\n• (a+bi)(c+di) = (ac-bd) + (ad+bc)i\n• To divide: multiply by the conjugate of the denominator\n\n**Example:**\nFind |z| where z = (1+i)/(1-i)\n\nStep 1: z = (1+i)/(1-i) × (1+i)/(1+i)\n= (1+2i+i²)/(1+1) = (1+2i-1)/2 = 2i/2 = i\n\nStep 2: |z| = |i| = 1 ✅\n\nWant to try a complex number problem? 🧮`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hello! 👋 I'm your AI Study Tutor, ready to help you ace your university admission exams!\n\nI can help with:\n• **Step-by-step problem solving**\n• **Concept explanations** with examples\n• **Practice questions** at your level\n• **Exam strategies** and tips\n\nWhat subject or topic would you like to work on today?`;
  }

  // Default response
  return `That's a thoughtful question! Let me help you understand this topic.\n\nTo give you the best explanation, could you:\n1. **Specify the exact topic** (e.g., "integration by parts", "matrix determinants")\n2. **Share the specific problem** you're working on\n3. **Tell me your current understanding** so I can tailor my explanation\n\nIn the meantime, here's a general approach for problem-solving:\n• **Read** the problem carefully — identify what's given and what's asked\n• **Plan** — choose the right method/formula\n• **Execute** — work step by step, showing all work\n• **Verify** — plug your answer back in to check\n\nWhat specific topic can I dive deeper into for you? 📚`;
}

export default function AiCoachPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello${user?.name ? ` ${user.name}` : ""}! 🎓 I'm your AI Study Tutor.\n\nI can help you with:\n• **Mathematics** — Calculus, Integration, Matrices, Complex Numbers\n• **Physics** — Mechanics, Thermodynamics, Waves\n• **Problem-solving** — Step-by-step explanations\n\nWhat would you like to learn today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        sender: "ai",
        text: generateAIResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const suggestions = [
    { icon: Calculator, text: "Explain integration by parts", color: "text-indigo-500 bg-indigo-50" },
    { icon: Lightbulb, text: "How to find matrix determinants?", color: "text-amber-500 bg-amber-50" },
    { icon: BookOpen, text: "Teach me complex numbers", color: "text-teal-500 bg-teal-50" },
    { icon: GraduationCap, text: "What are the best exam strategies?", color: "text-purple-500 bg-purple-50" },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-1" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900">AI Tutor</h1>
                <p className="text-[10px] text-emerald-500 font-medium">● Online</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            setMessages([messages[0]]);
          }}>
            <RotateCcw className="w-4 h-4 mr-1" /> New Chat
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}>
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text.split("\n").map((line, i) => {
                    // Simple bold rendering
                    const parts = line.split(/(\*\*.*?\*\*)/);
                    return (
                      <span key={i}>
                        {parts.map((part, j) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={j} className={msg.sender === "user" ? "text-white" : "text-slate-900"}>
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            <span key={j}>{part}</span>
                          ),
                        )}
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    );
                  })}
                </div>
                <p className={`text-[10px] mt-2 ${msg.sender === "user" ? "text-indigo-200" : "text-slate-400"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Suggestions (show only at start) */}
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all text-left"
                >
                  <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{s.text}</span>
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200/60 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about math, physics, or exam strategy..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              disabled={isTyping}
            />
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            AI responses are for educational guidance. Always verify with your textbooks.
          </p>
        </div>
      </div>
    </main>
  );
}
