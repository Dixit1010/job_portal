import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Please provide a valid email."),
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters."),
  phone: z.string().min(7, "Please provide a valid phone number."),
  address: z.string().min(5, "Please provide a valid address."),
  jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Job ID format"),
});
