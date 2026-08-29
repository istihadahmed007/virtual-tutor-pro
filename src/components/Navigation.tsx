import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate, useLocation } from "react-router";
import {
  GraduationCap,
  Users,
  Video,
  MessageCircle,
  BookOpen,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Bell,
  Calendar,
  ClipboardList,
  TrendingUp,
  Sparkles,
  User,
  Settings,
} from "lucide-react";

const studentLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Find tutors", path: "/teachers", icon: Users },
  { label: "Lessons", path: "/lessons", icon: Video },
  { label: "Calendar", path: "/calendar", icon: Calendar },
  { label: "Assignments", path: "/assignments", icon: ClipboardList },
  { label: "Messages", path: "/messages", icon: MessageCircle },
  { label: "AI assistant", path: "/ai-assistant", icon: Sparkles },
];

const teacherLinks = [
  { label: "Dashboard", path: "/teacher-dashboard", icon: LayoutDashboard },
  { label: "Students", path: "/teachers", icon: Users },
  { label: "Calendar", path: "/calendar", icon: Calendar },
  { label: "Messages", path: "/messages", icon: MessageCircle },
  { label: "Progress", path: "/progress", icon: TrendingUp },
];

export function Navigation() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  const isTeacher = user?.role === "teacher";
  const navLinks = isTeacher ? teacherLinks : studentLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Desktop/Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")} className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-md shadow-teal-600/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 hidden sm:block">Live<span className="text-teal-600">Class</span></span>
            </button>

            {/* Desktop Nav */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.slice(0, 5).map((link) => (
                  <button key={link.path} onClick={() => navigate(link.path)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${location.pathname === link.path ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:text-slate-900 hover:bg-stone-50"}`}>
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-stone-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {(unreadCount ?? 0) > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">{user?.name?.charAt(0) || "U"}</div>
                      <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[100px] truncate">{user?.name || "User"}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                    </button>

                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                          <button onClick={() => { navigate(isTeacher ? "/teacher-dashboard" : "/dashboard"); setProfileOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-stone-50 flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                          </button>
                          <button onClick={() => { navigate("/profile"); setProfileOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-stone-50 flex items-center gap-2.5">
                            <User className="w-4 h-4 text-slate-400" /> Profile
                          </button>
                          <div className="border-t border-stone-100 my-1" />
                          <button onClick={() => { handleSignOut(); setProfileOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-slate-600">Sign In</Button>
                  <Button size="sm" onClick={() => navigate("/auth")} className="bg-teal-600 hover:bg-teal-700 text-white">Get Started</Button>
                </div>
              )}

              {isAuthenticated && (
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-500 hover:bg-stone-50 rounded-lg">
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && isAuthenticated && (
          <div className="md:hidden border-t border-stone-200/60 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }} className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left flex items-center gap-2.5 transition-colors ${location.pathname === link.path ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-stone-50"}`}>
                  <link.icon className="w-4 h-4" /> {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 safe-area-bottom">
          <div className="flex items-center justify-around py-2">
            {navLinks.slice(0, 5).map((link) => (
              <button key={link.path} onClick={() => navigate(link.path)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${location.pathname === link.path ? "text-teal-600" : "text-slate-400"}`}>
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
