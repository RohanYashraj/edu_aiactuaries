/**
 * Site-level FAQs. Rendered on the homepage and at /faq, and emitted as
 * FAQPage structured data from both.
 *
 * These are written to be quotable on their own: an answer engine lifts a
 * single answer out of context, so each one repeats enough of the question to
 * still make sense standing alone.
 */
export const SITE_FAQS = [
  {
    question: "What is the Sri Sathya Sai Institute of Actuaries?",
    answer:
      "The Sri Sathya Sai Institute of Actuaries (SSSIA) is an Indian educational institute teaching actuarial science alongside data science and artificial intelligence. It runs certifications, workshops, and a free annual summer course, and is powered by aiactuaries.org.",
  },
  {
    question: "Do the programs cost anything?",
    answer:
      "The Summer Course in Actuarial Data Science is offered entirely free of charge, in line with the guiding principle of providing education freely, inspired by Bhagawan Sri Sathya Sai Baba. Fees for other programs are listed on each program's page.",
  },
  {
    question: "Who can become a member?",
    answer:
      "Membership is open and free to anyone interested in actuarial science and AI — school and college students, recent graduates, working professionals, and academics. Sign up, complete a short profile, and you get access to programs, workshops, and events.",
  },
  {
    question: "Do I need an actuarial background to join a program?",
    answer:
      "No. The summer course assumes no prior actuarial knowledge and covers foundations including financial mathematics, probability, microeconomics, R, and Excel. Advanced certifications list their own prerequisites.",
  },
  {
    question: "Which professional bodies does the Institute work with?",
    answer:
      "The Institute engages with the Institute and Faculty of Actuaries (IFoA), the Society of Actuaries (SOA), the Casualty Actuarial Society (CAS), and the Institute of Actuaries of India (IAI). The IFoA is the Knowledge Partner for the 2026 summer course.",
  },
  {
    question: "Are the programs delivered online?",
    answer:
      "Most programs run online so students across India can attend, with some workshops delivered in person or hybrid. Each program page states its delivery mode and location.",
  },
] as const;
