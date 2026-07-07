/**
 * Content — single source of truth for all rendered copy.
 *
 * Verbatim values (offers, prices, tiers, headlines, taglines, credentials,
 * CTA) are transcribed from docs/CONTENT.md. Em-dash `label — subtitle` pairs
 * from CONTENT.md are RESOLVED INTO LAYOUT here: each becomes two fields, so no
 * literal em-dash is ever printed and none is added.
 *
 * Strings tagged `DERIVED` are NOT verbatim in CONTENT.md (which is an offers
 * doc with no hero/demo/about/connective copy). They are derived from the
 * documented positioning + core differentiator in CLAUDE.md / CONTEXT.md, kept
 * minimal and outcome-first. They live here so a niche re-skin stays
 * content-only. Review/edit freely.
 *
 * SWAPPABLE-FOR-NICHING blocks (content-only, never structural): hero,
 * credentials framing, offer-card copy, about. Section order, the accent CTA,
 * and the light -> dark -> light rhythm are fixed regardless of niche.
 */

export const BOOK_ANCHOR = "#book";

export const site = {
  name: "guirau.tech",
  url: "https://guirau.tech",
  // DERIVED: title/description from positioning + differentiator.
  title: "Alejandro Guirau — Production-grade AI engineering",
  description:
    "Freelance AI/ML engineer. Real trained ML and deployed systems in your cloud, not prototypes. 7+ years shipping cloud-native systems to production.",
};

export const nav = {
  // DERIVED: wayfinding labels.
  links: [
    { label: "Proof", href: "#proof" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
  ],
  // Verbatim CTA wording from CONTENT.md.
  cta: { label: "Book a call", href: BOOK_ANCHOR },
};

/* §2 Hero — SWAPPABLE. Headline DERIVED from documented positioning
   ("production-grade AI, not prototypes"). Subhead is the VERBATIM credibility
   line from CONTENT.md. */
export const hero = {
  eyebrow: "Freelance AI/ML engineer", // DERIVED
  headline: "Production-grade AI, not prototypes.", // DERIVED
  subhead:
    "7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.",
  scrollCue: "Scroll to the proof", // DERIVED
};

/* §3 Credential strip — SWAPPABLE. Credibility line verbatim from CONTENT.md.
   Employer `company — role` pairs split into fields. Santander EXCLUDED
   (gated: unconfirmed for public shipping per CLAUDE.md / CONTEXT.md). */
export const credentials = {
  lead: "7+ years shipping to production", // condensed from the verbatim line
  full: "7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.",
  employers: [
    { company: "HelloFresh", role: "ML & automation for marketing" },
    { company: "Hewlett Packard Enterprise", role: "Data platforms for enterprise" },
    { company: "Telefónica", role: "Data engineering for telco" },
    { company: "Enso (Startup)", role: "AI agents for ecommerce" },
    { company: "Masterschool", role: "Data analytics instructor" },
    // { company: "Santander Bank", role: "Cloud & DevOps for banking" }, // GATED — confirm before shipping
  ],
};

/* §4 Proof zone — dark. Gateway cards ONLY (no live inference). Mono shows
   model/stack labels + an honest "coming soon" status; no fabricated metrics.
   Model names reference the stack cited in CLAUDE.md. Prose DERIVED. */
export const proof = {
  eyebrow: "Proof", // DERIVED
  heading: "See the engineering, not just the claim.", // DERIVED
  lead: "Two live ML demos are on the way. Real trained models, running inference in the browser, not screenshots.", // DERIVED
  demos: [
    {
      id: "classifier",
      title: "Image classifier", // DERIVED
      model: "CLIP ViT-B/32",
      pipeline: "zero-shot · image → label",
      blurb: "Open-vocabulary classification against arbitrary labels.", // DERIVED
      status: "Live demo · coming soon",
    },
    {
      id: "segmentation",
      title: "Semantic segmentation", // DERIVED
      model: "SegFormer + SAM2",
      pipeline: "mask · image → regions",
      blurb: "Per-pixel segmentation with promptable refinement.", // DERIVED
      status: "Live demo · coming soon",
    },
  ],
};

/* §5 Services ladder — offers verbatim from CONTENT.md. `price · duration —
   note` split into fields. Flagship anchored. Prices shown; NO per-card CTA. */
export type Tier = {
  name: string;
  price: string;
  duration: string;
  desc: string;
  recommended?: boolean;
};

export type Offer = {
  id: string;
  index: string;
  name: string;
  /** Second element of a `name — sub` pair, resolved into layout (no em-dash). */
  nameSub?: string;
  price: string;
  duration: string;
  note: string;
  headline: string;
  tagline: string;
  whatYouGet: string[];
  tiers?: Tier[];
  flagship?: boolean;
};

export const services = {
  eyebrow: "Services", // DERIVED
  heading: "A ladder from a quick audit to a full build.", // DERIVED
  lead: "Every engagement starts with a free discovery call. Prices are fixed and shown up front.", // DERIVED
  offers: [
    {
      id: "strategy",
      index: "01",
      name: "AI Strategy Consultation",
      price: "From $199",
      duration: "3 days",
      note: "the entry offer",
      headline: "Find where AI actually pays off",
      tagline: "A scored audit & roadmap of your 2-3 best AI opportunities",
      whatYouGet: [
        "A 60-minute free discovery call",
        "A written audit (up to 4 pages)",
        "Your 2-3 best AI opportunities, scored by return on investment",
        "A roadmap and recommended technical approach",
        "One round of revisions",
      ],
    },
    {
      id: "automation",
      index: "02",
      name: "n8n Workflow Automation",
      price: "From $497",
      duration: "5 days",
      note: "",
      headline: "Manual work automated in a week",
      // Verbatim from CONTENT.md (contains a pre-existing em-dash, preserved).
      tagline: "An n8n & AI workflow — built, tested, and live",
      whatYouGet: [
        "A 30-minute free discovery call",
        "A complete n8n workflow (up to ~15 steps), live in production",
        "AI steps via any major LLM (Claude, OpenAI, Gemini...)",
        "Connected to your existing apps and tools",
        "Deployment, documentation, and a handover call",
        "14 days of post-launch support",
      ],
    },
    {
      id: "agent",
      index: "03",
      name: "Custom AI Agent",
      price: "From $897",
      duration: "3 tiers",
      note: "",
      headline: "Agents that do the real work",
      tagline: "From simple assistant to autonomous multi-step agent",
      whatYouGet: [
        "Built with any framework and LLM (Claude, OpenAI, Gemini...)",
        "Deployed to your cloud (AWS, GCP, Vercel...)",
        "Full technical and business documentation",
        "Handed over and ready to run",
        "At least 14 days of post-launch support",
      ],
      tiers: [
        {
          name: "Simple Agent",
          price: "$897",
          duration: "7 days",
          desc: "A fully custom agent for one job, deployed and documented.",
        },
        {
          name: "Knowledge Agent",
          price: "$1,799",
          duration: "14 days",
          desc: "RAG assistant trained on your content, with a web UI and evals.",
          recommended: true,
        },
        {
          name: "Multi-Step Agent",
          price: "$2,999",
          duration: "28 days",
          desc: "Autonomous agent that runs a full process, connected to your apps.",
        },
      ],
    },
    {
      id: "app",
      index: "04",
      // CONTENT.md offer name "AI App — End-to-End Build": em-dash resolved
      // into two elements (name + nameSub) so no literal em-dash renders.
      name: "AI App",
      nameSub: "End-to-End Build",
      price: "$8,997",
      duration: "5 weeks",
      note: "the flagship",
      headline: "Your AI idea launched in 5 weeks",
      // Verbatim from CONTENT.md (contains a pre-existing em-dash, preserved).
      tagline: "A full-stack AI product — live in your cloud",
      // Verbatim CONTENT.md bullets (label: description). Nested backend/frontend
      // sub-points kept as their own items so no selling point is dropped.
      whatYouGet: [
        "A complete AI app: Full-stack AI app running on cloud infrastructure. An app your customers can use from day one, not a prototype.",
        "AI that thinks like your business: Your workflows and knowledge digitalized, answers grounded in your data, and systems that follow your processes.",
        "Solid architecture, no over-engineering: AI agents, custom ML APIs, data pipelines, analytics systems, reporting platforms, workflow automation…",
        "A solid backend in Python or TypeScript, built to scale and easy to maintain.",
        "A modern React frontend that will make your product a pleasure to use.",
        "Enterprise-grade infrastructure: AWS, GCP or Vercel with Docker & Kubernetes for scalability, fault-tolerant design, and automated backups. You'll never lose data or stop serving users.",
        "Your data stays private: Your data lives in your own cloud, under your control, never passing through third parties. Compliant setup (GDPR, ISO) available.",
        "Nothing depends on me: Infrastructure-as-code and CI/CD make every setup reproducible, plus full technical docs for any engineer to extend it, and business docs for you to understand it without being technical.",
        "30 days of post-launch support: I stay on after launch to fix issues and make sure everything runs smoothly.",
      ],
      flagship: true,
    },
  ] satisfies Offer[],
};

/* §6 How it works + de-riskers. Shared 3-step DERIVED/generalized from the
   repeated per-offer step language in CONTENT.md. De-riskers pull verbatim
   phrases from the offers. */
export const process = {
  eyebrow: "How it works", // DERIVED
  heading: "Discovery, build, hand over.", // DERIVED
  lead: "The same disciplined path on every engagement, sized to the offer.", // DERIVED
  steps: [
    {
      step: "01",
      title: "Discovery call & scope",
      body: "We map your goals, your process, and the right scope, so what I build fits how you actually work.",
    },
    {
      step: "02",
      title: "Build & evaluate",
      body: "I build and validate against real scenarios. You see it running on real data before it goes live. No surprises.",
    },
    {
      step: "03",
      title: "Deploy & hand over",
      body: "Live in your cloud, fully documented, with post-launch support so nothing depends on me.",
    },
  ],
  deriskers: [
    "Deployed to your cloud (AWS, GCP, Vercel)",
    "Infrastructure-as-code and CI/CD, fully reproducible",
    "Full technical and business documentation",
    "Your data stays private, never through third parties",
    "No-risk guarantee: if AI is not the answer, you don't pay",
  ],
};

/* §7 About — SWAPPABLE. Engineer-first; physics + ex-documentary/TV as texture.
   DERIVED from CONTEXT.md facts. */
export const about = {
  eyebrow: "About", // DERIVED
  heading: "Engineer first. Everything else is seasoning.", // DERIVED
  paragraphs: [
    "I am Alejandro Guirau, a freelance AI/ML engineer with 7+ years across software, data, ML/AI, and DevOps, shipping cloud-native systems to production.",
    "A B.Sc. in Physics taught me to model hard problems. A past life as a documentary filmmaker and TV presenter taught me to explain them. Both help; neither is the headline.",
    "I work fully remotely as an independent contractor (Freiberufler, registered in Germany), currently from Koh Phangan, Thailand.",
  ], // DERIVED (facts from CONTEXT.md)
  signature: "Ale Guirau",
};

/* §8 Final CTA — the single emphatic ask. CTA + reassurance verbatim from
   CONTENT.md; heading DERIVED. */
export const finalCta = {
  heading: "Let's find where AI pays off.", // DERIVED
  body: "Start with a free discovery call. If AI is not the answer, I'll tell you honestly. No upsell, no pressure.", // condensed from CONTENT.md no-risk copy
  cta: { label: "Book your discovery call", href: BOOK_ANCHOR },
  reassurance: "Free, no risk, no commitment.",
};

/* §9 Footer. Known values; placeholders flagged for you to fill. */
export const footer = {
  email: "alejandroguirau@gmail.com",
  linkedin: { label: "LinkedIn", href: "#" }, // TODO: real LinkedIn URL
  location: "Remote · Koh Phangan, Thailand (GMT+7)",
  entity: "Alejandro Guirau · Freiberufler, Germany",
  legal: [
    { label: "Imprint", href: "#" }, // TODO: real Impressum
    { label: "Privacy", href: "#" }, // TODO: real privacy page
  ],
};
