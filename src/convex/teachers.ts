import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
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

// ─── Get teacher's own profile ─────────────────────────
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId as string))
      .first();
  },
});

// ─── Search teachers (online only) ─────────────────────
export const search = query({
  args: {
    subject: v.optional(v.string()),
    classLevel: v.optional(v.string()),
    availableOnly: v.optional(v.boolean()),
    verifiedOnly: v.optional(v.boolean()),
    classType: v.optional(v.string()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let profiles = await ctx.db.query("teacherProfiles").collect();

    if (args.verifiedOnly !== false) {
      profiles = profiles.filter((p) => p.isVerified);
    }

    if (args.subject) {
      profiles = profiles.filter((p) => p.subjects.includes(args.subject!));
    }
    if (args.classLevel) {
      profiles = profiles.filter((p) => p.classLevels.includes(args.classLevel!));
    }
    if (args.availableOnly) {
      profiles = profiles.filter((p) => p.isAvailable);
    }
    if (args.classType) {
      profiles = profiles.filter((p) => p.classTypes?.includes(args.classType!));
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

// ─── Create teacher profile (initial) ─────────────────
export const createProfile = mutation({
  args: {
    name: v.string(),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
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
      title: args.title || "",
      bio: args.bio || "",
      subjects: args.subjects || [],
      classLevels: [],
      expertise: [],
      education: [],
      languages: args.languages || [],
      hourlyRate: 0,
      yearsExperience: 0,
      rating: 0,
      reviewCount: 0,
      totalStudents: 0,
      totalHours: 0,
      totalClassesCompleted: 0,
      isVerified: false,
      isAvailable: false,
      verificationStatus: "not_started",
      profileCompletionPct: 10,
    });

    await ctx.db.patch(userId, { role: "teacher" });

    return { success: true };
  },
});

// ─── Update teacher profile (step by step) ─────────────
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
    classLevels: v.optional(v.array(v.string())),
    expertise: v.optional(v.array(v.string())),
    education: v.optional(
      v.array(
        v.object({
          degree: v.string(),
          institution: v.string(),
          department: v.optional(v.string()),
          passingYear: v.optional(v.string()),
          result: v.optional(v.string()),
          certificateUrl: v.optional(v.string()),
        }),
      ),
    ),
    certifications: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    trialPrice: v.optional(v.number()),
    price30min: v.optional(v.number()),
    price60min: v.optional(v.number()),
    groupPrice: v.optional(v.number()),
    yearsExperience: v.optional(v.number()),
    totalTeachingExperience: v.optional(v.string()),
    currentPosition: v.optional(v.string()),
    previousExperience: v.optional(v.string()),
    teachingStyle: v.optional(v.array(v.string())),
    targetStudents: v.optional(v.array(v.string())),
    // Online teaching
    onlineTeachingExperience: v.optional(v.string()),
    preferredPlatforms: v.optional(v.array(v.string())),
    onlineTools: v.optional(v.array(v.string())),
    internetQuality: v.optional(v.string()),
    webcamAvailable: v.optional(v.boolean()),
    microphoneAvailable: v.optional(v.boolean()),
    digitalTabletAvailable: v.optional(v.boolean()),
    screenSharingCapability: v.optional(v.boolean()),
    // Class preferences
    preferredClassDuration: v.optional(v.string()),
    classTypes: v.optional(v.array(v.string())),
    maxStudentsPerClass: v.optional(v.number()),
    // General
    isAvailable: v.optional(v.boolean()),
    country: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
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

    // Calculate profile completion
    const p = { ...profile, ...updates };
    const fields = [
      p.name, p.title, p.bio, p.subjects.length > 0, p.education.length > 0,
      p.languages.length > 0, p.hourlyRate > 0, p.yearsExperience > 0,
      p.onlineTeachingExperience, (p.preferredPlatforms && p.preferredPlatforms.length > 0),
      (p.classTypes && p.classTypes.length > 0), p.preferredClassDuration,
    ];
    const filled = fields.filter(Boolean).length;
    updates.profileCompletionPct = Math.round((filled / fields.length) * 100);

    await ctx.db.patch(profile._id, updates);
    return { success: true };
  },
});

// ─── Submit for verification ───────────────────────────
export const submitForVerification = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Check NID is submitted
    if (!profile.nidNumber || !profile.nidFrontUrl || !profile.nidBackUrl) {
      throw new Error("NID verification documents are required");
    }

    // Check profile is complete enough
    if (profile.profileCompletionPct < 50) {
      throw new Error("Profile must be at least 50% complete to submit for verification");
    }

    await ctx.db.patch(profile._id, {
      verificationStatus: "under_review",
      nidSubmittedAt: Date.now(),
    });

    await ctx.db.insert("verificationLogs", {
      teacherId: userId as string,
      adminId: userId as string,
      action: "submitted",
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// ─── Submit NID verification ───────────────────────────
export const submitNidVerification = mutation({
  args: {
    nidNumber: v.string(),
    nidFrontUrl: v.string(),
    nidBackUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      nidNumber: args.nidNumber,
      nidFrontUrl: args.nidFrontUrl,
      nidBackUrl: args.nidBackUrl,
      nidVerified: false,
      nidSubmittedAt: Date.now(),
    });

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

    const existing = await ctx.db
      .query("availability")
      .filter((q) => q.eq(q.field("teacherId"), profile.userId))
      .collect();
    for (const slot of existing) {
      await ctx.db.delete(slot._id);
    }

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
