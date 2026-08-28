import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  MessageCircle,
  Smile,
  Pen,
  MoreHorizontal,
  PhoneOff,
  Users,
  Send,
  X,
  ChevronLeft,
  Pencil,
  Circle,
  Square,
  Type,
  Eraser,
  Undo2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

type SidePanel = "none" | "chat" | "participants" | "questions" | "whiteboard";

interface ClassMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isTeacher: boolean;
}

export default function ClassroomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionTitle = searchParams.get("title") || "Live Class Session";
  const teacherName = searchParams.get("teacher") || "Teacher";

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [sidePanel, setSidePanel] = useState<SidePanel>("chat");
  const [messages, setMessages] = useState<ClassMessage[]>([
    { id: "1", sender: "System", text: "Welcome to the class! The session has started.", time: "Now", isTeacher: false },
    { id: "2", sender: teacherName, text: "Hello everyone! Welcome to today's session. Let's get started!", time: "1 min ago", isTeacher: true },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [reactions, setReactions] = useState<{ id: string; emoji: string }[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [whiteboardTool, setWhiteboardTool] = useState<"pen" | "circle" | "square" | "text" | "eraser">("pen");
  const [isRecording, setIsRecording] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ClassMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: chatInput,
      time: "Now",
      isTeacher: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const sendReaction = (emoji: string) => {
    const id = Date.now().toString();
    setReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 3000);
    setShowReactions(false);
  };

  const participants = [
    { name: teacherName, role: "Teacher", isSpeaking: true },
    { name: "You", role: "Student", isSpeaking: false },
    { name: "Tanvir H.", role: "Student", isSpeaking: false },
    { name: "Nusrat J.", role: "Student", isSpeaking: false },
    { name: "Arif C.", role: "Student", isSpeaking: false },
  ];

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 h-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white">{sessionTitle}</h1>
            <p className="text-[10px] text-slate-400">{teacherName} • {participants.length} participants</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-medium">REC</span>
            </div>
          )}
          <span className="text-xs text-slate-400">45:23</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video (Teacher) */}
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            {isScreenSharing ? (
              <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-center">
                  <MonitorUp className="w-12 h-12 text-teal-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700">{teacherName} is sharing their screen</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full max-w-4xl aspect-video mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-2xl">
                      {teacherName.charAt(0)}
                    </div>
                    <p className="text-white font-bold mt-4 text-lg">{teacherName}</p>
                    <p className="text-slate-400 text-sm">Teaching...</p>
                  </div>
                </div>
                {/* Participant indicators */}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {participants.slice(0, 4).map((p, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-bold border border-slate-600">
                      {p.name.charAt(0)}
                    </div>
                  ))}
                  {participants.length > 4 && (
                    <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center text-slate-300 text-xs font-bold">
                      +{participants.length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Floating Reactions */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="text-4xl animate-bounce"
                style={{ animationDuration: "0.6s" }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Hand Raised Indicator */}
          {handRaised && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center gap-2">
              <Hand className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300 font-medium">Hand Raised</span>
            </div>
          )}
        </div>

        {/* Side Panel */}
        {sidePanel !== "none" && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
            {/* Panel Header */}
            <div className="px-4 h-12 flex items-center justify-between border-b border-slate-800 shrink-0">
              <h3 className="text-sm font-bold text-white capitalize">{sidePanel}</h3>
              <button onClick={() => setSidePanel("none")} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Panel */}
            {sidePanel === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${msg.isTeacher ? "text-teal-400" : msg.sender === "System" ? "text-slate-500" : "text-blue-400"}`}>
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-0.5">{msg.text}</p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-slate-800">
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <Button onClick={sendMessage} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white px-3">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Participants Panel */}
            {sidePanel === "participants" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${p.role === "Teacher" ? "bg-gradient-to-br from-teal-500 to-teal-600" : "bg-slate-700"}`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {p.name}
                        {p.role === "Teacher" && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-teal-500/20 text-teal-400 rounded-full">Teacher</span>}
                      </p>
                      <p className="text-[10px] text-slate-500">{p.role}</p>
                    </div>
                    {p.isSpeaking && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                  </div>
                ))}
              </div>
            )}

            {/* Questions Panel */}
            {sidePanel === "questions" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-amber-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Hand className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">Pending Question</span>
                  </div>
                  <p className="text-sm text-slate-300">Can you explain integration by parts one more time?</p>
                  <p className="text-[10px] text-slate-500 mt-1">— Tanvir H.</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-300">What's the difference between SN1 and SN2?</p>
                  <p className="text-[10px] text-slate-500 mt-1">— Nusrat J.</p>
                </div>
              </div>
            )}

            {/* Whiteboard Panel */}
            {sidePanel === "whiteboard" && (
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-1">
                  {[
                    { tool: "pen" as const, icon: Pencil, label: "Pen" },
                    { tool: "circle" as const, icon: Circle, label: "Circle" },
                    { tool: "square" as const, icon: Square, label: "Square" },
                    { tool: "text" as const, icon: Type, label: "Text" },
                    { tool: "eraser" as const, icon: Eraser, label: "Eraser" },
                  ].map((t) => (
                    <button
                      key={t.tool}
                      onClick={() => setWhiteboardTool(t.tool)}
                      className={`p-2 rounded-lg transition-colors ${
                        whiteboardTool === t.tool ? "bg-teal-600 text-white" : "text-slate-400 hover:bg-slate-800"
                      }`}
                      title={t.label}
                    >
                      <t.icon className="w-4 h-4" />
                    </button>
                  ))}
                  <div className="ml-auto">
                    <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg">
                      <Undo2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-white m-2 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Pen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Whiteboard active — draw here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 h-16 flex items-center justify-center gap-2 shrink-0">
        {/* Left Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              micOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setCamOn(!camOn)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              camOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
          >
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-1.5 mx-4">
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isScreenSharing ? "bg-teal-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Share Screen"
          >
            <MonitorUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setHandRaised(!handRaised); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              handRaised ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Raise Hand"
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* Reactions */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="w-10 h-10 rounded-xl bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="Reactions"
            >
              <Smile className="w-5 h-5" />
            </button>
            {showReactions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowReactions(false)} />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 flex gap-1 z-50">
                  {["👍", "❤️", "👏", "😂", "🤔", "❓"].map((emoji) => (
                    <button key={emoji} onClick={() => sendReaction(emoji)} className="text-xl hover:scale-125 transition-transform p-1">
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setSidePanel(sidePanel === "whiteboard" ? "none" : "whiteboard")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              sidePanel === "whiteboard" ? "bg-teal-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Whiteboard"
          >
            <Pen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isRecording ? "bg-red-500 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Record"
          >
            <div className={`w-4 h-4 rounded-full border-2 ${isRecording ? "border-white bg-white" : "border-white"}`} />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSidePanel(sidePanel === "chat" ? "none" : "chat")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              sidePanel === "chat" ? "bg-teal-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidePanel(sidePanel === "participants" ? "none" : "participants")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              sidePanel === "participants" ? "bg-teal-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Participants"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidePanel(sidePanel === "questions" ? "none" : "questions")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              sidePanel === "questions" ? "bg-teal-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
            title="Questions"
          >
            <span className="text-xs font-bold">Q&A</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors ml-2"
            title="Leave Class"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
