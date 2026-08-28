import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.STUDENT),
  v.literal(ROLES.TEACHER),
  v.literal(ROLES.ADMIN),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    // ─── Users ───────────────────────────────────────────
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      bio: v.optional(v.string()),
      timezone: v.optional(v.string()),
    }).index("email", ["email"]),

    // ─── Teacher Profiles ────────────────────────────────
    teacherProfiles: defineTable({
      userId: v.string(),
      name: v.string(),
      title: v.string(),
      bio: v.string(),
      subjects: v.array(v.string()),
      expertise: v.array(v.string()),
      education: v.string(),
      certifications: v.optional(v.array(v.string())),
      languages: v.array(v.string()),
      hourlyRate: v.number(),
      rating: v.number(),
      reviewCount: v.number(),
      totalStudents: v.number(),
      totalHours: v.number(),
      yearsExperience: v.number(),
      isVerified: v.boolean(),
      isAvailable: v.boolean(),
      avatarUrl: v.optional(v.string()),
      introVideoUrl: v.optional(v.string()),
      teachingStyle: v.optional(v.array(v.string())),
      introVideo: v.optional(v.string()),
    }).index("by_user", ["userId"]).index("by_subject", ["subjects"]).index("by_rating", ["rating"]),

    // ─── Teacher Availability ────────────────────────────
    availability: defineTable({
      teacherId: v.string(),
      dayOfWeek: v.number(), // 0=Sun, 6=Sat
      startTime: v.string(), // "09:00"
      endTime: v.string(),   // "17:00"
      isActive: v.boolean(),
    }).index("by_teacher", ["teacherId"]),

    // ─── Live Sessions / Classes ─────────────────────────
    liveSessions: defineTable({
      teacherId: v.string(),
      teacherName: v.string(),
      teacherAvatar: v.optional(v.string()),
      title: v.string(),
      subject: v.string(),
      description: v.optional(v.string()),
      scheduledAt: v.number(),
      durationMinutes: v.number(),
      maxStudents: v.number(),
      enrolledCount: v.number(),
      enrolledStudentIds: v.array(v.string()),
      status: v.union(
        v.literal("scheduled"),
        v.literal("live"),
        v.literal("ended"),
        v.literal("cancelled"),
      ),
      meetingCode: v.optional(v.string()),
      recordingUrl: v.optional(v.string()),
      sessionType: v.union(
        v.literal("1-to-1"),
        v.literal("small-group"),
        v.literal("trial"),
        v.literal("mentoring"),
        v.literal("exam-prep"),
        v.literal("project-help"),
      ),
      price: v.number(),
    }).index("by_teacher", ["teacherId"]).index("by_status", ["status"]).index("by_scheduled", ["scheduledAt"]),

    // ─── Bookings ────────────────────────────────────────
    bookings: defineTable({
      userId: v.string(),
      teacherId: v.string(),
      teacherName: v.string(),
      studentName: v.string(),
      sessionId: v.optional(v.string()),
      date: v.string(),
      timeSlot: v.string(),
      durationMinutes: v.number(),
      subject: v.string(),
      sessionType: v.string(),
      price: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
      meetingCode: v.optional(v.string()),
    }).index("by_user", ["userId"]).index("by_teacher", ["teacherId"]),

    // ─── Class Messages (real-time chat) ─────────────────
    classMessages: defineTable({
      sessionId: v.string(),
      senderId: v.string(),
      senderName: v.string(),
      senderRole: v.string(),
      text: v.string(),
      timestamp: v.number(),
      type: v.union(
        v.literal("chat"),
        v.literal("question"),
        v.literal("reaction"),
        v.literal("hand-raise"),
        v.literal("system"),
      ),
    }).index("by_session", ["sessionId"]),

    // ─── Direct Messages ─────────────────────────────────
    conversations: defineTable({
      participants: v.array(v.string()),
      lastMessage: v.string(),
      lastMessageAt: v.number(),
      lastSenderId: v.string(),
    }).index("by_participants", ["participants"]),

    messages: defineTable({
      conversationId: v.string(),
      senderId: v.string(),
      senderName: v.string(),
      text: v.string(),
      timestamp: v.number(),
      read: v.boolean(),
    }).index("by_conversation", ["conversationId"]),

    // ─── Community Posts ─────────────────────────────────
    communityPosts: defineTable({
      authorId: v.string(),
      authorName: v.string(),
      authorRole: v.string(),
      authorAvatar: v.optional(v.string()),
      title: v.string(),
      content: v.string(),
      subject: v.optional(v.string()),
      tags: v.array(v.string()),
      likesCount: v.number(),
      repliesCount: v.number(),
      createdAt: v.number(),
    }).index("by_subject", ["subject"]).index("by_created", ["createdAt"]),

    communityReplies: defineTable({
      postId: v.string(),
      authorId: v.string(),
      authorName: v.string(),
      authorRole: v.string(),
      content: v.string(),
      likesCount: v.number(),
      createdAt: v.number(),
    }).index("by_post", ["postId"]),

    // ─── Reviews ─────────────────────────────────────────
    reviews: defineTable({
      teacherId: v.string(),
      studentId: v.string(),
      studentName: v.string(),
      rating: v.number(),
      comment: v.string(),
      subject: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_teacher", ["teacherId"]),

    // ─── Session Notes / Feedback ────────────────────────
    sessionNotes: defineTable({
      sessionId: v.string(),
      teacherId: v.string(),
      studentId: v.string(),
      feedback: v.string(),
      homework: v.optional(v.string()),
      strengths: v.array(v.string()),
      improvements: v.array(v.string()),
      createdAt: v.number(),
    }).index("by_session", ["sessionId"]),

    // ─── AI Learning Summaries ───────────────────────────
    learningSummaries: defineTable({
      sessionId: v.string(),
      studentId: v.string(),
      whatYouLearned: v.array(v.string()),
      whatYouStruggled: v.array(v.string()),
      whatToPractice: v.array(v.string()),
      recommendedNext: v.optional(v.string()),
      generatedAt: v.number(),
    }).index("by_student", ["studentId"]),

    // ─── Learning Progress ───────────────────────────────
    learningProgress: defineTable({
      userId: v.string(),
      totalHoursLearned: v.number(),
      classesCompleted: v.number(),
      subjectsStudied: v.array(v.string()),
      streakDays: v.number(),
      lastActiveDate: v.number(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
