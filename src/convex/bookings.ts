import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Get bookings for current user ─────────────────────
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

// ─── Get bookings for a teacher ────────────────────────
export const listByTeacher = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("teacherId"), userId as string))
      .collect();
  },
});

// ─── Create a booking ─────────────────────────────────
export const create = mutation({
  args: {
    teacherId: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    durationMinutes: v.number(),
    subject: v.string(),
    sessionType: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const teacherProfile = await ctx.db
      .query("teacherProfiles")
      .filter((q) => q.eq(q.field("userId"), args.teacherId))
      .first();
    if (!teacherProfile) throw new Error("Teacher not found");

    const meetingCode = `BK-${Date.now().toString(36).toUpperCase()}`;

    await ctx.db.insert("bookings", {
      userId: userId as string,
      teacherId: args.teacherId,
      teacherName: teacherProfile.name,
      studentName: user.name || "Student",
      date: args.date,
      timeSlot: args.timeSlot,
      durationMinutes: args.durationMinutes,
      subject: args.subject,
      sessionType: args.sessionType,
      price: args.price,
      status: "pending",
      meetingCode,
      createdAt: Date.now(),
    });

    return { success: true, meetingCode };
  },
});

// ─── Confirm booking (teacher) ─────────────────────────
export const confirm = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.teacherId !== (userId as string)) throw new Error("Not authorized");

    await ctx.db.patch(args.bookingId, { status: "confirmed" });
    return { success: true };
  },
});

// ─── Cancel booking ───────────────────────────────────
export const cancel = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    // Only the booker or teacher can cancel
    if (booking.userId !== (userId as string) && booking.teacherId !== (userId as string)) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.bookingId, { status: "cancelled" });
    return { success: true };
  },
});
