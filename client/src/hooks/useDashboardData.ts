import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  year?: number;
}

export interface SavedJob {
  _id: string;
  title: string;
  city: string;
  country: string;
  category?: string;
  fixedSalary?: number;
  salaryFrom?: number;
  salaryTo?: number;
  jobPostedOn?: string;
  expired?: boolean;
}

export interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  phone?: number;
  role: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  profileCompleted?: number;
  savedJobs?: SavedJob[];
  createdAt?: string;
}

export interface Application {
  _id: string;
  name: string;
  email: string;
  status: "applied" | "shortlisted" | "rejected";
  coverLetter: string;
  address: string;
  phone: number;
  resume: { url: string };
  job?: { _id: string; title: string; city: string; country: string; category?: string };
  createdAt?: string;
}

export function useDashboardData() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded } = useUser();
  const queryClient = useQueryClient();

  const authHeaders = async () => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const headers = await authHeaders();
      const res = await api.get("/user/profile", { headers });
      return res.data.user as ProfileUser;
    },
    enabled: isLoaded && !!clerkUser,
    retry: 2,
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const headers = await authHeaders();
      const res = await api.get("/application/jobseeker/getall", { headers });
      return res.data.applications as Application[];
    },
    enabled: isLoaded && !!clerkUser,
    retry: 2,
  });

  const profileMutation = useMutation({
    mutationFn: async (data: object) => {
      const headers = await authHeaders();
      const res = await api.put("/user/profile", data, { headers });
      return res.data.user as ProfileUser;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const resumeUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const headers = await authHeaders();
      const form = new FormData();
      form.append("resume", file);
      const res = await api.post("/user/resume", form, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      return res.data.user as ProfileUser;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const resumeDeleteMutation = useMutation({
    mutationFn: async () => {
      const headers = await authHeaders();
      const res = await api.delete("/user/resume", { headers });
      return res.data.user as ProfileUser;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const deleteAppMutation = useMutation({
    mutationFn: async (id: string) => {
      const headers = await authHeaders();
      await api.delete(`/application/delete/${id}`, { headers });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-applications"] }),
  });

  return {
    profile,
    profileLoading,
    applications,
    appsLoading,
    isLoaded,
    clerkUser,
    profileMutation,
    resumeUploadMutation,
    resumeDeleteMutation,
    deleteAppMutation,
  };
}
