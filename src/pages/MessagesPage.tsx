import { useState } from "react";
import { Button } from "@/components/ui/button";
import { conversations } from "@/lib/data";
import { ArrowLeft, Send, Search, Phone, Video } from "lucide-react";
import { useNavigate } from "react-router";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [selectedConv, setSelectedConv] = useState<string | null>(conversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState("");

  const selected = conversations.find((c) => c.id === selectedConv);

  const chatMessages = [
    { id: "1", sender: "them", text: "Hello! How are you doing with the integration exercises?", time: "2:30 PM" },
    { id: "2", sender: "me", text: "I'm doing well! I managed to solve most of them, but I'm stuck on problem 5.", time: "2:32 PM" },
    { id: "3", sender: "them", text: "That's a tricky one. Remember the key is to identify the right substitution first. Let's discuss it in our next session.", time: "2:35 PM" },
    { id: "4", sender: "me", text: "Thank you! I'll review Chapter 5 before our class tomorrow.", time: "2:36 PM" },
    { id: "5", sender: "them", text: "See you in class tomorrow! Don't forget to review Chapter 5.", time: "3:00 PM" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <header className="bg-white border-b border-stone-200/60 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        {/* Conversations List */}
        <div className="w-full sm:w-80 border-r border-stone-200/60 bg-white flex flex-col shrink-0">
          <div className="p-3 border-b border-stone-200/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  selectedConv === conv.id ? "bg-teal-50 border-l-2 border-teal-500" : "hover:bg-stone-50 border-l-2 border-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {conv.participantNames[0]?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 truncate">{conv.participantNames[0]}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.lastMessageAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <div className="hidden sm:flex flex-1 flex-col bg-[#FAFAF8]">
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3 bg-white border-b border-stone-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                    {selected.participantNames[0]?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selected.participantNames[0]}</p>
                    <p className="text-[10px] text-emerald-500 font-medium">● Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Video className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                      msg.sender === "me"
                        ? "bg-teal-600 text-white rounded-br-md"
                        : "bg-white border border-stone-200 text-slate-700 rounded-bl-md shadow-sm"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-teal-200" : "text-slate-400"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-stone-200/60">
                <div className="flex gap-2">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <p className="text-sm">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
