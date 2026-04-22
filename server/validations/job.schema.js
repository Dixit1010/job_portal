import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(50, "Title cannot exceed 50 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string().min(1, "Category is required."),
  country: z.string().min(1, "Country is required."),
  city: z.string().min(1, "City is required."),
  location: z.string().min(1, "Location is required."),
  fixedSalary: z.preprocess((val) => (val === undefined || val === null || val === "") ? undefined : Number(val), z.number().positive().optional()),
  salaryFrom: z.preprocess((val) => (val === undefined || val === null || val === "") ? undefined : Number(val), z.number().positive().optional()),
  salaryTo: z.preprocess((val) => (val === undefined || val === null || val === "") ? undefined : Number(val), z.number().positive().optional()),
}).refine(data => {
  if (data.fixedSalary || (data.salaryFrom && data.salaryTo)) {
    return true;
  }
  return false;
}, { message: "Please provide either fixed salary or both salaryFrom and salaryTo." });
