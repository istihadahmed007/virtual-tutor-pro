import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import {
  ArrowLeft,
  Send,
  Plus,
  Sparkles,
  BookOpen,
  Calculator,
  Lightbulb,
  Target,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

const suggestedPrompts = [
  { icon: Calculator, label: "Explain a concept", prompt: "Can you explain this concept in simple terms?" },
  { icon: Lightbulb, label: "Give me hints", prompt: "I'm stuck on a problem, can you give me a hint?" },
  { icon: Target, label: "Create practice questions", prompt: "Can you create some practice questions for me?" },
  { icon: BookOpen, label: "Summarize a topic", prompt: "Can you summarize the key points of this topic?" },
];

export default function AiAssistantPage() {
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const conversations = useQuery(api.ai.listConversations);
  const messages = useQuery(
    api.ai.listMessages,
    conversationId ? { conversationId } : "skip",
  );
  const createConversation = useMutation(api.ai.createConversation);
  const sendMessage = useMutation(api.ai.sendMessage);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    let convId = conversationId;
    if (!convId) {
      convId = await createConversation({
        title: msg.slice(0, 50) + (msg.length > 50 ? "..." : ""),
      });
      setConversationId(convId);
    }

    setInput("");
    setIsTyping(true);

    try {
      await sendMessage({ conversationId: convId, content: msg });
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const startNew = () => {
    setConversationId(null);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h1 className="text-sm font-bold text-slate-900">AI Study Assistant</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={startNew}><Plus className="w-4 h-4" /></Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Conversation list (when no active conversation) */}
        {!conversationId && (
          <div className="space-y-4">
            {conversations && conversations.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-3">Recent Conversations</h2>
                <div className="space-y-2">
                  {conversations.map((c) => (
                    <button key={c._id} onClick={() => setConversationId(c._id)} className="w-full text-left p-4 bg-white rounded-xl border border-stone-200/80 hover:border-teal-200 hover:shadow-md transition-all">
                      <p className="text-sm font-bold text-slate-900">{c.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(c.lastMessageAt).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested prompts */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-3">What can I help you with?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedPrompts.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p.prompt)} className="p-4 bg-white rounded-xl border border-stone-200/80 hover:border-teal-200 hover:shadow-md transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <p.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{p.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{p.prompt}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active conversation */}
        {conversationId && (
          <div className="space-y-4">
            <div className="space-y-4 min-h-[400px]">
              {messages?.map((msg) => (
                <div key={msg._id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "bg-teal-600 text-white rounded-br-md" : "bg-white border border-stone-200/80 text-slate-900 rounded-bl-md"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200/80 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="sticky bottom-0 bg-[#FAFAF8] pt-4 pb-2">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask anything about your studies..."
                  className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
                  disabled={isTyping}
                />
                <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="bg-teal-600 hover:bg-teal-700 text-white px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">AI responses are for study support only. Always consult your tutor for authoritative guidance.</p>
            </div>
          </div>
        )}

        {(!conversations || conversations.length === 0) && !conversationId && (
          <EmptyState icon={MessageCircle} title="Start a conversation" description="Ask the AI assistant anything about your studies. It can help explain concepts, create practice questions, and summarize lessons." />
        )}
      </div>
    </main>
  );
}
