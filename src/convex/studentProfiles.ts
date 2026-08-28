import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
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

export const upsert = mutation({
  args: {
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    educationLevel: v.optional(v.string()),
    subjects: v.array(v.string()),
    learningGoals: v.array(v.string()),
    skillLevel: v.optional(v.string()),
    preferredTeachingStyle: v.optional(v.string()),
    weeklyHours: v.optional(v.number()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("studentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .first();

    const fields = [
      args.name,
      args.subjects.length > 0,
      args.learningGoals.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    const profileCompletionPct = Math.round((filled / fields.length) * 100);

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, profileCompletionPct });
    } else {
      await ctx.db.insert("studentProfiles", {
        userId: userId as string,
        ...args,
        profileCompletionPct,
      });
    }
  },
});
