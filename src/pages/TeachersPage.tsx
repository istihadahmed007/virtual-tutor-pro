import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { teachers, subjects } from "@/lib/data";
import type { Teacher } from "@/lib/types";
import {
  ArrowLeft,
  Search,
  Star,
  Shield,
  Clock,
  Users,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";

const allSubjects = [...new Set(teachers.flatMap((t) => t.subjects))];
const allLanguages = [...new Set(teachers.flatMap((t) => t.languages))];
const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "price-low", label: "Lowest Price" },
  { value: "price-high", label: "Highest Price" },
  { value: "reviews", label: "Most Reviews" },
];

export default function TeachersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [sortBy, setSortBy] = useState("rating");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...teachers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q)) ||
          t.expertise.some((e) => e.toLowerCase().includes(q)),
      );
    }
    if (selectedSubject) {
      result = result.filter((t) => t.subjects.includes(selectedSubject));
    }
    if (selectedLanguage) {
      result = result.filter((t) => t.languages.includes(selectedLanguage));
    }
    if (showAvailableOnly) {
      result = result.filter((t) => t.isAvailable);
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        result.sort((a, b) => b.yearsExperience - a.yearsExperience);
        break;
      case "price-low":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [search, selectedSubject, selectedLanguage, sortBy, showAvailableOnly]);

  const clearFilters = () => {
    setSearch("");
    setSelectedSubject("");
    setSelectedLanguage("");
    setShowAvailableOnly(false);
    setSortBy("rating");
  };

  const hasFilters = selectedSubject || selectedLanguage || showAvailableOnly;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Find a Teacher</h1>
          <p className="text-slate-500 mt-2">Browse expert teachers and book live sessions</p>

          {/* Search */}
          <div className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, subject, or expertise..."
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 ${showFilters ? "bg-teal-50 border-teal-200 text-teal-700" : ""}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-teal-500 rounded-full" />}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-teal-600 font-medium hover:text-teal-700">
                    Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">All subjects</option>
                    {allSubjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {/* Language */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">All languages</option>
                    {allLanguages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                {/* Available Now */}
                <div className="flex items-end">
                  <button
                    onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      showAvailableOnly
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-stone-200 text-slate-600 hover:bg-stone-50"
                    }`}
                  >
                    {showAvailableOnly ? "✓ " : ""}Available Now
                  </button>
                </div>
                {/* Sort */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{filtered.length}</span> teachers found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} navigate={navigate} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900">No teachers found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function TeacherCard({ teacher, navigate }: { teacher: Teacher; navigate: ReturnType<typeof useNavigate> }) {
  const matchScore = teacher.reviewCount > 200 ? "Great for most students" : teacher.yearsExperience > 10 ? "Highly experienced" : "Great value";

  return (
    <div
      className="bg-white rounded-2xl border border-stone-200/80 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/5 transition-all cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/teachers/${teacher.id}`)}
    >
      {/* Match badge */}
      <div className="px-5 pt-4 pb-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
          {matchScore}
        </span>
      </div>

      <div className="p-5 pt-3">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              {teacher.name.charAt(0)}
            </div>
            {teacher.isAvailable && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900 truncate">{teacher.name}</h3>
              {teacher.isVerified && <Shield className="w-4 h-4 text-teal-500 shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{teacher.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-slate-900">{teacher.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({teacher.reviewCount} reviews)</span>
              <span className="text-slate-200">·</span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {teacher.yearsExperience}yr
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{teacher.bio}</p>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {teacher.subjects.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-stone-100 text-slate-600 text-[10px] font-medium rounded-full">
              {s}
            </span>
          ))}
          {teacher.languages.map((l) => (
            <span key={l} className="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-medium rounded-full">
              {l}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <div>
            <span className="text-xl font-extrabold text-slate-900">৳{teacher.hourlyRate.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-0.5">/hour</span>
          </div>
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={(e) => { e.stopPropagation(); navigate(`/teachers/${teacher.id}`); }}
          >
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
}
