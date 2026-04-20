import { z } from "zod";

const experienceSchema = z.object({
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().max(500).optional(),
});

const educationSchema = z.object({
  degree: z.string().max(100).optional(),
  institution: z.string().max(100).optional(),
  year: z.number().min(1900).max(2100).optional(),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters")
    .optional(),
  location: z.string().max(100).optional(),
  headline: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string().min(1).max(50)).max(50).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
});
