import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  country: string;
  city: string;
  location: string;
  fixedSalary?: number;
  salaryFrom?: number;
  salaryTo?: number;
  expired: boolean;
  jobPostedOn: string;
  postedBy: { _id: string; name: string };
}

export interface Pagination {
  totalPages: number;
  currentPage: number;
  totalJobs: number;
}

export interface JobsParams {
  keyword?: string;
  location?: string;
  category?: string;
  salary?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export function useJobs(params: JobsParams = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined)
  );

  return useQuery({
    queryKey: ["jobs", cleanParams],
    queryFn: async () => {
      const res = await api.get("/job/getall", { params: cleanParams });
      return res.data as { jobs: Job[]; pagination: Pagination };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
