import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Globe, Clock, Shield, Save } from "lucide-react";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profileStatus = useQuery(api.users.getProfileStatus);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [timezone, setTimezone] = useState(user?.timezone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, bio, timezone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4"><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
          <h1 className="text-2xl font-extrabold text-slate-900">Profile & Settings</h1>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name || "User"}</h2>
              <p className="text-sm text-slate-500">{user?.email || "No email"}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-semibold rounded-full">{profileStatus?.role || "student"}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input value={user?.email || ""} disabled className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="Tell us about yourself..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Timezone</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" placeholder="e.g. Asia/Dhaka" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-sm text-slate-600">Account Type</span>
              <span className="text-sm font-semibold text-slate-900 capitalize">{profileStatus?.role || "Student"}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-sm text-slate-600">Profile Completion</span>
              <span className="text-sm font-semibold text-slate-900">{profileStatus?.completionPercentage || 0}%</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-600">Authentication</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
