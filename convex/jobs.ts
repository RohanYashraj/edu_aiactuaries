import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const listPublishedSummary = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(50);

    return jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      type: job.type,
      status: job.status,
      slug: job.slug,
    }));
  },
});

export const listPublishedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getById = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const listByEmployer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("jobs")
      .withIndex("by_employerId", (q) => q.eq("employerId", user._id))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    slug: v.optional(v.string()),
    type: v.union(
      v.literal("full-time"),
      v.literal("part-time"),
      v.literal("contract"),
      v.literal("internship"),
    ),
    periodStart: v.optional(v.string()),
    periodEnd: v.optional(v.string()),
    applicationDeadline: v.optional(v.string()),
    selectionCriteria: v.optional(v.string()),
    applicationUrl: v.optional(v.string()),
    commitmentHoursPerDay: v.optional(v.string()),
    eligibilityCriteria: v.optional(v.array(v.string())),
    weeklySchedule: v.optional(
      v.array(
        v.object({
          week: v.number(),
          title: v.string(),
          focus: v.string(),
          topics: v.array(v.string()),
          tools: v.array(v.string()),
          outcomes: v.array(v.string()),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found in database");
    if (user.role !== "employer") {
      throw new Error("Only employers can post jobs");
    }

    return await ctx.db.insert("jobs", {
      ...args,
      employerId: user._id,
      status: "draft",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("jobs"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const job = await ctx.db.get(args.id);
    if (!job) throw new Error("Job not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || job.employerId !== user._id) {
      throw new Error("Not authorised to modify this job");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const upsertAiAipInternship = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
          .unique()
      : await ctx.db
          .query("users")
          .withIndex("by_role", (q) => q.eq("role", "employer"))
          .first();

    if (identity && user && user.role !== "employer") {
      throw new Error("Only employers can upsert this listing");
    }

    const employerId =
      user?._id ??
      (await ctx.db.insert("users", {
        clerkId: "system:ai-actuaries",
        email: "internships@aiactuaries.org",
        name: "AI Actuaries",
        role: "employer",
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
      applicationUrl: "#",
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
