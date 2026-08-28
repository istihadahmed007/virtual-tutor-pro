import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Get reviews for a teacher ─────────────────────────
export const listByTeacher = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("teacherId"), args.teacherId))
      .collect();
  },
});

// ─── Create a review ───────────────────────────────────
export const create = mutation({
  args: {
    teacherId: v.string(),
    rating: v.number(),
    comment: v.string(),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    await ctx.db.insert("reviews", {
      teacherId: args.teacherId,
      studentId: userId as string,
      studentName: user.name || "Student",
      rating: args.rating,
      comment: args.comment,
      subject: args.subject,
      createdAt: Date.now(),
    });

    // Update teacher's average rating
    const reviews = await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("teacherId"), args.teacherId))
      .collect();

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    }

    return { success: true };
  },
});
