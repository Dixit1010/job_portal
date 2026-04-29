"use client";

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight, Briefcase, X } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/shared/JobCard";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Technology", "Design", "Marketing", "Finance",
  "Healthcare", "Education", "Engineering", "Sales",
  "Data Science", "Operations", "Legal", "HR",
];

const SALARY_OPTIONS = [
  { label: "Any", value: "" },
  { label: "$50k+", value: "50000" },
  { label: "$80k+", value: "80000" },
  { label: "$100k+", value: "100000" },
  { label: "$150k+", value: "150000" },
];

function JobCardSkeleton() {
  return (
    <div className="bg-card/60 border border-border/50 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted/60 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted/60 rounded w-3/4" />
          <div className="h-3 bg-muted/40 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="h-6 bg-muted/40 rounded-md w-24" />
        <div className="h-6 bg-muted/40 rounded-md w-20" />
        <div className="h-6 bg-muted/40 rounded-md w-16" />
      </div>
      <div className="pt-4 border-t border-border/40 flex justify-between">
        <div className="h-3 bg-muted/40 rounded w-16" />
        <div className="h-7 bg-muted/40 rounded w-24" />
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [inputKeyword, setInputKeyword] = useState("");
  const [inputLocation, setInputLocation] = useState("");
  const [committedKeyword, setCommittedKeyword] = useState("");
  const [committedLocation, setCommittedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading, isError } = useJobs({
    keyword: committedKeyword,
    location: committedLocation,
    category: selectedCategory,
    salary: minSalary,
    sortBy,
    page,
    limit: 9,
  });

  const jobs = data?.jobs ?? [];
  const pagination = data?.pagination;

  function handleSearch() {
    setCommittedKeyword(inputKeyword);
    setCommittedLocation(inputLocation);
    setPage(1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function handleCategoryToggle(cat: string) {
    setSelectedCategory((prev) => (prev === cat ? "" : cat));
    setPage(1);
  }

  function handleSalaryChange(val: string) {
    setMinSalary(val);
    setPage(1);
  }

  function handleSortChange(val: string) {
    setSortBy(val);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header + Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 sm:mb-3">
              Find your next role.
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              {pagination
                ? `${pagination.totalJobs.toLocaleString()} opportunities available`
                : "Explore opportunities across top companies."}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-card/50 backdrop-blur-md border border-border/50 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(selectedCategory || minSalary || sortBy) && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            {/* Search bar */}
            <div className="flex bg-card/50 backdrop-blur-md border border-border/50 rounded-full p-1.5 w-full md:w-auto shadow-sm min-w-0">
              <div className="flex items-center pl-4 pr-2 w-full md:w-64 min-w-0">
                <Search className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={inputKeyword}
                  onChange={(e) => setInputKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Job title or keyword"
                  className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-muted-foreground/50 min-w-0"
                />
              </div>
              <div className="hidden sm:flex items-center pl-4 pr-2 border-l border-border/30 w-44">
                <MapPin className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="City or country"
                  className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-muted-foreground/50"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-all hover:bg-primary/90 flex-shrink-0"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[min(80vw,320px)] bg-background border-l border-border/50 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-base">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-md hover:bg-muted/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Sort by</p>
                <div className="space-y-2">
                  {[{ label: "Newest first", value: "" }, { label: "Highest salary", value: "salary" }].map(({ label, value }) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="sort-mobile" checked={sortBy === value} onChange={() => handleSortChange(value)} className="text-primary" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Salary */}
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Min. Salary</p>
                <div className="space-y-2">
                  {SALARY_OPTIONS.map(({ label, value }) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="salary-mobile" checked={minSalary === value} onChange={() => handleSalaryChange(value)} className="text-primary" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Category</p>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={selectedCategory === cat} onChange={() => handleCategoryToggle(cat)} className="rounded text-primary" />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4">

            {/* Sort */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Newest first", value: "" },
                  { label: "Highest salary", value: "salary" },
                ].map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === value}
                      onChange={() => handleSortChange(value)}
                      className="text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Min Salary */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Min. Salary
              </h3>
              <div className="space-y-2">
                {SALARY_OPTIONS.map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="salary"
                      checked={minSalary === value}
                      onChange={() => handleSalaryChange(value)}
                      className="text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat}
                      onChange={() => handleCategoryToggle(cat)}
                      className="rounded text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Job Results */}
          <div className="lg:col-span-3 space-y-4">

            {/* Active filters bar */}
            {(committedKeyword || committedLocation || selectedCategory || minSalary) && (
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="text-xs text-muted-foreground">Filtering by:</span>
                {committedKeyword && (
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">
                    &ldquo;{committedKeyword}&rdquo;
                  </span>
                )}
                {committedLocation && (
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">
                    📍 {committedLocation}
                  </span>
                )}
                {selectedCategory && (
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">
                    {selectedCategory}
                  </span>
                )}
                {minSalary && (
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">
                    ${Number(minSalary).toLocaleString()}+
                  </span>
                )}
                <button
                  onClick={() => {
                    setInputKeyword(""); setInputLocation("");
                    setCommittedKeyword(""); setCommittedLocation("");
                    setSelectedCategory(""); setMinSalary(""); setSortBy(""); setPage(1);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
                <p className="text-muted-foreground text-sm">Failed to load jobs. Please try again.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleSearch}>
                  Retry
                </Button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && jobs.length === 0 && (
              <div className="bg-card border border-border/50 rounded-2xl p-16 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">No jobs found</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Try different keywords or adjust your filters.
                </p>
              </div>
            )}

            {/* Results */}
            {!isLoading && jobs.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job, i) => (
                    <JobCard key={job._id} job={job} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-border/40">
                    <span className="text-xs text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages}
                      <span className="ml-2 text-muted-foreground/60">
                        ({pagination.totalJobs} jobs)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter((p) => Math.abs(p - page) <= 2)
                        .map((p) => (
                          <Button
                            key={p}
                            variant={p === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(p)}
                            className="h-8 w-8 p-0 text-xs"
                          >
                            {p}
                          </Button>
                        ))}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
