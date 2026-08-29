import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Admin: Get all stats ──────────────────────────────
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const users = await ctx.db.query("users").collect();
    const teachers = await ctx.db.query("teacherProfiles").collect();
    const students = await ctx.db.query("studentProfiles").collect();
    const lessons = await ctx.db.query("lessons").collect();
    const bookings = await ctx.db.query("bookings").collect();

    const verifiedTeachers = teachers.filter((t) => t.isVerified);
    const pendingTeachers = teachers.filter(
      (t) => t.verificationStatus === "under_review",
    );
    const pendingStudentVerifications = students.filter(
      (s) => s.verificationStatus === "pending",
    );
    const activeLessons = lessons.filter(
      (l) => l.status === "scheduled" || l.status === "in_progress",
    );
    const completedLessons = lessons.filter((l) => l.status === "completed");

    return {
      totalUsers: users.length,
      totalStudents: students.length,
      totalTeachers: teachers.length,
      verifiedTeachers: verifiedTeachers.length,
      pendingTeacherApplications: pendingTeachers.length,
      pendingStudentVerifications: pendingStudentVerifications.length,
      activeOnlineClasses: activeLessons.length,
      completedClasses: completedLessons.length,
      totalBookings: bookings.length,
    };
  },
});

// ─── Admin: List pending teacher verifications ─────────
export const listPendingTeachers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const teachers = await ctx.db.query("teacherProfiles").collect();
    return teachers.filter(
      (t) =>
        t.verificationStatus === "under_review" ||
        t.verificationStatus === "not_started",
    );
  },
});

// ─── Admin: List all teachers ─────────────────────────
export const listAllTeachers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    return await ctx.db.query("teacherProfiles").collect();
  },
});

// ─── Admin: Get teacher detail (includes NID) ─────────
export const getTeacherDetail = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();
    return profile;
  },
});

// ─── Admin: Approve teacher ───────────────────────────
export const approveTeacher = mutation({
  args: { teacherId: v.string(), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();
    if (!profile) throw new Error("Teacher profile not found");

    await ctx.db.patch(profile._id, {
      verificationStatus: "verified",
      isVerified: true,
      rejectionReason: undefined,
    });

    await ctx.db.insert("verificationLogs", {
      teacherId: args.teacherId,
      adminId: userId as string,
      action: "approved",
      reason: args.reason,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// ─── Admin: Reject teacher ────────────────────────────
export const rejectTeacher = mutation({
  args: { teacherId: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();
    if (!profile) throw new Error("Teacher profile not found");

    await ctx.db.patch(profile._id, {
      verificationStatus: "rejected",
      isVerified: false,
      rejectionReason: args.reason,
    });

    await ctx.db.insert("verificationLogs", {
      teacherId: args.teacherId,
      adminId: userId as string,
      action: "rejected",
      reason: args.reason,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// ─── Admin: Request resubmission ──────────────────────
export const requestResubmission = mutation({
  args: { teacherId: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();
    if (!profile) throw new Error("Teacher profile not found");

    await ctx.db.patch(profile._id, {
      verificationStatus: "needs_attention",
      rejectionReason: args.reason,
    });

    await ctx.db.insert("verificationLogs", {
      teacherId: args.teacherId,
      adminId: userId as string,
      action: "resubmission_requested",
      reason: args.reason,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// ─── Admin: Set user as admin ─────────────────────────
export const makeAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const currentUser = await ctx.db.get(userId);
    if (currentUser?.role !== "admin") throw new Error("Unauthorized");

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (users.length === 0) throw new Error("User not found");

    await ctx.db.patch(users[0]._id, { role: "admin" });
    return { success: true };
  },
});

// ─── Admin: List pending student verifications ────────
export const listPendingStudents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Unauthorized");

    const students = await ctx.db.query("studentProfiles").collect();
    return students.filter((s) => s.verificationStatus === "pending");
  },
});
