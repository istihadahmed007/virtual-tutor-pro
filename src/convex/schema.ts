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

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      targetExam: v.optional(v.string()),
      subscription: v.optional(v.union(v.literal("free"), v.literal("pro"))),
      streak: v.optional(v.number()),
    }).index("email", ["email"]),

    tutors: defineTable({
      name: v.string(),
      title: v.string(),
      subject: v.string(),
      rating: v.number(),
      reviewCount: v.number(),
      yearsExperience: v.number(),
      hourlyRate: v.number(),
      bio: v.string(),
      avatarUrl: v.optional(v.string()),
      languages: v.array(v.string()),
      isAvailable: v.boolean(),
    }),

    exams: defineTable({
      title: v.string(),
      subject: v.string(),
      totalQuestions: v.number(),
      durationMinutes: v.number(),
      questions: v.array(
        v.object({
          id: v.number(),
          text: v.string(),
          options: v.array(v.object({ id: v.string(), text: v.string() })),
          correctAnswer: v.string(),
          explanation: v.string(),
          difficulty: v.string(),
        }),
      ),
    }),

    examResults: defineTable({
      userId: v.string(),
      examId: v.optional(v.string()),
      subject: v.string(),
      score: v.number(),
      totalQuestions: v.number(),
      correctCount: v.number(),
      timeSpentSeconds: v.number(),
      completedAt: v.number(),
    }).index("by_user", ["userId"]),

    studySessions: defineTable({
      userId: v.string(),
      subject: v.string(),
      topic: v.string(),
      durationMinutes: v.number(),
      date: v.number(),
    }).index("by_user", ["userId"]),

    bookings: defineTable({
      userId: v.string(),
      tutorId: v.string(),
      tutorName: v.string(),
      studentName: v.string(),
      date: v.string(),
      timeSlot: v.string(),
      subject: v.string(),
      status: v.union(
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
