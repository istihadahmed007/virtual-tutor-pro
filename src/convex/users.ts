import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return null;
    const user = await ctx.db.get(userId as any);
    return user;
  },
});

export const getProfileStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return null;
    const user = await ctx.db.get(userId as any);
    if (!user) return null;

    const teacherProfile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    const studentProfile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const role = ("role" in user && user.role) || "student";
    let completionPct = 0;
    let isComplete = false;

    if (role === "teacher" && teacherProfile) {
      const fields = [
        teacherProfile.name,
        teacherProfile.title,
        teacherProfile.bio,
        teacherProfile.subjects.length > 0,
        teacherProfile.education,
        teacherProfile.languages.length > 0,
        teacherProfile.hourlyRate > 0,
      ];
      const filled = fields.filter(Boolean).length;
      completionPct = Math.round((filled / fields.length) * 100);
      isComplete = completionPct >= 80;
    } else if (role === "student" && studentProfile) {
      const fields = [
        studentProfile.name,
        studentProfile.subjects.length > 0,
        studentProfile.learningGoals.length > 0,
      ];
      const filled = fields.filter(Boolean).length;
      completionPct = Math.round((filled / fields.length) * 100);
      isComplete = completionPct >= 60;
    }

    return {
      role,
      isComplete,
      completionPercentage: completionPct,
      hasProfile: !!(teacherProfile || studentProfile),
      teacherProfile,
      studentProfile,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId as any);
    if (!user) throw new Error("User not found");

    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.country !== undefined) updates.country = args.country;
    if (args.preferredLanguage !== undefined) updates.preferredLanguage = args.preferredLanguage;
    if (args.image !== undefined) updates.image = args.image;

    await ctx.db.patch(userId as any, updates);
  },
});

export const setRole = mutation({
  args: { role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")) },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId as any, { role: args.role });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const teachers = await ctx.db.query("teacherProfiles").collect();
    const lessons = await ctx.db.query("lessons").collect();
    return {
      totalUsers: users.length,
      totalTeachers: teachers.length,
      totalLessons: lessons.length,
    };
  },
});
