import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { Navigation } from "@/components/Navigation";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const TeachersPage = lazy(() => import("./pages/TeachersPage.tsx"));
const TeacherProfilePage = lazy(() => import("./pages/TeacherProfilePage.tsx"));
const ClassroomPage = lazy(() => import("./pages/ClassroomPage.tsx"));
const LessonsPage = lazy(() => import("./pages/LessonsPage.tsx"));
const CalendarPage = lazy(() => import("./pages/CalendarPage.tsx"));
const AssignmentsPage = lazy(() => import("./pages/AssignmentsPage.tsx"));
const ProgressPage = lazy(() => import("./pages/ProgressPage.tsx"));
const AiAssistantPage = lazy(() => import("./pages/AiAssistantPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard.tsx"));
const MessagesPage = lazy(() => import("./pages/MessagesPage.tsx"));
const CommunityPage = lazy(() => import("./pages/CommunityPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <div className="animate-pulse text-slate-400 text-sm">Loading...</div>
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-16 md:pb-0">
      <Navigation />
      {children}
    </div>
  );
}

class ToolbarErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) { console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message); }
  render() { return this.state.hasError ? null : this.props.children; }
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message: string; stack: string }> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) { return { hasError: true, message: error.message || "Unknown runtime error", stack: error.stack || "" }; }
  componentDidCatch(err: Error) { console.error("[WebContainer preview] Root crash:", err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">{this.state.message}</p>
            {this.state.stack && <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">{this.state.stack}</pre>}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => { window.parent.postMessage({ type: "iframe-route-change", path: location.pathname }, "*"); }, [location.pathname]);
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/classroom" element={<RequireAuth><ClassroomPage /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><AppShell><Dashboard /></AppShell></RequireAuth>} />
              <Route path="/teachers" element={<RequireAuth><AppShell><TeachersPage /></AppShell></RequireAuth>} />
              <Route path="/teachers/:id" element={<RequireAuth><AppShell><TeacherProfilePage /></AppShell></RequireAuth>} />
              <Route path="/lessons" element={<RequireAuth><AppShell><LessonsPage /></AppShell></RequireAuth>} />
              <Route path="/calendar" element={<RequireAuth><AppShell><CalendarPage /></AppShell></RequireAuth>} />
              <Route path="/assignments" element={<RequireAuth><AppShell><AssignmentsPage /></AppShell></RequireAuth>} />
              <Route path="/progress" element={<RequireAuth><AppShell><ProgressPage /></AppShell></RequireAuth>} />
              <Route path="/ai-assistant" element={<RequireAuth><AppShell><AiAssistantPage /></AppShell></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><AppShell><ProfilePage /></AppShell></RequireAuth>} />
              <Route path="/teacher-dashboard" element={<RequireAuth><AppShell><TeacherDashboard /></AppShell></RequireAuth>} />
              <Route path="/messages" element={<RequireAuth><AppShell><MessagesPage /></AppShell></RequireAuth>} />
              <Route path="/community" element={<RequireAuth><AppShell><CommunityPage /></AppShell></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
