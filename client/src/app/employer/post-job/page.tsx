"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CopyPlus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const postJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(30),
  description: z.string().min(30, "Description should be at least 30 characters").max(500),
  category: z.string().min(1, "Category is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(20, "Location needs full address (min 20 chars)"),
  salaryFrom: z.string().min(4, "Min salary (4 digits)").max(9),
  salaryTo: z.string().min(4, "Max salary (4 digits)").max(9),
});

type PostJobValues = z.infer<typeof postJobSchema>;

export default function PostJobPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostJobValues>({
    resolver: zodResolver(postJobSchema),
  });

  const onSubmit = async (data: PostJobValues) => {
    setIsLoading(true);
    try {
      const token = await getToken();
      await api.post("/job/post", {
        ...data,
        salaryFrom: Number(data.salaryFrom),
        salaryTo: Number(data.salaryTo),
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      router.push("/employer/dashboard");
    } catch (error: unknown) {
      console.error(error);
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      alert(message || "Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl py-8 min-h-screen">
      <Link href="/employer/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border rounded-3xl p-8 shadow-sm"
      >
        <div className="flex items-center mb-8 pb-6 border-b">
          <div className="bg-primary/10 text-primary p-3 rounded-2xl mr-4">
            <CopyPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Post a New Job</h1>
            <p className="text-muted-foreground text-sm mt-1">Fill out the details below to publish your opening.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" placeholder="e.g. Senior Frontend Engineer" {...register("title")} className="h-12 text-base" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g. Technology" {...register("category")} className="h-12" />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Full Address Base</Label>
                <Input id="location" placeholder="e.g. 123 Tech Street, Downtown Area" {...register("location")} className="h-12" />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="e.g. United States" {...register("country")} className="h-12" />
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="e.g. New York" {...register("city")} className="h-12" />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryFrom">Salary From ($)</Label>
                <Input id="salaryFrom" type="number" placeholder="e.g. 100000" {...register("salaryFrom")} className="h-12" />
                {errors.salaryFrom && <p className="text-sm text-destructive">{errors.salaryFrom.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryTo">Salary To ($)</Label>
                <Input id="salaryTo" type="number" placeholder="e.g. 150000" {...register("salaryTo")} className="h-12" />
                {errors.salaryTo && <p className="text-sm text-destructive">{errors.salaryTo.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <textarea 
                id="description" 
                placeholder="Describe the responsibilities, requirements, and benefits..." 
                {...register("description")}
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors resize-y"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t">
            <Link href="/employer/dashboard">
              <Button type="button" variant="outline" className="h-12 px-8">Cancel</Button>
            </Link>
            <Button type="submit" className="h-12 px-8 text-base shadow-md" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing...</>
              ) : (
                "Publish Job"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
