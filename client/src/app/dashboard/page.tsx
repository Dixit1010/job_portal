"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Bookmark,
  LayoutDashboard,
  Upload,
  Trash2,
  Plus,
  X,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Building2,
  GraduationCap,
  BadgeCheck,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDashboardData } from "@/hooks/useDashboardData";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { SavedJobsList } from "@/components/dashboard/SavedJobsList";
import type { ProfileUser, Application, SavedJob, Experience, Education } from "@/hooks/useDashboardData";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "profile" | "applications" | "saved";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const basicInfoSchema = z.object({
  name: z.string().min(3, "At least 3 characters").max(30, "Max 30 characters"),
  location: z.string().max(100).optional(),
  headline: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
});
type BasicInfoForm = z.infer<typeof basicInfoSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  applied: { label: "Applied", icon: Clock, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CompletionRing({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct < 40 ? "#ef4444" : pct < 70 ? "#f59e0b" : "#22c55e";
  return (
    <svg width={88} height={88} className="-rotate-90">
      <circle cx={44} cy={44} r={r} strokeWidth={8} className="stroke-muted fill-none" />
      <circle
        cx={44}
        cy={44}
        r={r}
        strokeWidth={8}
        fill="none"
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={44}
        y={48}
        textAnchor="middle"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: "44px 44px",
          fontSize: 14,
          fontWeight: 700,
          fill: "currentColor",
        }}
      >
        {pct}%
      </text>
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobSeekerDashboard() {
  const router = useRouter();
  const {
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
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (isLoaded && clerkUser) {
    const role = String(
      clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role || ""
    ).toLowerCase();
    if (role === "employer" || role === "employer_pro") {
      router.replace("/employer/dashboard");
      return null;
    }
  }

  if (!isLoaded || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const completion = profile?.profileCompleted ?? 0;
  const savedJobs = profile?.savedJobs ?? [];
  const initials = (profile?.name ?? clerkUser.fullName ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const TABS = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "applications" as Tab, label: "Applications", icon: Briefcase },
    { id: "saved" as Tab, label: "Saved Jobs", icon: Bookmark },
  ];

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 sticky top-24 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">
                  {profile?.name ?? clerkUser.fullName}
                </h2>
                {profile?.headline && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {profile.headline}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  <BadgeCheck className="w-3 h-3" /> Job Seeker
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <CompletionRing pct={completion} />
              <p className="text-xs text-muted-foreground">Profile Completion</p>
              {completion < 100 && (
                <button
                  onClick={() => setActiveTab("profile")}
                  className="text-xs text-primary hover:underline"
                >
                  Complete your profile →
                </button>
              )}
            </div>

            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {id === "applications" && applications.length > 0 && (
                    <span
                      className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-mono ${
                        activeTab === id
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {applications.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {(profile?.location || profile?.email) && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                {profile?.email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab
                key="overview"
                profile={profile}
                applications={applications}
                savedJobs={savedJobs}
                completion={completion}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                key="profile"
                profile={profile}
                onSave={(data) => profileMutation.mutateAsync(data)}
                isSaving={profileMutation.isPending}
                onUploadResume={(f) => resumeUploadMutation.mutateAsync(f)}
                isUploadingResume={resumeUploadMutation.isPending}
                onDeleteResume={() => resumeDeleteMutation.mutateAsync()}
                isDeletingResume={resumeDeleteMutation.isPending}
              />
            )}
            {activeTab === "applications" && (
              <ApplicationsTab
                key="applications"
                applications={applications}
                isLoading={appsLoading}
                onDelete={(id) => deleteAppMutation.mutate(id)}
                isDeleting={deleteAppMutation.isPending}
              />
            )}
            {activeTab === "saved" && (
              <SavedTab key="saved" savedJobs={savedJobs} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  profile,
  applications,
  savedJobs,
  completion,
  onTabChange,
}: {
  profile?: ProfileUser;
  applications: Application[];
  savedJobs: SavedJob[];
  completion: number;
  onTabChange: (t: Tab) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.name?.split(" ")[0] ?? "there"}!
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your activity overview.</p>
      </div>

      <StatsCards
        applications={applications}
        savedJobs={savedJobs}
        completion={completion}
        onTabChange={onTabChange}
      />

      <RecentApplications
        applications={applications}
        onViewAll={() => onTabChange("applications")}
      />

      {completion < 80 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Complete your profile</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              A complete profile gets 4× more recruiter views. You&apos;re at {completion}%.
            </p>
          </div>
          <Button size="sm" onClick={() => onTabChange("profile")}>
            Complete
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Saved Tab ────────────────────────────────────────────────────────────────

function SavedTab({ savedJobs }: { savedJobs: SavedJob[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
        <span className="text-sm text-muted-foreground">{savedJobs.length} saved</span>
      </div>
      <SavedJobsList savedJobs={savedJobs} />
    </motion.div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({
  profile,
  onSave,
  isSaving,
  onUploadResume,
  isUploadingResume,
  onDeleteResume,
  isDeletingResume,
}: {
  profile?: ProfileUser;
  onSave: (data: object) => Promise<ProfileUser>;
  isSaving: boolean;
  onUploadResume: (f: File) => Promise<ProfileUser>;
  isUploadingResume: boolean;
  onDeleteResume: () => Promise<ProfileUser>;
  isDeletingResume: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: profile?.name ?? "",
      location: profile?.location ?? "",
      headline: profile?.headline ?? "",
      bio: profile?.bio ?? "",
    },
  });

  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>(profile?.experience ?? []);
  const [showExpForm, setShowExpForm] = useState(false);
  const [newExp, setNewExp] = useState<Experience>({
    title: "",
    company: "",
    startDate: "",
    current: false,
  });
  const [education, setEducation] = useState<Education[]>(profile?.education ?? []);
  const [showEduForm, setShowEduForm] = useState(false);
  const [newEdu, setNewEdu] = useState<Education>({
    degree: "",
    institution: "",
    year: undefined,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name ?? "",
      location: profile.location ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
    });
    setSkills(profile.skills ?? []);
    setExperiences(profile.experience ?? []);
    setEducation(profile.education ?? []);
  }, [profile, reset]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const addExperience = () => {
    if (!newExp.title || !newExp.company) return;
    setExperiences((prev) => [...prev, { ...newExp, _id: Date.now().toString() }]);
    setNewExp({ title: "", company: "", startDate: "", current: false });
    setShowExpForm(false);
  };

  const addEducation = () => {
    if (!newEdu.degree || !newEdu.institution) return;
    setEducation((prev) => [...prev, { ...newEdu, _id: Date.now().toString() }]);
    setNewEdu({ degree: "", institution: "", year: undefined });
    setShowEduForm(false);
  };

  const onSubmit = async (basicData: BasicInfoForm) => {
    await onSave({ ...basicData, skills, experience: experiences, education });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      {/* Basic Info */}
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6">
        <h2 className="font-semibold mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Basic Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Your full name" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="e.g. New York, NY"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              {...register("headline")}
              placeholder="e.g. Senior Frontend Developer at Acme"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              {...register("bio")}
              rows={4}
              placeholder="Tell employers about yourself..."
              className="w-full rounded-xl border border-input bg-background/50 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
          </div>

          {/* Skills */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-medium border border-primary/20"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSkills((prev) => prev.filter((x) => x !== s))}
                      className="ml-0.5 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSaving} className="min-w-28">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
            {saveSuccess && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-green-600 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </motion.span>
            )}
          </div>
        </form>
      </div>

      {/* Experience */}
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" /> Experience
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowExpForm((v) => !v)}
          >
            {showExpForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-1" />}
            {showExpForm ? "Cancel" : "Add"}
          </Button>
        </div>

        {experiences.length === 0 && !showExpForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No experience added yet.
          </p>
        )}

        <div className="space-y-3 mb-4">
          {experiences.map((exp, i) => (
            <div
              key={exp._id ?? i}
              className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/40"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{exp.title}</p>
                <p className="text-xs text-muted-foreground">{exp.company}</p>
                {exp.startDate && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setExperiences((prev) => prev.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showExpForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/20 rounded-xl border border-border/40 p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Job Title *</Label>
                    <Input
                      value={newExp.title}
                      onChange={(e) => setNewExp((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Frontend Developer"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Company *</Label>
                    <Input
                      value={newExp.company}
                      onChange={(e) => setNewExp((p) => ({ ...p, company: e.target.value }))}
                      placeholder="e.g. Acme Corp"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="date"
                      value={newExp.startDate}
                      onChange={(e) => setNewExp((p) => ({ ...p, startDate: e.target.value }))}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">End Date</Label>
                    <Input
                      type="date"
                      value={newExp.endDate ?? ""}
                      disabled={newExp.current}
                      onChange={(e) => setNewExp((p) => ({ ...p, endDate: e.target.value }))}
                      className="h-9 disabled:opacity-50"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExp.current}
                    onChange={(e) => setNewExp((p) => ({ ...p, current: e.target.checked }))}
                    className="accent-primary"
                  />
                  Currently working here
                </label>
                <Button
                  type="button"
                  size="sm"
                  onClick={addExperience}
                  disabled={!newExp.title || !newExp.company}
                >
                  Add Experience
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Education */}
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" /> Education
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEduForm((v) => !v)}
          >
            {showEduForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-1" />}
            {showEduForm ? "Cancel" : "Add"}
          </Button>
        </div>

        {education.length === 0 && !showEduForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No education added yet.
          </p>
        )}

        <div className="space-y-3 mb-4">
          {education.map((edu, i) => (
            <div
              key={edu._id ?? i}
              className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/40"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{edu.degree}</p>
                <p className="text-xs text-muted-foreground">{edu.institution}</p>
                {edu.year && (
                  <p className="text-xs text-muted-foreground mt-0.5">Class of {edu.year}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEducation((prev) => prev.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showEduForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/20 rounded-xl border border-border/40 p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Degree *</Label>
                    <Input
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu((p) => ({ ...p, degree: e.target.value }))}
                      placeholder="e.g. B.Sc. Computer Science"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Institution *</Label>
                    <Input
                      value={newEdu.institution}
                      onChange={(e) =>
                        setNewEdu((p) => ({ ...p, institution: e.target.value }))
                      }
                      placeholder="e.g. MIT"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Graduation Year</Label>
                    <Input
                      type="number"
                      value={newEdu.year ?? ""}
                      onChange={(e) =>
                        setNewEdu((p) => ({ ...p, year: Number(e.target.value) || undefined }))
                      }
                      placeholder="e.g. 2022"
                      className="h-9"
                      min={1900}
                      max={2100}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={addEducation}
                  disabled={!newEdu.degree || !newEdu.institution}
                >
                  Add Education
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resume */}
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-6">
        <h2 className="font-semibold mb-5 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Resume
        </h2>

        {profile?.resumeUrl ? (
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/40">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {profile.resumeFileName || "Resume.pdf"}
              </p>
              {profile.resumeUploadedAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Uploaded {formatDate(profile.resumeUploadedAt)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingResume}
              >
                {isUploadingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Replace"
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteResume}
                disabled={isDeletingResume}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isDeletingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              {isUploadingResume ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <p className="font-medium text-sm">
              {isUploadingResume ? "Uploading..." : "Upload your resume"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF only, max 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUploadResume(file);
            e.target.value = "";
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Applications Tab ─────────────────────────────────────────────────────────

function ApplicationsTab({
  applications,
  isLoading,
  onDelete,
  isDeleting,
}: {
  applications: Application[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <span className="text-sm text-muted-foreground">{applications.length} total</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl p-12 text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <h3 className="font-semibold mb-1">No applications yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start applying to jobs to track them here.
          </p>
          <Link href="/jobs">
            <Button>Find Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const s = STATUS_CONFIG[app.status];
            const StatusIcon = s.icon;
            const isOpen = expanded === app._id;
            return (
              <div
                key={app._id}
                className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : app._id)}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {app.job?.title ?? "Position Applied"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {app.job ? `${app.job.city}, ${app.job.country}` : app.address}
                      {app.createdAt && ` · ${formatDate(app.createdAt)}`}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium shrink-0 ${s.className}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {s.label}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 space-y-3 border-t border-border/40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Applicant Name
                            </p>
                            <p className="text-sm font-medium">{app.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                            <p className="text-sm font-medium">{app.phone}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs text-muted-foreground mb-0.5">Cover Letter</p>
                            <p className="text-sm line-clamp-3">{app.coverLetter}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          {app.resume?.url && (
                            <a
                              href={app.resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <FileText className="w-3.5 h-3.5 mr-1.5" /> View Resume
                              </Button>
                            </a>
                          )}
                          {app.job?._id && (
                            <Link href={`/jobs/${app.job._id}`}>
                              <Button variant="ghost" size="sm">
                                View Job
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(app._id)}
                            disabled={isDeleting}
                            className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
