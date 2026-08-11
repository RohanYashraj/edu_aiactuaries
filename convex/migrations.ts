import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { roleValidator } from "./schema";
import { seedContentDocs } from "./seedData";
import { slugify } from "./lib/slug";

/**
 * One-off maintenance mutations. All `internalMutation`, so none of them are
 * reachable from a browser — run them with:
 *
 *   npx convex run migrations:promoteToAdmin '{"email":"you@example.com"}'
 *
 * Every function here must be idempotent; they will be run more than once.
 */

/** Bootstrap the first admin. There is no in-app way to create one. */
export const promoteToAdmin = internalMutation({
  args: { email: v.string(), role: v.optional(roleValidator) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error(
        `No user with email ${args.email}. Sign in once first so the user is synced into Convex.`,
      );
    }

    const role = args.role ?? "admin";
    if (user.role === role) return { userId: user._id, role, changed: false };

    await ctx.db.patch(user._id, { role, roleUpdatedAt: Date.now() });
    return { userId: user._id, role, changed: true };
  },
});

/**
 * Marks every pre-existing user as onboarded so the new onboarding gate only
 * applies to people who sign up from now on. Run once, before deploying the
 * gate, unless you actually want existing members re-profiled.
 */
export const backfillOnboardingComplete = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let patched = 0;
    for (const user of users) {
      if (user.onboardingCompletedAt === undefined) {
        await ctx.db.patch(user._id, { onboardingCompletedAt: user._creationTime });
        patched += 1;
      }
    }
    return { total: users.length, patched };
  },
});

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Seeds the unified `content` table from what used to be hardcoded in TSX.
 * Idempotent: matches on slug and patches, so re-running never duplicates.
 * Editor-owned curation fields (status, featured, featureRank, order) are only
 * set on insert — re-running must not undo an editor's decisions.
 */
export const seedContent = internalMutation({
  args: { overwrite: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    let inserted = 0;
    let patched = 0;

    for (const doc of seedContentDocs) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", doc.slug))
        .unique();

      if (existing) {
        if (!args.overwrite) continue;

        // Drop the curation fields: an editor may have changed them, and
        // re-running a seed must never silently revert that.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, featured, featureRank, order, ...editorial } = doc;
        await ctx.db.patch(existing._id, { ...editorial, updatedAt: now });
        patched += 1;
        continue;
      }

      await ctx.db.insert("content", {
        ...doc,
        publishedAt: doc.status === "published" ? now : undefined,
        updatedAt: now,
      });
      inserted += 1;
    }

    return { inserted, patched, skipped: seedContentDocs.length - inserted - patched };
  },
});

/**
 * Copies rows from the legacy `certifications` and `workshops` tables into
 * `content`. Run before the UI switches over. Rows already migrated (matched by
 * slug) are left alone so this is safe to re-run.
 */
export const migrateLegacyTables = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let certifications = 0;
    let workshops = 0;

    for (const row of await ctx.db.query("certifications").collect()) {
      const slug = row.slug || slugify(row.title);
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) continue;

      await ctx.db.insert("content", {
        type: "certification",
        slug,
        status: "published",
        title: row.title,
        summary: row.description,
        body: row.description,
        coverImagePath: row.imageUrl,
        order: row.order,
        featured: row.highlight,
        featureRank: row.highlight ? 0 : undefined,
        publishedAt: row._creationTime,
        updatedAt: now,
        details: { kind: "certification", enrollmentStatus: "open" },
      });
      certifications += 1;
    }

    for (const row of await ctx.db.query("workshops").collect()) {
      const slug = row.slug || slugify(row.title);
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) continue;

      // Legacy `date` was a free-text string; keep it as the display label and
      // only set startDate when it actually parses.
      const parsed = row.date ? Date.parse(row.date) : NaN;
      const location = row.location ?? "";
      const mode = /hybrid/i.test(location)
        ? ("hybrid" as const)
        : /online/i.test(location)
          ? ("online" as const)
          : ("in_person" as const);

      await ctx.db.insert("content", {
        type: "workshop",
        slug,
        status: "published",
        title: row.title,
        summary: row.description,
        body: row.description,
        coverImagePath: row.imageUrl,
        startDate: Number.isNaN(parsed) ? undefined : parsed,
        dateLabel: row.date,
        location: row.location,
        order: row.order,
        featured: false,
        publishedAt: row._creationTime,
        updatedAt: now,
        details: { kind: "workshop", lifecycle: row.status, mode },
      });
      workshops += 1;
    }

    return { certifications, workshops };
  },
});

/** Backfills slugs on job rows created before slugs were mandatory. */
export const backfillJobSlugs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    let patched = 0;

    for (const job of jobs) {
      if (job.slug) continue;

      const base = slugify(`${job.title}-${job.company}`);
      let slug = base;
      for (let suffix = 2; suffix < 100; suffix += 1) {
        const clash = await ctx.db
          .query("jobs")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();
        if (!clash) break;
        slug = `${base}-${suffix}`;
      }

      await ctx.db.patch(job._id, {
        slug,
        publishedAt: job.publishedAt ?? job._creationTime,
        updatedAt: Date.now(),
      });
      patched += 1;
    }

    return { total: jobs.length, patched };
  },
});

/* -------------------------------------------------------------------------- */
/*  Jobs                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Seeds the AI-AIP internship listing.
 *
 * This was previously a *public* mutation in jobs.ts whose fallback branch
 * inserted an `employer` user — meaning anyone who knew the deployment URL
 * could create employer accounts and published listings. It is internal now.
 */
export const seedAiAipInternship = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Reuse the existing system employer if one is already present.
    const existingEmployer = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "employer"))
      .first();

    const employerId =
      existingEmployer?._id ??
      (await ctx.db.insert("users", {
        clerkId: "system:ai-actuaries",
        email: "support@sssia.org",
        name: "AI Actuaries",
        role: "employer",
        onboardingCompletedAt: Date.now(),
      }));

    const internshipPayload = {
      title: "AI Actuarial Internship Program (AI-AIP)",
      description:
        "An 8-week hands-on internship for actuarial students to build practical AI skills across pricing, reserving, claims analytics, and fraud detection in P&C insurance.",
      company: "AI Actuaries",
      location: "Online",
      slug: "ai-actuarial-internship-program-2026",
      type: "internship" as const,
      periodStart: "May 2, 2026",
      periodEnd: "June 27, 2026",
      applicationDeadline: "April 24, 2026",
      selectionCriteria: "Applied candidates will be selected through an online interview process.",
      applicationUrl: "https://forms.gle/W45WuyDViwxauJb26",
      commitmentHoursPerDay: "6-8 hours/day",
      eligibilityCriteria: [
        "Students pursuing undergraduate or postgraduate programs in Actuarial Science, Statistics, Data Science, Mathematics, Economics, or related quantitative fields.",
        "Cleared at least 1-2 actuarial exams (preferred but not mandatory for exceptional candidates).",
        "Basic understanding of probability, statistics, and financial mathematics.",
        "Familiarity with programming (Python / R / Excel) is desirable.",
        "Strong interest in AI applications in actuarial science.",
        "Commitment to full-time participation during May-June internship period.",
        "Good communication skills and willingness to work in team-based projects.",
      ],
      weeklySchedule: [
        {
          week: 1,
          title: "Foundations - Actuarial + Data + AI Basics",
          focus: "Core concepts and environment setup",
          topics: [
            "Actuarial domains (Life, Health, P&C)",
            "Introduction to AI, ML, and Agentic AI",
            "Python for data analysis",
          ],
          tools: [
            "Python",
            "Jupyter Notebook",
            "Pandas",
            "NumPy",
            "Matplotlib",
            "Seaborn",
            "Git",
            "GitHub",
          ],
          outcomes: ["Environment ready with foundational understanding."],
        },
        {
          week: 2,
          title: "Data Understanding & Problem Framing",
          focus: "Data exploration and actuarial problem translation",
          topics: ["EDA on insurance datasets", "Feature engineering"],
          tools: ["Pandas", "Seaborn", "SQLite / MySQL", "Google Colab"],
          outcomes: ["Structured problem framing and data insights."],
        },
        {
          week: 3,
          title: "Core Actuarial Modeling",
          focus: "Predictive modeling for actuarial use cases",
          topics: [
            "Industry project and mentor allocation",
            "Pricing / claims prediction model",
            "Model evaluation (RMSE, accuracy, AUC)",
          ],
          tools: ["Scikit-learn", "XGBoost", "R (optional)"],
          outcomes: ["Baseline production-style actuarial ML model."],
        },
        {
          week: 4,
          title: "Introduction to Agentic AI",
          focus: "LLMs and agent architecture",
          topics: [
            "Agents, tools, memory, and chains",
            "Prompt engineering",
            "Build an actuarial Q&A assistant",
          ],
          tools: ["OpenAI APIs", "LangChain", "OpenAI Playground"],
          outcomes: ["Working LLM-powered actuarial assistant."],
        },
        {
          week: 5,
          title: "Building Actuarial AI Agents",
          focus: "Domain-specific assistants",
          topics: [
            "Underwriting assistant",
            "Claims triage agent",
            "Pricing assistant",
          ],
          tools: ["LangChain", "AutoGPT / CrewAI", "OpenAI APIs"],
          outcomes: ["Stream-wise actuarial AI agents."],
        },
        {
          week: 6,
          title: "Advanced Agentic Systems & Integration",
          focus: "Multi-agent orchestration and production integration",
          topics: [
            "Memory and retrieval (RAG)",
            "Multi-step reasoning agents",
            "Experiment tracking",
          ],
          tools: [
            "LangGraph",
            "FastAPI",
            "FAISS / Pinecone",
            "Weights & Biases",
          ],
          outcomes: ["Integrated multi-agent workflow."],
        },
        {
          week: 7,
          title: "Capstone Project Development",
          focus: "End-to-end actuarial AI solution build",
          topics: [
            "Data + ML + Agent integration",
            "Solution architecture and iteration",
          ],
          tools: [
            "LangChain / LangGraph",
            "OpenAI",
            "FastAPI",
            "Streamlit (optional)",
          ],
          outcomes: ["Portfolio-grade capstone prototype."],
        },
        {
          week: 8,
          title: "Finalization & Deployment",
          focus: "Production readiness and communication",
          topics: [
            "Deployment and documentation",
            "Presentation and reporting",
          ],
          tools: ["Streamlit / Docker", "Notion / GitHub", "PowerPoint"],
          outcomes: [
            "Working system",
            "Code repository",
            "Presentation and report",
          ],
        },
      ],
      status: "published" as const,
      employerId,
      summary:
        "The AI Actuarial Internship Program (AI-AIP) is an 8-week full-time online internship running 2 May to 27 June 2026, in which actuarial students build practical AI skills across pricing, reserving, claims analytics, and fraud detection in P&C insurance.",
      remote: true,
      featured: true,
      publishedAt: Date.now(),
      validThrough: Date.parse("2026-04-24T23:59:59.000Z"),
      updatedAt: Date.now(),
    };

    const existing = await ctx.db
      .query("jobs")
      .withIndex("by_slug", (q) => q.eq("slug", internshipPayload.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, internshipPayload);
      return existing._id;
    }

    return await ctx.db.insert("jobs", internshipPayload);
  },
});
