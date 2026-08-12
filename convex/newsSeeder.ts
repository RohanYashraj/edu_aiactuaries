import { mutation } from "./_generated/server";

const newsItems = [
  {
    slug: "five-months-of-impact",
    title: "Five Months of Impact",
    category: "Community",
    metric: "18 initiatives",
    summary: "18 initiatives across AI education, actuarial programs, research, industry collaboration and student development.",
    content: "Aum Sri Sairam.\\n\\nAs Bhagawan Sri Sathya Sai Baba reminds us, “Merit is also Grace.”\\n\\nMerit is not measured by titles or recognition, but by the positive impact we create in the lives of students, professionals, institutions, and society.\\n\\nIn the last five months alone, by His Grace, Sri Sathya Sai Institute of Actuaries (SSSIA) is blessed to accomplish the following:\\n\\n1. Conducted 8-week AI Actuarial Internships for 100+ actuarial students with national and international participation.\\n2. Conducted a 4-week AI Internship for 150+ Computer Science graduates with national and international participation.\\n3. Delivered a 3-week Summer Program for 90+ school students nationally and internationally.\\n4. Organized four actuarial profession webinars, each attended by 100+ participants internationally.\\n5. Conducted a 3-week program on Agentic AI Applications in Financial Mathematics for Indian and international students.\\n6. Delivered a 3-week CAS, USA Exam 5 Rating & Reserving Lecture Series with national and international participation.\\n7. Conducted four workshops with IFoA, UK and SSSIA on AI Foundations to Agents across Mumbai, Delhi and Bangalore, with 163 participants representing 18 top corporates/companies.\\n8. Signed up to deliver a workshop at the Institute of Actuaries of India Health Seminar in Delhi.\\n9. Published two pioneering books authored by members of SSSIA for the actuarial profession: \\\"Agentic AI for Actuaries\\\" in USA and \\\"The Full Stack Actuary\\\" in UK & Ireland.\\n10. Presented at the CAS International Teaching Summit in Thailand.\\n11. Grew the SSSIA community to over 1,200 members.\\n12. Built collaborations with 180+ institutions through internships and professional initiatives.\\n13. Served as faculty for the International Actuarial Faculty Development Program by ACTEX, USA.\\n14. Published two book chapters in a globally indexed journal from New York in the areas of Farmer's Revenue Protection and AI-integrated education.\\n15. Launched SUTRA, the official research and publication hub of SSSIA.\\n16. Successfully completed 54+ student projects through internship programs.\\n17. Initiated 36+ corporate employee projects following the IFoA workshops.\\n18. Created the Indian Actuarial Climate Index — a first-of-its-kind initiative for the Indian actuarial profession.",
    linkedinUrl: "",
    featured: true,
  },
  {
    slug: "ai-actuarial-internship-applications",
    title: "AI Actuarial Internship Program Update: 470+ Applications Received",
    category: "Education",
    metric: "470+ applications",
    summary: "SSSIA announced an overwhelming response to its AI Actuarial Internship Program, receiving more than 470 applications from students across over 100 universities and colleges.",
    content: "The program combines actuarial science and artificial intelligence through hands-on learning, mentorship and customized learning paths. With shortlisted candidate interviews underway, the internship will commence in May 2026 across multiple batches with customized focus areas and durations.\\n\\nSupported by 45+ actuarial data science mentors, this free educational program welcomes international participants from seven countries, including the USA.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_actuarialscience-artificialintelligence-internship-activity-7454061391860170752-YE94",
    featured: false,
  },
  {
    slug: "ai-applications-multi-industry",
    title: "AI Applications in a Multi-Industry Setup — Internship Program",
    category: "Education",
    metric: "4-week hands-on internship",
    summary: "SSSIA reopened applications for its AI Applications in a Multi-Industry Setup internship, giving students the opportunity to apply AI, analytics and computing skills to real-world problems.",
    content: "Running from June 1, 2026 to June 27, 2026, this 4-week hands-on internship explores Artificial Intelligence and Data & Analytics across Insurance, Biosciences, Healthcare, and Emerging industries.\\n\\nEligibility includes students pursuing relevant BTech, BSc, and MSc degrees. The program is offered free of charge to students in India and abroad.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_ai-actuarial-artificialintelligence-activity-7464521254268678144-ZU5C",
    featured: false,
  },
  {
    slug: "agentic-ai-financial-mathematics",
    title: "Agentic AI for Aspiring Actuaries — Financial Mathematics",
    category: "Education",
    metric: "90 hours workload",
    summary: "SSSIA launched a three-week Agentic AI program designed to connect actuarial concepts with production-oriented AI engineering and multi-agent systems.",
    content: "Agentic AI for Aspiring Actuaries — Module 1: Financial Mathematics is a fully online 3-week program starting June 11, 2026. \\n\\nTopics covered include Time Value of Money, Annuities, Loans & Amortisation, Bond Pricing, Yield Curves, Duration & Convexity, and ALM & Immunisation. The program leverages hands-on labs, capstone projects, and multi-agent systems utilizing Gemini API, MCP, Python, and Google Colab.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_actuarialscience-artificialintelligence-activity-7460685348159922176-WU7i",
    featured: false,
  },
  {
    slug: "cas-exam-5-lecture-series",
    title: "CAS Exam 5 — Ratemaking & Reserving Lecture Series",
    category: "Education",
    metric: "7 sessions",
    summary: "SSSIA announced a fully online CAS Exam 5 lecture series covering ratemaking and reserving concepts through a structured seven-session program.",
    content: "Starting June 7, 2026, this fully online lecture series comprises 7 sessions (approximately 3 hours per session). Topics include reserving foundations, Chain Ladder, Expected Claims, advanced reserving techniques, and ratemaking.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_actuarial-casexam5-insurance-activity-7468993464421167104-flz7",
    featured: false,
  },
  {
    slug: "sssia-summer-course-outcomes",
    title: "SSSIA Summer Course 2026 — Outcomes",
    category: "Education",
    metric: "165 registered",
    summary: "SSSIA shared the outcomes of its Summer Course 2026, highlighting national and international participation and strong participant feedback.",
    content: "Participants built strong foundations in Financial Mathematics, Probability, and Microeconomics. The program saw 165 registered participants, with 45+ completing it end-to-end. We welcomed students from 22 Indian states and 5 countries, representing 45+ institutions from Class 12 up through postgraduate levels.\\n\\nThe cohort consisted of 45% women applicants and rated their overall experience 4.85/5.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_sssia-summer-course-2026-highlights-activity-7466887151029223424-YjEX",
    featured: false,
  },
  {
    slug: "actuarial-profession-evolution-webinar",
    title: "Actuarial Profession Evolution and Technology Trends",
    category: "Events",
    metric: "Webinar",
    summary: "SSSIA organized a webinar examining how cloud technologies, data engineering, LLMs and Agentic AI are transforming actuarial work.",
    content: "Held on 10 May 2026 (9:00 AM – 10:00 AM IST), this webinar explored the need for full-stack actuarial capabilities.\\n\\nKey topics discussed included AWS, Azure, Databricks, Snowflake, cloud computing, data pipelines, APIs, model deployment, LLMs, Agentic AI, and future actuarial skills.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_sssia-webinar-activity-7457651010342375424-YdJG",
    featured: false,
  },
  {
    slug: "cas-teaching-summit-collaboration",
    title: "CAS International Teaching Summit — Global Collaboration",
    category: "International",
    metric: "Teaching Summit",
    summary: "SSSIA participated in the international actuarial education ecosystem through the CAS Teaching Summit, engaging with global actuarial educators.",
    content: "SSSIA joined industry leaders and educators at the Casualty Actuarial Society Global Case Studies / Teaching Summit in Thailand.\\n\\nDiscussions focused on actuarial education, global case studies, AI integration, industry readiness, general insurance, innovation, risk management, and strong collaboration with CAS.",
    linkedinUrl: "https://www.linkedin.com/posts/sssia_cas-generalinsurance-actuarialscience-activity-7465731859931377664-oBmo",
    featured: false,
  },
  {
    slug: "ifoa-sssia-ai-workshops-internal",
    title: "IFoA × SSSIA AI Workshops",
    category: "Industry",
    metric: "163 participants",
    summary: "Four workshops conducted with IFoA and SSSIA across Mumbai, Delhi and Bangalore.",
    content: "In collaboration with the Institute and Faculty of Actuaries (IFoA), we conducted four high-impact AI workshops across major Indian cities, bringing together 163 professionals from 18 leading organizations.",
    linkedinUrl: "",
    featured: false,
  },
  {
    slug: "agentic-ai-for-actuaries-book",
    title: "Agentic AI for Actuaries",
    category: "Publications",
    metric: "Book Publication",
    summary: "Published a pioneering book authored by members of SSSIA for the actuarial profession in the USA.",
    content: "A groundbreaking publication exploring the integration of autonomous AI systems within traditional actuarial workflows, authored by SSSIA members for the US market.",
    linkedinUrl: "",
    featured: false,
  },
  {
    slug: "the-full-stack-actuary-book",
    title: "The Full Stack Actuary",
    category: "Publications",
    metric: "Book Publication",
    summary: "Published a pioneering actuarial book authored by members of SSSIA for the UK & Ireland.",
    content: "Authored by SSSIA members, this book provides a comprehensive guide for modern actuaries in the UK & Ireland to expand their skillsets across data engineering, software development, and machine learning.",
    linkedinUrl: "",
    featured: false,
  },
  {
    slug: "sutra-research-hub-launch",
    title: "SUTRA Research Hub",
    category: "Research",
    metric: "Platform Launch",
    summary: "Launched SUTRA, the official research and publication hub of Sri Sathya Sai Institute of Actuaries.",
    content: "SUTRA serves as our dedicated platform for advancing actuarial science through rigorous research, whitepapers, and thought leadership publications.",
    linkedinUrl: "",
    featured: false,
  },
  {
    slug: "indian-actuarial-climate-index-launch",
    title: "Indian Actuarial Climate Index",
    category: "Research",
    metric: "Climate Index",
    summary: "Created the Indian Actuarial Climate Index — a first-of-its-kind initiative for the Indian actuarial profession.",
    content: "A pioneering initiative to objectively measure and track changes in extreme weather events and sea levels across India, providing crucial data for risk assessment and climate resilience planning.",
    linkedinUrl: "",
    featured: false,
  }
];

export const upsert18Initiatives = mutation({
  args: {},
  handler: async (ctx) => {
    let order = 0;
    let publishedAt = Date.now();
    for (const item of newsItems) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          title: item.title,
          summary: item.summary,
          body: item.content,
          featured: item.featured,
          details: {
            kind: "news",
            category: item.category,
            metric: item.metric,
            linkedinUrl: item.linkedinUrl,
            sourceName: item.linkedinUrl ? "SSSIA LinkedIn" : undefined,
            sourceType: item.linkedinUrl ? "linkedin" : undefined,
          },
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("content", {
          type: "news",
          slug: item.slug,
          status: "published",
          title: item.title,
          summary: item.summary,
          body: item.content,
          order,
          featured: item.featured,
          publishedAt,
          updatedAt: Date.now(),
          details: {
            kind: "news",
            category: item.category,
            metric: item.metric,
            linkedinUrl: item.linkedinUrl,
            sourceName: item.linkedinUrl ? "SSSIA LinkedIn" : undefined,
            sourceType: item.linkedinUrl ? "linkedin" : undefined,
          },
        });
      }
      order++;
      // slight decrement to keep the order in descending sorted chronologically
      publishedAt -= 1000;
    }
    return "Success";
  },
});
