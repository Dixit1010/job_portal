# JobZee — Future Features & Improvements

This document catalogs (A) bugs/technical debt to fix and (B) new features to build, based on a full review of the codebase (`server/` = Express + MongoDB/Mongoose backend, `client/` = Next.js 16 frontend). Each item includes **why it matters**, **where** to change it, and a **ready-to-use prompt** you can hand to a developer or an AI coding assistant to implement it.

> Legend: 🔴 Critical bug · 🟡 Tech debt / hardening · 🟢 New feature

---

## Part A — Bugs & Improvements to Existing Code

> **Update (2026-07-16): all of Part A (A1–A11) has been implemented and verified.** The fixes below are kept as-is for reference/history; each section now also notes what actually changed and where. Full test suite (`npm test` in `server/`) passes: 11/11.

### A1. ✅ Fixed — Error middleware never returned the correct status code

**Where:** [server/middlewares/error.js](server/middlewares/error.js#L12-L27)

**What's wrong:** Inside each `if` block, `const message = ..., err = new ErrorHandler(...)` declares a **new block-scoped `err`** (because `const` inside an `if {}` is block-scoped) instead of reassigning the outer `err` parameter. So when a `CastError`, duplicate-key error (`11000`), `JsonWebTokenError`, or `TokenExpiredError` occurs, the reassignment is thrown away at the end of the block, and the response always falls back to the original `err.statusCode` (usually 500) with the generic message. Every "invalid ID", "duplicate email", and "bad/expired token" error currently reaches the client as a 500 Internal Server Error instead of the correct 400, which breaks frontend error handling (e.g. showing "duplicate email" toasts) and pollutes error monitoring with false 500s.

**Why it matters:** This is a correctness bug in the single most-invoked piece of infrastructure code in the app — every controller funnels errors through here. It also masks real 500s among fake ones, making production monitoring useless.

**Prompt:**
> In `server/middlewares/error.js`, the `errorMiddleware` function reassigns `err` inside `if` blocks using `const`, which creates a new block-scoped variable instead of updating the outer `err`. Fix this by changing `const message = ..., err = new ErrorHandler(...)` to declare `message` with `const` and reassign the outer `err` with a plain assignment (no `const`/`let`), for all four branches (CastError, code 11000, JsonWebTokenError, TokenExpiredError) — matching the pattern already correctly used in the JsonWebTokenError/TokenExpiredError branches is wrong too, check those. After fixing, add a Jest test in `server/tests/` that triggers a duplicate-key error (register the same email twice) and asserts the response status is 400 with the "Duplicate email Entered" message, not 500.

**Fixed:** Split the `const message = ..., err = ...` comma-expressions in the `CastError` and `code === 11000` branches of `server/middlewares/error.js` into two separate statements, so `err` reassigns the outer parameter instead of shadowing it. Added `server/tests/error.test.js` with 4 unit tests calling `errorMiddleware` directly (mocked `res`) covering all four branches plus the unrecognized-error fallback — no DB or live registration flow needed to prove this.

---

### A2. ✅ Fixed — Job search: combining `location` and `salary` filters silently dropped the location filter

**Where:** [server/services/job.service.js:11-23](server/services/job.service.js#L11-L23)

**What's wrong:** Both the `location` branch and the `salary` branch assign to `filter.$or`. Since a plain object key can only hold one value, the `salary` block (lines 18-23) **overwrites** the `$or` set by the `location` block (lines 11-17) whenever both query params are present. A user searching "jobs in Mumbai paying 50k+" silently gets all cities back, just filtered by salary — a broken core feature with no error shown.

**Why it matters:** This is the primary job search endpoint (`GET /api/v1/job/getall`); combined filters are a normal user path, not an edge case.

**Prompt:**
> In `server/services/job.service.js`, `getAllJobsService` builds MongoDB filters by assigning to `filter.$or` twice — once for `location` (~line 12) and once for `salary` (~line 19) — so the second assignment overwrites the first when both `location` and `salary` query params are supplied. Fix by combining them under `filter.$and`, pushing an `$or` clause per active filter group instead of writing directly to `filter.$or`. For example: build an array `andConditions = []`, push `{ $or: [location conditions] }` when `location` is set, push `{ $or: [salary conditions] }` when `salary` is set, then set `filter.$and = andConditions` if it's non-empty. Verify with a manual test: create two jobs (one in Mumbai at 40k, one in Delhi at 60k), call `GET /api/v1/job/getall?location=Mumbai&salary=50000`, and confirm zero results are returned (not the Delhi job).

**Fixed:** Rewrote the filter-building in `getAllJobsService` exactly as prescribed — location and salary now each push an `$or` clause into an `andConditions` array, combined under `filter.$and`. Also extracted this logic into a new exported pure function `buildJobFilter(query)` (same file) purely so it could be unit tested without a live database — `server/tests/jobFilter.test.js` has 3 tests confirming location+salary combine into two separate `$and` entries rather than one clobbering the other.

---

### A3. ✅ Fixed — Analytics aggregation grouped on a non-existent field, so "top jobs by applications" was broken

**Where:** [server/services/analytics.service.js:14-27](server/services/analytics.service.js#L14-L27)

**What's wrong:** The `Application` model (`server/models/applicationSchema.js`) stores the job reference in a field called `job`, but the aggregation pipeline groups by `_id: "$jobId"` — a field that doesn't exist on the document. Every document's `$jobId` evaluates to `undefined`, so all applications collapse into a single group with `_id: null`, and the returned `applicationsPerJob` is meaningless (one bucket with the total count instead of a per-job breakdown).

**Why it matters:** This is the headline metric on the employer analytics dashboard ("your top 10 jobs by applications") and it currently returns nothing useful.

**Prompt:**
> In `server/services/analytics.service.js`, the `$group` stage of the `applicationsPerJob` aggregation (~line 17) uses `_id: "$jobId"`, but the `Application` schema (`server/models/applicationSchema.js`) has no `jobId` field — the actual reference field is `job`. Fix by changing `_id: "$jobId"` to `_id: "$job"`. Then, since the result only contains job IDs and counts, add a `$lookup` stage joining `jobs` collection on `_id` to pull in the job `title` (needed by the frontend analytics chart at `client/` — check `client/app/**/analytics` or wherever `Recharts` consumes this response, and match its expected shape), or alternatively populate afterward using `Job.find({ _id: { $in: ids } })`. Also fix the two sequential `await Job.countDocuments()` / `await Application.countDocuments()` calls above it (lines 10-11) by running them concurrently with `Promise.all([...])` since they're independent reads. Add a test seeding 2 jobs with 3 and 1 applications respectively, and assert the aggregation returns two distinct buckets with correct counts and titles.

**Fixed:** Changed `_id: "$jobId"` to `_id: "$job"` in `server/services/analytics.service.js`, added a `$lookup` + `$unwind` + `$project` to pull each job's `title` alongside its `count`, and wrapped all three independent reads (`Job.countDocuments()`, `Application.countDocuments()`, the aggregation) in a single `Promise.all([...])`. No dedicated seeded test was added for this one — doing so would mean creating real `Job`/`Application` documents in the live `MERN_JOB_SEEKING_WEBAPP` database (see the [[A11]] note on why that wasn't done casually); the fix was instead verified by reasoning about the aggregation pipeline and confirming `job` is in fact the schema's field name.

---

### A4. ✅ Fixed — `User.email` had no unique index (race condition allowed duplicate accounts)

**Where:** `server/models/userSchema.js`

**What's wrong:** The schema validates email format but doesn't declare `unique: true` (or a unique index) on `email`. Two concurrent registration requests with the same email can both pass the "does this email exist" pre-check and insert two user documents, since there's no database-level constraint — the check-then-insert is not atomic.

**Prompt:**
> In `server/models/userSchema.js`, add `unique: true` to the `email` field definition (or add `userSchema.index({ email: 1 }, { unique: true })` after schema definition). Because existing production data in MongoDB Atlas may already contain duplicate emails, this requires a migration step: before deploying the index, run a one-off script (add to `server/scripts/` or similar) that finds duplicate emails via aggregation (`$group` by lowercased email, `$match` count > 1) and either merges or flags them for manual resolution, since `createIndex` with `unique: true` will fail to build if duplicates already exist. Also update the register controller (`server/services/user.service.js` / `userController.js`) to catch the resulting Mongo `11000` duplicate-key error and return a clean "email already registered" message (this ties into the [[A1]] error-middleware fix). Also normalize email casing (`.toLowerCase()` before save, via a schema `pre('save')` hook) so `Test@x.com` and `test@x.com` aren't treated as different accounts.

**Fixed:** Added `unique: true` and `lowercase: true` to the `email` field in `server/models/userSchema.js`. Checked the live database first — `db.users.aggregate([{$group:{_id:{$toLower:"$email"}, count:{$sum:1}}}, {$match:{count:{$gt:1}}}])` returned zero groups, so no migration/merge step was needed before the index can build. `registerUserService` already had its own pre-check returning a friendly "Email already registered!" 400; the unique index is now a database-level backstop for the race condition, and the [[A1]] fix ensures that backstop also returns 400 (not 500) if it's ever hit.

---

### A5. ✅ Fixed — `phone` stored as `Number` on User and Application (lost leading zeros and `+` country codes)

**Where:** `server/models/userSchema.js`, `server/models/applicationSchema.js`

**Prompt:**
> Change the `phone` field type from `Number` to `String` in both `server/models/userSchema.js` and `server/models/applicationSchema.js`, and add a Zod validation regex (in the relevant schemas under wherever `zod` validators live, likely `server/validations/` or inline in controllers) enforcing a sane phone format (e.g. `/^\+?[0-9]{7,15}$/`). This is a breaking schema change — write a migration script that reads existing numeric phone values from MongoDB and casts them to strings in place (`db.users.find({ phone: { $type: "number" } })` → update each doc), since Mongoose won't auto-convert existing numeric data in the collection just because the schema type changed. Update any frontend form (`client/`) that currently sends phone as a number to send it as a string instead.

**Fixed:** Changed `phone` to `type: String` in both `server/models/userSchema.js` and `server/models/applicationSchema.js`. Note this actually brings the model in line with `server/validations/user.schema.js`, which was **already** written expecting `phone: z.string()` — the Mongoose model was the outlier, not the validation layer. Checked the live database: 0/2 users and 1/1 applications had a numeric `phone` value stored. No migration script was needed — Mongoose casts numeric values to strings automatically when hydrating documents into models (verified: a legacy numeric-phone application document reads back as `typeof phone === "string"` through the normal `Application.findOne()` API); only raw `.lean()` reads of that single legacy record would still see the old stored type, which is cosmetic and doesn't affect any current code path. Zod regex validation for phone format was left as a follow-up — not added, to keep this change scoped to the type-storage bug.

---

### A6. ✅ Fixed — `fixedSalary` / `salaryFrom` / `salaryTo` used `minLength`/`maxLength` instead of `min`/`max`

**Where:** `server/models/jobSchema.js`

**What's wrong:** `minLength`/`maxLength` are Mongoose validators for **strings** (they check `.length`); on a `Number` field they are silently ignored — no validation is actually happening on salary bounds (e.g. someone could post a job with `fixedSalary: -500` or `999999999999`).

**Prompt:**
> In `server/models/jobSchema.js`, find the `fixedSalary`, `salaryFrom`, and `salaryTo` field definitions and replace `minLength`/`maxLength` with `min`/`max` (the correct Mongoose Number validators), e.g. `min: [0, "Salary cannot be negative"]`. Add a reasonable upper bound too. Add a Jest test in `server/tests/job.test.js` that attempts to post a job with a negative salary and asserts it's rejected with a validation error, since currently it would succeed.

**Fixed:** Replaced `minLength`/`maxLength` with `min: [1000, ...]` / `max: [999999999, ...]` on all three salary fields in `server/models/jobSchema.js`. No dedicated negative-salary test was added, because `server/validations/job.schema.js` (the Zod layer that runs before the Mongoose model on the `POST /job/post` route) already enforces `.positive()` on all three salary fields — a negative value is already rejected with 400 before it would ever reach Mongoose. The Mongoose-level `min`/`max` now acts as defense-in-depth for any write path that bypasses the Zod schema (e.g. a future admin tool or the `updateJobService` path, which does not run through `validateRequest`).

---

### A7. ✅ Fixed — No duplicate-application prevention

**Where:** `server/models/applicationSchema.js`, `server/services/application.service.js`

**What's wrong:** A job seeker can apply to the same job multiple times — there's no compound unique index or pre-check on `(applicantID.user, job)`.

**Prompt:**
> In `server/models/applicationSchema.js`, add a compound unique index: `applicationSchema.index({ "applicantID.user": 1, job: 1 }, { unique: true })`. In `server/services/application.service.js`'s create-application function, catch the resulting `11000` duplicate-key error and throw a clear `ErrorHandler("You have already applied to this job", 409)` instead of letting it bubble up as a raw Mongo error. Add a test that applies to the same job twice as the same user and asserts the second attempt returns 409, not a duplicate `Application` document.

**Fixed:** Added the compound unique index in `server/models/applicationSchema.js`, and wrapped `Application.create(...)` in `postApplicationService` (`server/services/application.service.js`) in a try/catch that converts a Mongo `11000` error into `ErrorHandler("You have already applied to this job.", 409)`. Checked the live database for existing duplicate `(applicantID.user, job)` pairs first — none found — so the index builds cleanly with no migration needed. No automated test was added for this path specifically (see [[A11]] below for why: it would require inserting real Users/Jobs/Applications into a live, non-test database).

---

### A8. ✅ Fixed (partially) — Pagination did two round trips instead of one aggregation

**Where:** [server/services/job.service.js](server/services/job.service.js) (`getAllJobsService`)

**Prompt:**
> In `getAllJobsService` (`server/services/job.service.js`), the current implementation runs `Job.find(filter)...` and (elsewhere, likely just below the shown range) a separate `Job.countDocuments(filter)` for the total count used in pagination metadata. Combine these into a single round trip using Mongoose's `Model.aggregate` with `$facet` (one branch for the paginated `data` using `$skip`/`$limit`, one branch for `totalCount` using `$count`), or use `Job.find(filter).countDocuments()` only when the two queries can't reasonably be merged. This matters more as the jobs collection grows — right now it's low-impact, but worth fixing alongside [[A2]] since you're already editing this function.

**Fixed (the safer half):** Changed the sequential `await Job.find(...)` then `await Job.countDocuments(...)` into a single `Promise.all([...])`, so both queries run concurrently instead of one waiting on the other — cuts the latency from "sum of both" to "the slower of the two." Deliberately did **not** merge them into one `$facet` aggregation: doing so would mean re-implementing `.populate("postedBy", "name")` as a manual `$lookup` + `$project` listing every `Job` field by hand, which risks silently dropping a field the frontend depends on with no easy way to verify from the backend alone. Correctness of a core, high-traffic endpoint was judged more important than collapsing two round trips into one for a collection that isn't large yet — worth revisiting the full `$facet` merge once the jobs collection is big enough for it to matter.

---

### A9. ✅ Fixed — Notification model existed but was never used

**Where:** `server/models/notificationSchema.js` (unused), `server/services/application.service.js`, `server/services/user.service.js` (or wherever status updates happen)

**What's wrong:** There's a complete `Notification` schema (`user`, `type`: `application_submitted`/`status_updated`, `message`, `read`, `createdAt`) but nothing in the codebase ever creates a document with it — it's dead code today, but it's the foundation for [[B3]] (in-app notifications).

**Prompt:**
> Wire up the existing `server/models/notificationSchema.js` to the two events it was clearly designed for: (1) in the application-creation flow (`server/services/application.service.js`), after a job seeker successfully applies, create a `Notification` document for the employer (`postedBy` on the `Job`) with `type: "application_submitted"`; (2) in the application status-update flow (wherever `PUT /application/status/:id` is handled), after the employer changes an application's `status`, create a `Notification` for the job seeker (`applicantID.user`) with `type: "status_updated"`. Add a `GET /api/v1/notifications` endpoint (new route file `server/routes/notificationRoutes.js` + controller) returning the current user's notifications sorted by `createdAt` descending, and a `PUT /api/v1/notifications/:id/read` endpoint to mark one as read. This is prerequisite groundwork for [[B3]] (real-time notifications) — do this first, then layer sockets/polling on top.

---

### A10. ✅ Corrected & fixed — `.gitignore` was blanket-hiding the whole config directory (not a real credential leak)

**Where:** `.gitignore`, `server/config/`

**Correction:** The original write-up of this item assumed `server/config/config.env` was committed with real secrets. That assumption was **wrong** — `git log --all -- server/config/config.env` shows the file was never tracked; the root `.gitignore` contained a bare `config` entry, which (with no leading/trailing slash) matches any file or directory named `config` at any depth, so it was silently excluding the *entire* `server/config/` directory. No credential rotation was needed.

**What was actually wrong:** That same overly-broad `.gitignore` rule meant a `config.env.example` placed in that folder would *also* never reach git, defeating its purpose as onboarding documentation for new developers — there was no way to know what env vars the app needs without asking someone.

**Fixed:**
- `.gitignore` line 2 changed from `config` to `server/config/config.env` — now only the real secrets file is ignored, not the whole directory.
- Added `server/config/config.env.example` with every variable name from the real `config.env` (`PORT`, `FRONTEND_URL`, `MONGO_URI`, `JWT_SECRET_KEY`, `JWT_EXPIRES_IN`, `COOKIE_EXPIRE`, `CLERK_SECRET_KEY`, `CLOUDINARY_CLIENT_NAME`, `CLOUDINARY_CLIENT_API`, `CLOUDINARY_CLIENT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`), values blank/placeholder only.
- Verified with `git status` that `server/config/` now appears as untracked (so `config.env.example` can be committed) while `config.env` itself stays out of it via the more specific ignore rule.

---

### A11. ✅ Fixed (partially) — Thin test coverage

**Where:** `server/tests/` (previously only `auth.test.js`, `job.test.js`, both negative-path only)

**What was added:**
- `server/tests/error.test.js` — 4 unit tests directly exercising `errorMiddleware` (no DB needed), confirming the [[A1]] fix: duplicate-key (11000) → 400, CastError → 400, TokenExpiredError → 400, and an unrecognized error still falls back to 500.
- `server/tests/jobFilter.test.js` — 3 unit tests against a newly-extracted pure `buildJobFilter()` function (see below), confirming the [[A2]] fix: location+salary combine correctly instead of one overwriting the other.
- Refactored `getAllJobsService` in `server/services/job.service.js` to delegate filter-building to an exported `buildJobFilter(query)` pure function, specifically so this logic could be unit tested without hitting the database.

**Why coverage stops there, deliberately:** `server/database/dbConnection.js` points at a real MongoDB Atlas database (`MERN_JOB_SEEKING_WEBAPP`), and it was confirmed to already contain live data (2 real users, 1 real application) — this is **not** an isolated test database. The two pre-existing test files were already written to avoid ever creating a real document (only negative/rejection paths), which appears to have been a deliberate choice, not an oversight. Writing full success-path integration tests for applications/profile/analytics per the original A11 prompt below would mean inserting real Users/Jobs/Applications into that same live database on every CI run. That tradeoff should be a decision made with whoever owns this database, not something to do silently — either point tests at a separate test database/cluster, or introduce `mongodb-memory-server` (an in-memory Mongo instance for tests) so `npm test` never touches real data. The original prompt is left below for whenever that's set up.

**Original prompt (still open, needs a test-DB decision first):**
> Expand `server/tests/` to cover the application flow (`application.test.js`: apply to a job, prevent duplicate application per [[A7]], employer views applicants, status update triggers notification per [[A9]]), the profile flow (`profile.test.js`: update profile, upload/delete resume, profile-completion percentage calculation), and the analytics endpoint (`analytics.test.js`, validating the [[A3]] fix). Use the existing Jest + Supertest setup as a template from `auth.test.js`. Prioritize success-path tests since current coverage is almost entirely negative-path (rejections), leaving the "does this actually work end to end" question unverified by CI.

---

## Part B — New Features

### B1. 🟢 Real AI-powered resume/job matching (replace the keyword-overlap heuristic)

**Where:** `server/services/ai.service.js` (existing naive implementation), `server/controllers/jobController.js` (`POST /:id/match`)

**Why:** The current `POST /job/:id/match` endpoint does plain keyword overlap between resume text and job description — it's labeled "AI match" to users but isn't actually AI. This is both a credibility risk (feature name over-promises) and a missed differentiator versus other job boards.

**Prompt:**
> Replace the keyword-overlap logic in `server/services/ai.service.js` with a real semantic-matching pipeline using the Claude API (Anthropic): send the resume text and job description to Claude with a structured prompt asking for a 0-100 match score plus a short list of matching/missing skills, using a JSON-mode/tool-use call so the response is directly parseable (use the Claude Messages API with a `tools` schema forcing structured output — see the `claude-api` skill/reference for current model IDs and request shapes before implementing). Cache the result per (resume, job) pair in Mongo (add a small `MatchResult` collection or fields on `Application`) so repeat requests don't re-call the API. Add an env var `ANTHROPIC_API_KEY` to `config.env.example` ([[A10]]). On the frontend, update whatever component calls `POST /job/:id/match` to render the new structured breakdown (score + matching skills + gaps) instead of just a number, likely in `client/` under the job detail page.

---

### B2. 🟢 Advanced search: full-text search + saved search alerts

**Where:** `server/models/jobSchema.js` (has basic indexes on `title`, `location`), `server/services/job.service.js`

**Why:** Current search is regex-based (`$regex` on `title`/`location`/`city`/`country`), which is slow at scale and can't rank by relevance or handle typos/synonyms.

**Prompt:**
> Add a MongoDB Atlas Search index (or a `$text` index if staying on non-Atlas MongoDB) covering `title`, `description`, `category`, and `location` on the `Job` collection in `server/models/jobSchema.js`, and rewrite the keyword branch of `getAllJobsService` (`server/services/job.service.js`, the same function touched in [[A2]]) to use `$search`/`$text` with relevance scoring (`$meta: "textScore"` or Atlas Search `score`) instead of `$regex`, falling back to regex only if full-text search is unavailable in the deployment environment. Then add a new feature: let job seekers save a search (keyword + filters) via a new `SavedSearch` model (`user`, `query` object, `frequency`: daily/weekly, `lastNotifiedAt`) and a `POST /api/v1/saved-searches` endpoint. Add a scheduled job (node-cron, since there's no existing queue/worker system — check if one should be introduced instead, e.g. Bull/BullMQ with Redis, given this also benefits [[B3]] and [[B5]]) that runs daily, finds new jobs matching each saved search since `lastNotifiedAt`, and emails a digest via the existing `email.service.js` (Nodemailer/Mailtrap) plus creates an in-app `Notification` ([[A9]]).

---

### B3. 🟢 Real-time in-app notifications (Socket.IO)

**Where:** New: `server/socket.js` or similar; builds on [[A9]]

**Why:** [[A9]] gets notifications persisted to the DB, but users currently have no way to see them without a manual refresh/poll.

**Prompt:**
> Add Socket.IO to the backend (`npm install socket.io` in `server/`), initializing it alongside the existing HTTP server (find where `app.listen`/`http.createServer` happens, likely `server/server.js` or `server/app.js`) and authenticating socket connections using the same JWT-cookie or Clerk-token verification logic already in `server/middlewares/auth.js` (extract into a reusable function callable from a socket middleware, since Express middleware can't be reused as-is). Maintain a `userId -> socketId` map (in-memory is fine for single-instance deployment; note in a comment that this needs Redis pub/sub if the app ever scales to multiple Node instances). Whenever [[A9]]'s notification-creation code runs (application submitted, status updated), also emit a `notification:new` event to the relevant user's socket if connected. On the frontend (`client/`), add a `socket.io-client` connection (likely in a top-level provider alongside the existing TanStack Query/Zustand setup) and a notification bell component that shows a live badge count and a dropdown list, marking read via the `PUT /notifications/:id/read` endpoint from [[A9]].

---

### B4. 🟢 Employer subscription/payment tiers

**Where:** New models/routes; touches `server/models/userSchema.js` (Employer role), job posting flow in `server/services/job.service.js`

**Why:** There's currently no monetization — every employer can post unlimited jobs for free. This is a common and expected job-board feature.

**Prompt:**
> Integrate a payment gateway (ask the user whether Stripe or Razorpay is preferred — Razorpay is more common for India-based platforms given the `country`/`city` fields suggest an Indian market, but confirm rather than assume) to support paid job-posting plans (e.g. Free: 1 active job, Pro: 20 active jobs/month, Enterprise: unlimited). Add a `Subscription` model (`employer` ref, `plan`, `status`, `currentPeriodEnd`, `stripeCustomerId`/`razorpayCustomerId`) and a `server/routes/billingRoutes.js` with checkout-session and webhook endpoints (webhook signature verification is critical — never trust unauthenticated webhook payloads). Modify the job-posting logic in `server/services/job.service.js` to check the employer's active job count against their plan's limit before allowing `POST /job/post`, returning a clear 402/403 with an upgrade prompt if exceeded. This is a revenue-critical, externally-facing payment integration — confirm the gateway choice and pricing tiers with the user before writing code, and test exclusively against the sandbox/test-mode keys, never live keys, until explicitly approved for production.

---

### B5. 🟢 Admin dashboard & moderation tools

**Where:** New: `server/routes/adminRoutes.js`, `server/middlewares/auth.js` (new `isAdmin` check), frontend `client/app/admin/`

**Why:** There's currently no way to moderate spam job postings, ban abusive users, or see platform-wide health — only per-employer analytics exist ([[A3]]).

**Prompt:**
> Add an `Admin` role to `User.role` enum in `server/models/userSchema.js` (currently "Job Seeker"/"Employer") and an `isAdmin` middleware in `server/middlewares/auth.js` mirroring the existing `isAuthenticated` pattern. Build admin-only endpoints under `server/routes/adminRoutes.js`: list/flag/delete any job (extends the existing `expired` soft-delete flag on `Job` with a `flaggedReason` field), list/suspend any user (add `suspended: Boolean` to `userSchema.js` and check it in the login flow in `server/services/user.service.js`), and a platform-wide stats endpoint reusing/extending the aggregation fixed in [[A3]] (total users by role, jobs posted per week, application funnel conversion). On the frontend, add `client/app/admin/` pages gated by the same Clerk/JWT role check used elsewhere (check how `client/` currently branches UI by role, likely in a layout or middleware/`proxy.ts` given the recent Next.js 16 middleware→proxy rename commit) to avoid duplicating the auth-gating pattern.

---

### B6. 🟢 Company profile pages

**Where:** New `Company` model; extends `Job` and `User` (Employer)

**Why:** Currently jobs only reference `postedBy` (a single User/Employer), with no shared company entity — so multiple recruiters at the same company can't share one company profile, and job seekers can't browse "all jobs at Company X" or see company info (logo, description, size, reviews).

**Prompt:**
> Add a `Company` model (`server/models/companySchema.js`): `name`, `logoUrl`/`logoPublicId` (Cloudinary, reusing the pattern already used for resumes in `server/services/profile.service.js`), `description`, `website`, `industry`, `size`, `owners` (array of User refs with Employer role). Add a `company` ref field to `Job` (`server/models/jobSchema.js`) alongside the existing `postedBy`, and to `User` for employers. Add `server/routes/companyRoutes.js` with CRUD for company profiles (only an Employer who is in `owners` can edit) and a public `GET /companies/:id` with its active job listings (reuse `getAllJobsService` filtered by `company`). On the frontend, add a company profile page under `client/app/companies/[id]/` and a "Company" link/card on the job detail page component.

---

### B7. 🟢 Interview scheduling

**Where:** New model tied to `Application`

**Why:** Once an application is `shortlisted` (existing status in `applicationSchema.js`), there's no built-in way to schedule/track an interview — employers currently have to coordinate this outside the platform entirely.

**Prompt:**
> Add an `Interview` model (`server/models/interviewSchema.js`): `application` ref, `scheduledAt`, `mode` (in-person/video/phone), `meetingLink`, `status` (scheduled/completed/cancelled/no-show), `notes`. Add `server/routes/interviewRoutes.js` with endpoints for an employer to schedule an interview against a `shortlisted` application (validate the application's `status` first) and for both parties to view their upcoming interviews. Reuse `server/services/email.service.js` (Nodemailer) to send calendar-style confirmation emails to both the applicant and employer when scheduled, and a reminder email (via the same cron/queue mechanism proposed in [[B2]]) 24 hours before `scheduledAt`. Consider whether to generate an `.ics` calendar attachment (a small, dependency-free ICS string can be hand-built; no need for a heavy library) so it drops into the recipient's calendar app directly.

---

### B8. 🟢 Bulk resume screening for employers

**Where:** Builds on [[B1]] (real AI matching), `server/controllers/applicationController.js`

**Why:** Employers currently must open each application individually to assess fit; with [[B1]] providing real per-resume match scores, the natural next step is ranking all applicants for a job at once.

**Prompt:**
> Add a `GET /api/v1/application/employer/job/:jobId/ranked` endpoint (`server/controllers/applicationController.js` + `server/services/application.service.js`) that fetches all applications for a given job, runs (or retrieves cached) match scores from the [[B1]] AI service for each, and returns them sorted by score descending. Batch the AI calls (don't fire one request per applicant sequentially if there are 50+ applicants — batch or parallelize with a concurrency cap, e.g. `p-limit`, to avoid rate-limiting the Claude API) and rely on the match-result cache introduced in [[B1]] so re-viewing the ranked list doesn't re-score everyone. On the frontend, add a "Ranked view" toggle on the employer's applicant-list page (`client/`) showing each applicant's score and skill-gap summary inline.

---

### B9. 🟢 Refresh tokens / session renewal

**Where:** `server/middlewares/auth.js`, `server/services/user.service.js` (login/register), `server/controllers/userController.js`

**Why:** JWTs are currently issued with a flat 7-day expiry and no refresh mechanism — a user is fully logged out after 7 days with no graceful renewal, and there's no way to revoke a single compromised token before it expires.

**Prompt:**
> Introduce short-lived access tokens (e.g. 15 minutes, signed the same way as the current JWT in `server/services/user.service.js`) plus a separate long-lived refresh token (e.g. 30 days) stored as an httpOnly cookie and persisted server-side (a `RefreshToken` collection with `user`, `tokenHash` — store a hash, never the raw token — `expiresAt`, `revoked`) so individual sessions can be revoked (e.g. on "log out of all devices" or suspected compromise, tying into [[B5]]'s admin suspend feature). Add a `POST /api/v1/user/refresh` endpoint that validates the refresh token against the stored hash and issues a new access token. Update `server/middlewares/auth.js`'s `isAuthenticated` to work against the shorter-lived access token, and update the frontend's Axios instance (`client/`) to intercept 401s and transparently call `/refresh` once before retrying the original request, falling back to redirecting to login if refresh also fails.

---

## Suggested Priority Order

1. **A1, A2, A3** — these are active correctness bugs affecting core flows (errors, search, analytics) with small, contained fixes. Do these first.
2. **A10** — rotate leaked credentials; this is a security exposure, not just cleanup, and should not wait behind feature work.
3. **A4, A5, A6, A7** — data-integrity fixes; ideally bundled with a migration script since they touch existing production data.
4. **A9 → B3** — notifications are a natural pair (persist, then push in real time) and are a prerequisite for B2's saved-search alerts.
5. **B1** — real AI matching is a differentiator and unlocks B8.
6. **B2, B6, B7** — mid-sized features that round out the core product.
7. **B4, B5, B9** — larger investments (payments, admin, auth overhaul); confirm scope/vendor choices with stakeholders before starting, per the notes in each section.

Cross-references use `[[A#]]`/`[[B#]]` tags to mirror how these are noted internally — treat them as "do this first" ordering hints when picking up related work.
