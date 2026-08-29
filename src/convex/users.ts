import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const getProfileStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const teacherProfile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId as string))
      .first();

    const studentProfile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .first();

    const role = user.role || "student";
    let completionPct = 0;
    let isComplete = false;

    if (role === "teacher" && teacherProfile) {
      completionPct = teacherProfile.profileCompletionPct || 0;
      isComplete = completionPct >= 80;
    } else if (role === "student" && studentProfile) {
      completionPct = studentProfile.profileCompletionPct || 0;
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
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    country: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.gender !== undefined) updates.gender = args.gender;
    if (args.dateOfBirth !== undefined) updates.dateOfBirth = args.dateOfBirth;
    if (args.country !== undefined) updates.country = args.country;
    if (args.preferredLanguage !== undefined) updates.preferredLanguage = args.preferredLanguage;
    if (args.image !== undefined) updates.image = args.image;
    await ctx.db.patch(userId, updates);
  },
});

export const setRole = mutation({
  args: { role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, { role: args.role });
  },
});

// ─── Create student profile ────────────────────────────
export const createStudentProfile = mutation({
  args: {
    name: v.string(),
    institution: v.optional(v.string()),
    studentIdNumber: v.optional(v.string()),
    educationLevel: v.optional(v.string()),
    classLevel: v.optional(v.string()),
    department: v.optional(v.string()),
    board: v.optional(v.string()),
    subjects: v.array(v.string()),
    learningGoals: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .first();
    if (existing) throw new Error("Student profile already exists");

    await ctx.db.insert("studentProfiles", {
      userId: userId as string,
      name: args.name,
      institution: args.institution,
      studentIdNumber: args.studentIdNumber,
      educationLevel: args.educationLevel,
      classLevel: args.classLevel,
      department: args.department,
      board: args.board,
      subjects: args.subjects,
      learningGoals: args.learningGoals || [],
      verificationStatus: "not_submitted",
      profileCompletionPct: 20,
    });

    await ctx.db.patch(userId, { role: "student" });

    return { success: true };
  },
});

// ─── Update student profile ────────────────────────────
export const updateStudentProfile = mutation({
  args: {
    institution: v.optional(v.string()),
    studentIdNumber: v.optional(v.string()),
    educationLevel: v.optional(v.string()),
    classLevel: v.optional(v.string()),
    department: v.optional(v.string()),
    board: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
    learningGoals: v.optional(v.array(v.string())),
    studentCardUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .first();
    if (!profile) throw new Error("Student profile not found");

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) updates[key] = value;
    }

    // Recalculate completion
    const p = { ...profile, ...updates };
    const fields = [
      p.name, p.institution, p.educationLevel, p.classLevel, p.board,
      p.subjects.length > 0, p.learningGoals.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    updates.profileCompletionPct = Math.round((filled / fields.length) * 100);

    if (args.studentCardUrl) {
      updates.verificationStatus = "pending";
    }

    await ctx.db.patch(profile._id, updates);
    return { success: true };
  },
});

// ─── Submit student card for verification ──────────────
export const submitStudentVerification = mutation({
  args: { studentCardUrl: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .first();
    if (!profile) throw new Error("Student profile not found");

    await ctx.db.patch(profile._id, {
      studentCardUrl: args.studentCardUrl,
      verificationStatus: "pending",
    });

    return { success: true };
  },
});

// ─── Get student profile ───────────────────────────────
export const getStudentProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .first();
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
