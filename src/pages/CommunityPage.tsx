import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { communityPosts } from "@/lib/data";
import {
  ArrowLeft,
  Search,
  Heart,
  MessageCircle,
  Plus,
  Shield,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router";

const allSubjects = [...new Set(communityPosts.filter((p) => p.subject).map((p) => p.subject!))];

export default function CommunityPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = communityPosts.filter((p) => {
    if (selectedSubject && p.subject !== selectedSubject) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Button>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Learning Community</h1>
              <p className="text-sm text-slate-500 mt-1">Ask questions, share insights, and learn together</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2" size="sm">
              <Plus className="w-4 h-4" /> New Post
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedSubject("")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                !selectedSubject ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
              }`}
            >
              All Topics
            </button>
            {allSubjects.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === s ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {filtered.map((post) => (
          <Card key={post.id} className="border-stone-200/80 hover:shadow-lg hover:shadow-stone-200/50 transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {post.authorName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
                    {post.authorRole === "teacher" && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full">
                        <Shield className="w-2.5 h-2.5" /> Teacher
                      </span>
                    )}
                    {post.subject && (
                      <span className="px-1.5 py-0.5 bg-stone-100 text-slate-500 text-[10px] font-medium rounded-full">
                        {post.subject}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{post.content}</p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-stone-100 text-slate-500 text-[10px] font-medium rounded-full">
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
                    <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.repliesCount} replies</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {post.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900">No posts found</p>
            <p className="text-sm text-slate-500 mt-1">Try a different search or subject filter</p>
          </div>
        )}
      </div>
    </main>
  );
}
