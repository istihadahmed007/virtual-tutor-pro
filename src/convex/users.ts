import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// ─── Get the current signed in user ────────────────────
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// ─── Internal helper ───────────────────────────────────
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  return await ctx.db.get(userId);
};

// ─── Check if user has completed their profile ─────────
export const getProfileStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const role = user.role;
    let isComplete = false;
    let completionPercentage = 0;
    let nextStep = "";

    if (role === "teacher") {
      const profile = await ctx.db
        .query("teacherProfiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (!profile) {
        nextStep = "complete_teacher_profile";
      } else {
        let fields = 0;
        let total = 8;
        if (profile.bio) fields++;
        if (profile.subjects.length > 0) fields++;
        if (profile.education) fields++;
        if (profile.languages.length > 0) fields++;
        if (profile.hourlyRate > 0) fields++;
        if (profile.yearsExperience > 0) fields++;
        if (profile.isVerified) fields++;
        if (profile.teachingStyle && profile.teachingStyle.length > 0) fields++;

        completionPercentage = Math.round((fields / total) * 100);
        isComplete = profile.isVerified;
        if (!isComplete) nextStep = "pending_verification";
      }
    } else {
      // Student
      completionPercentage = user.name ? 50 : 0;
      if (user.name) completionPercentage = 100;
      isComplete = !!user.name;
    }

    return {
      role,
      isComplete,
      completionPercentage,
      nextStep,
      hasTeacherProfile: role === "teacher",
    };
  },
});

// ─── Update user profile ──────────────────────────────
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.image !== undefined) updates.image = args.image;

    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});

// ─── Set user role ────────────────────────────────────
export const setRole = mutation({
  args: { role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Only allow role change if not already set
    if (user.role && user.role !== "student") {
      throw new Error("Role already set. Contact support to change.");
    }

    await ctx.db.patch(userId, { role: args.role });
    return { success: true };
  },
});

// ─── Admin: list all users ────────────────────────────
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    return await ctx.db.query("users").collect();
  },
});

// ─── Admin: get platform stats ─────────────────────────
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") return null;

    const allUsers = await ctx.db.query("users").collect();
    const teachers = await ctx.db.query("teacherProfiles").collect();
    const sessions = await ctx.db.query("liveSessions").collect();
    const bookings = await ctx.db.query("bookings").collect();
    const reviews = await ctx.db.query("reviews").collect();

    return {
      totalUsers: allUsers.length,
      totalStudents: allUsers.filter((u) => u.role === "student").length,
      totalTeachers: teachers.length,
      verifiedTeachers: teachers.filter((t) => t.isVerified).length,
      totalSessions: sessions.length,
      liveSessions: sessions.filter((s) => s.status === "live").length,
      totalBookings: bookings.length,
      completedBookings: bookings.filter((b) => b.status === "completed").length,
      totalReviews: reviews.length,
    };
  },
});
