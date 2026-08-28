import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByStudent = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assignments")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

export const listByTeacher = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assignments")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
    if (!userId) return [];
    const all = await ctx.db
      .query("assignments")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();
    return all.filter((a) => a.status === "assigned" || a.status === "in_progress");
  },
});

export const create = mutation({
  args: {
    teacherId: v.string(),
    teacherName: v.string(),
    studentId: v.string(),
    studentName: v.string(),
    lessonId: v.optional(v.string()),
    subject: v.string(),
    title: v.string(),
    description: v.string(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("assignments", {
      ...args,
      status: "assigned",
      createdAt: Date.now(),
    });
  },
});

export const submit = mutation({
  args: {
    assignmentId: v.string(),
    attachments: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.assignmentId as any, {
      status: "submitted",
      attachments: args.attachments,
    });
  },
});

export const grade = mutation({
  args: {
    assignmentId: v.string(),
    grade: v.string(),
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.assignmentId as any, {
      status: "graded",
      grade: args.grade,
      feedback: args.feedback,
    });
  },
});
