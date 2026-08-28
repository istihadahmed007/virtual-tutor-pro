import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// ─── Get all verified teachers ──────────────────────────
export const list = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("isVerified"), true))
      .collect();
    return profiles;
  },
});

// ─── Get all teacher profiles (including unverified) ────
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teacherProfiles").collect();
  },
});

// ─── Get teacher by ID ─────────────────────────────────
export const get = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();
    return profile;
  },
});

// ─── Search teachers ───────────────────────────────────
export const search = query({
  args: {
    subject: v.optional(v.string()),
    language: v.optional(v.string()),
    availableOnly: v.optional(v.boolean()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let profiles = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("isVerified"), true))
      .collect();

    if (args.subject) {
      profiles = profiles.filter((p) => p.subjects.includes(args.subject!));
    }
    if (args.language) {
      profiles = profiles.filter((p) => p.languages.includes(args.language!));
    }
    if (args.availableOnly) {
      profiles = profiles.filter((p) => p.isAvailable);
    }

    switch (args.sortBy) {
      case "rating":
        profiles.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        profiles.sort((a, b) => b.yearsExperience - a.yearsExperience);
        break;
      case "price-low":
        profiles.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        profiles.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "reviews":
        profiles.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        profiles.sort((a, b) => b.rating - a.rating);
    }

    return profiles;
  },
});

// ─── Create teacher profile ────────────────────────────
export const createProfile = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    subjects: v.array(v.string()),
    expertise: v.array(v.string()),
    education: v.string(),
    certifications: v.optional(v.array(v.string())),
    languages: v.array(v.string()),
    hourlyRate: v.number(),
    yearsExperience: v.number(),
    teachingStyle: v.optional(v.array(v.string())),
    targetStudents: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (existing) throw new Error("Profile already exists");

    await ctx.db.insert("teacherProfiles", {
      userId: userId as string,
      name: args.name,
      title: args.title,
      bio: args.bio,
      subjects: args.subjects,
      expertise: args.expertise,
      education: args.education,
      certifications: args.certifications,
      languages: args.languages,
      hourlyRate: args.hourlyRate,
      rating: 0,
      reviewCount: 0,
      totalStudents: 0,
      totalHours: 0,
      yearsExperience: args.yearsExperience,
      isVerified: false,
      isAvailable: false,
      teachingStyle: args.teachingStyle,
      targetStudents: args.targetStudents,
      verificationStatus: "not_started",
    });

    // Update user role to teacher
    await ctx.db.patch(userId, { role: "teacher" });

    return { success: true };
  },
});

// ─── Update teacher profile ────────────────────────────
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
    expertise: v.optional(v.array(v.string())),
    education: v.optional(v.string()),
    certifications: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    yearsExperience: v.optional(v.number()),
    teachingStyle: v.optional(v.array(v.string())),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) updates[key] = value;
    }

    await ctx.db.patch(profile._id, updates);
    return { success: true };
  },
});

// ─── Get teacher availability ──────────────────────────
export const getAvailability = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("availability")
      .filter((q) => q.eq(q.field("teacherId"), args.teacherId))
      .collect();
  },
});

// ─── Set teacher availability ──────────────────────────
export const setAvailability = mutation({
  args: {
    slots: v.array(
      v.object({
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
        isActive: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!profile) throw new Error("Teacher profile not found");

    // Delete existing availability
    const existing = await ctx.db
      .query("availability")
      .filter((q) => q.eq(q.field("teacherId"), profile.userId))
      .collect();
    for (const slot of existing) {
      await ctx.db.delete(slot._id);
    }

    // Insert new availability
    for (const slot of args.slots) {
      await ctx.db.insert("availability", {
        teacherId: profile.userId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
      });
    }

    return { success: true };
  },
});
