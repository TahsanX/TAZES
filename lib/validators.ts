import { z } from "zod";

export const alumniRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  department: z.string().trim().min(1, "Department is required").max(40),
  batch: z.coerce.number().int().min(1960).max(new Date().getFullYear()),
  currentPosition: z.string().trim().max(160).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  facebook: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
});
export type AlumniRegisterInput = z.infer<typeof alumniRegisterSchema>;

export const alumniAdminSchema = alumniRegisterSchema.extend({
  showPhone: z.coerce.boolean().default(false),
  showFacebook: z.coerce.boolean().default(false),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
});
export type AlumniAdminInput = z.infer<typeof alumniAdminSchema>;

export const alumniFilterSchema = z.object({
  batch: z.coerce.number().int().optional(),
  department: z.string().trim().optional(),
  company: z.string().trim().optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
});
export type AlumniFilterInput = z.infer<typeof alumniFilterSchema>;

export const committeeYearSchema = z.object({
  year: z.coerce.number().int().min(1960).max(2100),
  title: z.string().trim().min(2).max(160),
  isCurrent: z.coerce.boolean().default(false),
  summary: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const committeeMemberSchema = z.object({
  committeeYearId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(80),
  roleOrder: z.coerce.number().int().default(100),
  imageUrl: z.string().url().optional().or(z.literal("")),
  department: z.string().trim().max(40).optional().or(z.literal("")),
  batch: z.coerce.number().int().optional(),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  date: z.coerce.date(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  date: z.coerce.date(),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  posterUrl: z.string().url().optional().or(z.literal("")),
  published: z.coerce.boolean().default(true),
});

export const teacherSpeechSchema = z.object({
  name: z.string().trim().min(2).max(120),
  designation: z.string().trim().max(160).optional().or(z.literal("")),
  institution: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(2).max(4000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export const heroSlideSchema = z.object({
  imageUrl: z.string().url(),
  headline: z.string().trim().max(160).optional().or(z.literal("")),
  subheadline: z.string().trim().max(240).optional().or(z.literal("")),
  ctaText: z.string().trim().max(60).optional().or(z.literal("")),
  ctaHref: z.string().trim().max(300).optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  enabled: z.coerce.boolean().default(true),
});

export const certificateSchema = z.object({
  eventName: z.string().trim().min(2).max(200),
  recipientName: z.string().trim().min(2).max(120),
  presidentName: z.string().trim().min(2).max(120),
  secretaryName: z.string().trim().min(2).max(120),
  issueDate: z.coerce.date(),
});

export const siteSettingsSchema = z.object({
  orgName: z.string().trim().min(2).max(160),
  tagline: z.string().trim().max(240).optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  about: z.string().trim().max(8000).optional().or(z.literal("")),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  facebook: z.string().trim().max(300).optional().or(z.literal("")),
  youtube: z.string().trim().max(300).optional().or(z.literal("")),
  footerNote: z.string().trim().max(300).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  username: z.string().trim().min(3).max(60),
  password: z.string().min(1),
});
