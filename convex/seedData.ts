/**
 * Seed payloads for the unified `content` table.
 *
 * These are verbatim migrations of content that used to be hardcoded in TSX:
 * the summer-program detail page, the `events` and `upcomingPrograms` arrays,
 * the `recentHighlights` partner entries (five of which were commented out and
 * are restored here), and the certification/workshop fallback arrays.
 *
 * Kept separate from migrations.ts so the mutation logic stays readable.
 */

import type { Infer } from "convex/values";
import type { contentDetailsValidator } from "./schema";

type Details = Infer<typeof contentDetailsValidator>;

export type SeedContent = {
  type: "event" | "workshop" | "certification" | "program" | "news";
  slug: string;
  status: "draft" | "published";
  title: string;
  subtitle?: string;
  summary: string;
  body?: string;
  badge?: string;
  coverImagePath?: string;
  coverImageAlt?: string;
  startDate?: number;
  endDate?: number;
  dateLabel?: string;
  location?: string;
  order: number;
  featured: boolean;
  featureRank?: number;
  tags?: string[];
  facts?: { icon?: string; label: string; value: string }[];
  ctas?: { label: string; href: string; variant?: "primary" | "secondary" }[];
  partners?: {
    name: string;
    role?: string;
    logoPath?: string;
    logoAlt?: string;
    href?: string;
    invertInDark?: boolean;
  }[];
  faqs?: { question: string; answer: string }[];
  details: Details;
};

const utc = (iso: string) => Date.parse(`${iso}T00:00:00.000Z`);

/* -------------------------------------------------------------------------- */
/*  Programs                                                                  */
/* -------------------------------------------------------------------------- */

const summerProgram2026: SeedContent = {
  type: "program",
  // Unchanged from the old static route: this URL is in circulation.
  slug: "summer-program-2026",
  status: "published",
  title: "Summer Course in Actuarial Data Science - 2026",
  summary:
    "The Summer Course in Actuarial Data Science is a free three-week program run by the Sri Sathya Sai Institute of Actuaries, from 27 April to 16 May 2026, teaching school and college students the foundations of actuarial science and data analysis. The Institute and Faculty of Actuaries (IFoA), UK is the 2026 Knowledge Partner.",
  badge: "Registrations Open",
  dateLabel: "27 April 2026 – 16 May 2026",
  startDate: utc("2026-04-27"),
  endDate: utc("2026-05-16"),
  location: "Online",
  order: 0,
  featured: true,
  featureRank: 0,
  tags: ["Summer Course", "Foundations", "Free"],
  body: `We are pleased to present the **third edition** of the Summer Course in Actuarial Data Science, organized by the **Sri Sathya Sai Institute of Actuaries** and powered by **AI Actuaries**.

Over the past two editions, the program has seen strong participation, with many students going on to pursue actuarial science as a serious academic and career pathway. This continued interest reflects the growing relevance of actuarial skills in a data-driven world.

This program is offered **free of charge**, in line with the guiding principle of providing education freely, inspired by Bhagawan Sri Sathya Sai Baba.

We look forward to welcoming motivated students who are keen to explore and build a foundation in actuarial data science.`,
  facts: [
    { icon: "Calendar", label: "Program Dates", value: "27 April 2026 – 16 May 2026" },
    { icon: "Clock", label: "Commitment", value: "~2 hours/day for online sessions" },
    {
      icon: "Users",
      label: "Eligibility",
      value: "Open to students from schools and colleges",
    },
    { icon: "GraduationCap", label: "Program Fee", value: "Free of charge" },
  ],
  ctas: [
    { label: "Register Now", href: "https://lnkd.in/gsewFfW7", variant: "primary" },
  ],
  partners: [
    {
      name: "Institute and Faculty of Actuaries (IFoA), UK",
      role: "Knowledge Partner",
      logoPath: "/ifoa.svg",
      logoAlt: "IFoA logo",
      invertInDark: true,
    },
  ],
  faqs: [
    {
      question: "Who can join the Summer Course in Actuarial Data Science?",
      answer:
        "The program is open to students from schools and colleges. No prior actuarial background is required — the course covers foundations from the ground up.",
    },
    {
      question: "How much does the program cost?",
      answer:
        "Nothing. The program is offered free of charge, in line with the guiding principle of providing education freely, inspired by Bhagawan Sri Sathya Sai Baba.",
    },
    {
      question: "How much time does it take each day?",
      answer:
        "Roughly two hours a day of online sessions, across three weeks from 27 April to 16 May 2026.",
    },
    {
      question: "Do participants receive a certificate?",
      answer:
        "Yes. A participation and completion certificate is awarded to students who successfully meet the program requirements.",
    },
  ],
  details: {
    kind: "program",
    lifecycle: "upcoming",
    mode: "online",
    edition: "Third edition",
    commitmentLabel: "~2 hours/day for online sessions",
    feeLabel: "Free of charge",
    registrationUrl: "https://lnkd.in/gsewFfW7",
    eligibility: ["Open to students from schools and colleges"],
    highlights: [
      "Duration: 3 weeks",
      "Delivered by experienced faculty and industry practitioners",
      "Guest sessions by industry leaders on emerging trends in technology and the actuarial domain",
      "A participation and completion certificate will be awarded to students who successfully meet the program requirements",
    ],
    coverage: [
      "Financial Mathematics",
      "Probability",
      "Microeconomics",
      "R – Basics",
      "MS Excel – Basics",
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  News — the partner highlights that were commented out in app/page.tsx     */
/* -------------------------------------------------------------------------- */

type NewsSeed = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  partner: { name: string; logoPath: string; logoAlt: string; invertInDark?: boolean };
};

const newsSeeds: NewsSeed[] = [
  {
    slug: "webinar-ai-applications-actuarial-science",
    title: "Webinar on AI Applications in Actuarial Science",
    summary:
      "Delivered a webinar focused on practical AI applications in actuarial science for participants online and in Puttaparthi.",
    location: "Online and Puttaparthi",
    partner: {
      name: "AIActuaries",
      logoPath: "/aiactuaries.png",
      logoAlt: "AIActuaries logo",
    },
  },
  {
    slug: "soa-leadership-meeting-bangalore",
    title: "Leadership Meeting and Partner Lunch",
    summary:
      "Society of Actuaries leadership meeting followed by a partner lunch at Hotel Sheraton, Bangalore.",
    location: "Bangalore",
    partner: {
      name: "Society of Actuaries",
      logoPath: "/soa.png",
      logoAlt: "Society of Actuaries logo",
    },
  },
  {
    slug: "global-conference-of-actuaries-mumbai",
    title: "Global Conference of Actuaries",
    summary:
      "Participation in the Global Conference of Actuaries by the Institute of Actuaries of India at Jio World Convention Centre, Mumbai.",
    location: "Mumbai",
    partner: {
      name: "Institute of Actuaries of India",
      logoPath: "/iai.png",
      logoAlt: "Institute of Actuaries of India logo",
    },
  },
  {
    slug: "cas-international-leadership-meeting-mumbai",
    title: "International Leadership Meeting and Partner Dinner",
    summary:
      "Casualty Actuarial Society international leadership meeting with an evening partner dinner in Mumbai.",
    location: "Mumbai",
    partner: {
      name: "Casualty Actuarial Society",
      logoPath: "/cas.png",
      logoAlt: "Casualty Actuarial Society logo",
    },
  },
  {
    slug: "ifoa-industry-academia-meet-christ-university",
    title: "Industry-Academia Meet",
    summary:
      "Institute and Faculty of Actuaries industry-academia engagement hosted at Christ University, Bangalore.",
    location: "Bangalore",
    partner: {
      name: "Institute and Faculty of Actuaries",
      logoPath: "/ifoa.svg",
      logoAlt: "IFoA logo",
      invertInDark: true,
    },
  },
  {
    slug: "actex-learning-meeting-bangalore",
    title: "ACTEX Learning Meeting",
    summary:
      "Meeting with ACTEX Learning to discuss actuarial education pathways and collaborative learning opportunities in Bangalore.",
    location: "Bangalore",
    partner: {
      name: "ACTEX Learning",
      logoPath: "/actex.png",
      logoAlt: "ACTEX Learning logo",
    },
  },
];

const news: SeedContent[] = newsSeeds.map((item, index) => ({
  type: "news",
  slug: item.slug,
  status: "published",
  title: item.title,
  summary: item.summary,
  location: item.location,
  order: index,
  featured: index < 4,
  featureRank: index < 4 ? index + 1 : undefined,
  partners: [{ ...item.partner, role: "Partner" }],
  details: { kind: "news" },
}));

/* -------------------------------------------------------------------------- */
/*  Certifications                                                            */
/* -------------------------------------------------------------------------- */

const certifications: SeedContent[] = [
  {
    type: "certification",
    slug: "ai-actuaries-certification",
    status: "published",
    title: "AI Actuaries Certification",
    summary:
      "The AI Actuaries Certification is the Institute's flagship program, blending actuarial science with machine learning and AI for professionals who want to lead the transformation of the insurance and risk industry.",
    order: 0,
    featured: true,
    featureRank: 0,
    tags: ["Flagship", "AI", "Machine Learning"],
    body: "Our flagship programme blends actuarial science with cutting-edge AI and machine learning. It is designed for professionals who want to lead the transformation of the insurance and risk industry.",
    details: {
      kind: "certification",
      enrollmentStatus: "open",
      level: "professional",
      credentialAwarded: "AI Actuaries Certification",
    },
  },
  {
    type: "certification",
    slug: "data-science-for-actuaries",
    status: "published",
    title: "Data Science for Actuaries",
    summary:
      "Data Science for Actuaries builds a foundation in data science techniques tailored to actuarial work, from statistical modelling through to predictive analytics.",
    order: 1,
    featured: false,
    body: "Build a strong foundation in data science techniques tailored for actuarial applications — from statistical modelling to predictive analytics.",
    details: {
      kind: "certification",
      enrollmentStatus: "coming_soon",
      level: "foundation",
    },
  },
  {
    type: "certification",
    slug: "advanced-risk-analytics",
    status: "published",
    title: "Advanced Risk Analytics",
    summary:
      "Advanced Risk Analytics covers modern risk quantification: stochastic modelling, scenario analysis, and the computational techniques behind them.",
    order: 2,
    featured: false,
    body: "Deep-dive into modern risk quantification methods, stochastic modelling, and scenario analysis powered by computational techniques.",
    details: {
      kind: "certification",
      enrollmentStatus: "coming_soon",
      level: "advanced",
    },
  },
  {
    type: "certification",
    slug: "machine-learning-in-insurance",
    status: "published",
    title: "Machine Learning in Insurance",
    summary:
      "Machine Learning in Insurance covers practical applications across pricing, reserving, fraud detection, and customer analytics.",
    order: 3,
    featured: false,
    body: "Practical applications of machine learning in pricing, reserving, fraud detection, and customer analytics for the insurance sector.",
    details: {
      kind: "certification",
      enrollmentStatus: "coming_soon",
      level: "professional",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Workshops                                                                 */
/* -------------------------------------------------------------------------- */

const workshops: SeedContent[] = [
  {
    type: "workshop",
    slug: "introduction-to-actuarial-machine-learning",
    status: "published",
    title: "Introduction to Actuarial Machine Learning",
    summary:
      "A hands-on workshop covering supervised and unsupervised learning techniques applied to real-world actuarial datasets.",
    startDate: utc("2026-04-15"),
    dateLabel: "15 April 2026",
    location: "Online",
    order: 0,
    featured: false,
    details: { kind: "workshop", lifecycle: "upcoming", mode: "online" },
  },
  {
    type: "workshop",
    slug: "python-for-actuarial-modelling",
    status: "published",
    title: "Python for Actuarial Modelling",
    summary:
      "Get started with Python for building actuarial models — data wrangling, statistical analysis, and visualisation.",
    startDate: utc("2026-03-20"),
    dateLabel: "20 March 2026",
    location: "Online",
    order: 1,
    featured: false,
    details: { kind: "workshop", lifecycle: "upcoming", mode: "online" },
  },
  {
    type: "workshop",
    slug: "deep-learning-in-risk-assessment",
    status: "published",
    title: "Deep Learning in Risk Assessment",
    summary:
      "Neural network architectures and their applications in insurance risk modelling and claims prediction.",
    startDate: utc("2026-02-10"),
    dateLabel: "10 February 2026",
    location: "Mumbai & Online",
    order: 2,
    featured: false,
    details: {
      kind: "workshop",
      lifecycle: "completed",
      mode: "hybrid",
      venue: "Mumbai",
    },
  },
  {
    type: "workshop",
    slug: "nlp-for-insurance-document-analysis",
    status: "published",
    title: "NLP for Insurance Document Analysis",
    summary:
      "How natural language processing is changing the way insurers extract insight from policy documents and claims.",
    startDate: utc("2026-05-01"),
    dateLabel: "1 May 2026",
    location: "Online",
    order: 3,
    featured: false,
    details: { kind: "workshop", lifecycle: "upcoming", mode: "online" },
  },
];

export const seedContentDocs: SeedContent[] = [
  summerProgram2026,
  ...certifications,
  ...workshops,
  ...news,
];
