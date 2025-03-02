import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),

    email: z
      .string()
      .email("Invalid email address")
      .min(5, "Email must be at least 5 characters")
      .max(255, "Email cannot exceed 255 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createPostSchema = z
  .object({
    categoryId: z.string().uuid(),

    title: z.string().min(1, "Title is required"),

    content: z.string().optional(),

    contentType: z.enum(["text", "image", "video", "link"]),

    url: z.string().url().optional(),

    file: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.contentType === "text" &&
      (!data.content || data.content.trim() === "")
    ) {
      ctx.addIssue({
        path: ["content"],
        message: "Content is required when contentType is text",
        code: "custom",
      });
    }

    if (data.contentType === "link" && !data.url) {
      ctx.addIssue({
        path: ["url"],
        message: "URL is required when contentType is link",
        code: "custom",
      });
    }

    if (["image", "video"].includes(data.contentType) && !data.file) {
      ctx.addIssue({
        path: ["file"],
        message: "File is required when contentType is image or video",
        code: "custom",
      });
    }
  });

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(1000, { message: "Comment must be less than 1000 characters" })
    .trim(),
});
