import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, Send, Search, Phone, Video, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function MessagesPage() {
  const navigate = useNavigate();
  const conversations = useQuery(api.messages.listConversations);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const convList = conversations ?? [];
  const isLoading = conversations === undefined;

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <header className="bg-white border-b border-stone-200/60 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        {/* Conversations List */}
        <div className="w-full sm:w-80 border-r border-stone-200/60 bg-white flex flex-col shrink-0">
          <div className="p-3 border-b border-stone-200/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search conversations..." className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse" />)}
              </div>
            ) : convList.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={MessageCircle} title="No conversations yet" description="Your conversations will appear here when you message a teacher." />
              </div>
            ) : (
              convList.map((conv) => (
                <button key={conv._id} onClick={() => setSelectedConv(conv._id)} className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${selectedConv === conv._id ? "bg-teal-50 border-l-2 border-teal-500" : "hover:bg-stone-50 border-l-2 border-transparent"}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    ?
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-900 truncate">Conversation</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage || "No messages yet"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat View */}
        <div className="hidden sm:flex flex-1 flex-col bg-[#FAFAF8]">
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <p className="text-sm">{selectedConv ? "Loading messages..." : "Select a conversation"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
