import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(30, "Name cannot exceed 30 characters."),
  email: z.string().email("Please provide a valid email."),
  phone: z.string().min(10, "Phone number must be at least 10 characters.").max(15, "Phone number must be at most 15 characters."),
  password: z.string().min(8, "Password must be at least 8 characters long.").max(32, "Password cannot exceed 32 characters."),
  role: z.enum(["Job Seeker", "Employer"], { errorMap: () => ({ message: "Role must be Job Seeker or Employer." }) }),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  role: z.enum(["Job Seeker", "Employer"], { errorMap: () => ({ message: "Role must be Job Seeker or Employer." }) }),
});
