import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const now = Date.now();
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_scheduled", (q) => q.gte("scheduledAt", now))
      .collect();
    return lessons.filter(
      (l) => l.studentId === (userId as string) || l.teacherId === (userId as string),
    );
  },
});

export const listByStudent = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

export const listByTeacher = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

export const listByDateRange = query({
  args: { startDate: v.number(), endDate: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const all = await ctx.db
      .query("lessons")
      .withIndex("by_scheduled", (q) =>
        q.gte("scheduledAt", args.startDate).lte("scheduledAt", args.endDate),
      )
      .collect();
    return all.filter(
      (l) => l.studentId === (userId as string) || l.teacherId === (userId as string),
    );
  },
});

export const get = query({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId as any);
  },
});

export const create = mutation({
  args: {
    teacherId: v.string(),
    teacherName: v.string(),
    studentId: v.string(),
    studentName: v.string(),
    subject: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.number(),
    durationMinutes: v.number(),
    sessionType: v.union(
      v.literal("1-to-1"),
      v.literal("small-group"),
      v.literal("trial"),
      v.literal("mentoring"),
      v.literal("exam-prep"),
      v.literal("project-help"),
    ),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lessons", {
      ...args,
      status: "scheduled",
    });
  },
});

export const updateStatus = mutation({
  args: {
    lessonId: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.lessonId as any, { status: args.status });
  },
});

export const addFeedback = mutation({
  args: {
    lessonId: v.string(),
    feedback: v.string(),
    homework: v.optional(v.string()),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, any> = { teacherFeedback: args.feedback };
    if (args.homework) updates.homework = args.homework;
    if (args.rating) updates.studentRating = args.rating;
    await ctx.db.patch(args.lessonId as any, updates);
  },
});
