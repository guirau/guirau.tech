# The Method

> Building an animated website with Claude + Higgsfield

## Phase 1 — Setup and skills

1. Install design skills

`Metrics Media`

- **Front-End Design (by Anthropic)** — runs in the background, bans overused fonts, pushes bolder layouts, and improves copywriting
- **UI/UX Pro Max (community)** — 57 UI styles, 95 color palettes, 56 font pairings. You call this one directly when you want a big design intervention

`Nick Saraev`

- **Taste Skill (by Leon Lin)** ([github.com/Leonxlnx/taste-skill](github.com/Leonxlnx/taste-skill))

2. Turn on auto mode

## Phase 2 — The brief and first build

**Gather 3–5 references**. Screenshots of sites you like from Dribbble, Awwwards, or a Pinterest search. For each, note the one thing you're stealing (the whole site, or just its hero, or just its scroll behavior).

Collect:

- One hero you love (the first-impression moment)
- One scroll/motion behavior you want (this maps to your Phase 4 exploding-view section)
- One typography + layout example (how they handle big headlines + hierarchy)
- One "projects/case-study" section (since closing clients hinges on how your ML demos are presented)
- (Optional) one wildcard that just feels right, even if you can't articulate why

1. **Style references**

> With screenshots

```
Here are 3–5 reference sites I've collected for the STYLE of my portfolio,
guirau.tech — how it should look and feel, not how it's sequenced (I'll
cover structure and narrative flow separately).

Context: I'm Alejandro Guirau, a freelance AI/ML engineer and consultant.
This site's job is to close new clients in the tech space, so it needs to 
read as engineering credibility and taste, not an art project. 
Target aesthetic: cinematic, dark, technical-luxury — moody, precise, 
restrained, subtle film grain. The register of Linear / Vercel / 
Anthropic, not a flashy agency.

For each reference I'm attaching, I've noted the one visual thing I want
from it (its hero, its typography, its colour, its motion feel, or how it
presents work).

Before building anything, analyze these references together and tell me:
1. The design principles they share — what actually makes them feel
   expensive and credible (colour restraint, hierarchy, spacing, motion
   discipline).
2. Where they DIFFER, and which direction you'd recommend for my specific
   goal of closing tech clients, with your reasoning.
3. A proposed style direction for guirau.tech: colour palette (hex), font
   pairing (no Inter), and the 2–3 motion moments worth investing in.

Don't write any code yet, and don't propose page structure here — style
only. I want to lock the visual direction with you first.

Once I approve the style direction, record it in a CLAUDE.md file at the
project root under a "## Style & Design System" section (create the file if
it doesn't exist; if it does, add or update ONLY this section and leave any
other sections untouched). Capture: the colour palette with hex values,
the font pairing, the motion moments we're investing in, and the core
aesthetic principles (e.g. colour restraint, hierarchy rules, no Inter).
Do this only after I approve, not while it's still a proposal.
```

> With design guidelines

```
You are my design director. I want to lock the VISUAL STYLE DIRECTION for a
project before any build — style and feel only. Do NOT write code and do NOT
propose page structure or content sequencing; those are separate conversations.

## Step 0 — Get my inputs first
You need two things from me before designing. Establish both before proposing
anything:

A) PROJECT CONTEXT — the project's purpose, audience, goal, and the feeling it
   should convey. This is what you justify every design choice against.
   To find it, in order:
   1. Look for a file named CONTEXT.md in the project root or under docs/, and
      read it if present.
   2. Otherwise, use whatever context I've given inline.
   3. If you still don't have it, ASK me and wait — never design blind, and
      never fabricate a goal or audience.

B) DESIGN GUIDELINES — my explicit visual direction (palette, type, motion,
   brand). This one is optional. I may provide it inline, by reference
   (a file/URL/brand kit), or not at all.
   - If it's missing, ask whether I have any. Only if I confirm I have none,
     INFER a direction from the project context and ask targeted clarifying
     questions to close the genuine gaps.

Never assume inputs I haven't given or confirmed.

## Step 1 — Interrogate the brief, don't just accept it
Whatever I give you (or we infer together), pressure-test it before designing:
- Name any TENSIONS or CONTRADICTIONS between the stated principles.
- Name anything UNDERSPECIFIED that must be decided before building (e.g. theme,
  the single accent hue, font licensing/performance, typographic personality).
- Where a principle would work AGAINST the project's stated goal, PUSH BACK with
  your reasoning and a concrete alternative.

## Step 2 — Propose a concrete design system
Turn the brief into specifics. Justify EACH choice against the project's goal,
not just "it looks good":
- COLOUR PALETTE — exact hex values with semantic roles (background, surfaces,
  borders, text tiers, accent). Keep colour restrained and semantic.
- TYPE PAIRING — a display face and a body face (add a third role, e.g. mono,
  only if it earns its place), with rationale. Avoid generic default stacks
  unless there's a real reason.
- TYPE SCALE — a fluid, modular scale with clear, deliberate hierarchy.
- SPACING RHYTHM — a base unit and scale; favour generous, intentional (not
  uniform) spacing.
- MOTION — identify the one or two high-impact moments worth investing in; keep
  everything else quiet.
- CORE AESTHETIC PRINCIPLES — the 3–5 rules that keep the system coherent.

## How to decide
- Make DECISIVE recommendations for anything you can reasonably infer — a
  recommendation, not an exhaustive menu.
- Use TARGETED QUESTIONS only for genuine forks that depend on my taste or brand
  (e.g. accent direction, theme strategy). Present your recommended option first.

## Guardrails (apply unless my guidelines override them)
- Don't assume a theme — decide light vs dark deliberately and justify it against
  the audience and goal. Do not default to dark.
- Meet WCAG AA contrast and respect prefers-reduced-motion.
- Respect a sensible performance budget (lean, self-hosted fonts; motion on
  compositor-friendly properties; no heavy dependencies just for effects).
- Avoid generic, template-looking output — every choice should feel intentional
  and specific to this project.
- Keep effects disciplined: atmosphere through restraint, not spectacle.

## After I approve
ONLY once I've approved the direction, record it in a CLAUDE.md at the project
root under a "## Style & Design System" section:
- Create the file if it doesn't exist.
- If it exists, add or update ONLY this section; leave all other sections
  untouched.
- Capture: the colour palette with hex values, the font pairing, the type scale,
  the spacing rhythm, the motion moments, and the core aesthetic principles.
Do this only after approval — never while it's still a proposal.

---
DESIGN GUIDELINES (optional):
[ Any explicit palette / type / motion / brand direction — or a file reference.
  Leave blank if you have none and I'll infer. Project context is read
  automatically from CONTEXT.md (root or docs/). ]
```

3. **Structure references**

> With URLs

```
Here are 2–3 websites whose STRUCTURE and NARRATIVE FLOW I want to learn
from for guirau.tech (separate from the style references I shared earlier —
these are about how the page is sequenced and how it converts, not how it
looks).

For each, I've noted its section order and what I think it does well as you
scroll.

My site is a single-page scroll portfolio whose job is to close tech
clients. The funnel I want is: demos build trust → productized offers
convert → free discovery call closes. Crucially, scrolling should feel like
a story that earns the conversion at the end, not a list of sections
stacked on top of each other.

Before building anything, analyze these references together and give me:
1. The narrative pattern they share — how each one uses scroll to move a
   visitor from "who is this" to "I should hire this person." Where does
   each turn from proof to pitch? How do they earn the ask?
2. A recommended SECTION ORDER for guirau.tech that best serves my
   demos → offers → discovery-call funnel, with a one-line reason for each
   section's placement and the transition into the next.
3. The 2–3 scroll moments that should carry the most narrative weight (the
   emotional beats), and which sections should stay quiet by contrast.
4. Where the conversion actually lands, and how the sections before it set
   it up.

Don't write code yet, and don't design visuals here — I only want the
structural/narrative blueprint. We'll merge this with the style direction
and then build.

Once I approve the blueprint, record it in the project-root CLAUDE.md under
a "## Structure & Narrative Flow" section (create the file if it doesn't
exist; if it does, add or update ONLY this section and leave the Style
section and any others untouched). Capture: the final section order with a
one-line rationale per section, the funnel logic (demos → offers → call),
the high-weight scroll moments, and where the conversion lands. Do this only
after I approve, not while it's still a proposal.
```

> With structure guidelines

```
You are my conversion strategist and narrative architect. I want to lock the
STRUCTURE & NARRATIVE FLOW for a single-page scroll site before any build —
sequencing and story only. Do NOT write code and do NOT design visuals or
choose styling; those are separate conversations. (The visual style direction
is already locked — read the "## Style & Design System" section of CLAUDE.md so
the narrative stays coherent with it.)

## Step 0 — Get my inputs first
You need two things from me before proposing anything. Establish both first:

A) PROJECT CONTEXT — the project's purpose, audience, the funnel/conversion it
   must drive, and the feeling the scroll should convey. This is what you
   justify every structural choice against. To find it, in order:
   1. Look for a file named CONTEXT.md in the project root or under docs/, and
      read it if present.
   2. Otherwise, use whatever context I've given inline.
   3. If you still don't have it, ASK me and wait — never blueprint blind, and
      never fabricate a funnel, audience, or goal.
   Also read the "## Style & Design System" section of CLAUDE.md, so the
   high-weight scroll moments you propose line up with the locked visual/motion
   direction rather than fighting it.

B) STRUCTURE INPUT — my explicit structural direction: reference sites (with
   section-order notes on what each does well as you scroll), a section order I
   already have in mind, and/or hard sequencing constraints. This one is
   optional. To find it, in order:
   1. Look for a file named STRUCTURE.md in the project root or under docs/, and
      read it if present — treat it as the source of my structural intent
      (reference sites, desired section order, constraints).
   2. Otherwise, use whatever I've given inline (see the STRUCTURE INPUT block
      below).
   3. If it's still missing, ask whether I have any (reference sites or a
      section order in mind). Only if I confirm I have none, INFER a structure
      from the project context and funnel, and ask targeted clarifying
      questions to close the genuine gaps.

Never assume inputs I haven't given or confirmed. Regardless of source, ask me
clarifying questions whenever the structural intent is ambiguous.

## Step 1 — Interrogate the brief, don't just accept it
Whatever I give you (or we infer together), pressure-test it before blueprinting:
- Name any TENSIONS or CONTRADICTIONS — e.g. references optimized for a
  different goal (self-serve SaaS signup vs. a high-touch consulting call),
  leading with offers vs. earning trust first, or a reference's pacing that
  fights my funnel.
- Name anything UNDERSPECIFIED that must be decided before building (e.g. where
  pricing lands, whether demos precede or follow positioning, single vs.
  repeated CTA, anchor/nav strategy, tolerable scroll length on mobile).
- Where a reference's pattern would work AGAINST my funnel, PUSH BACK with your
  reasoning and a concrete alternative.

## Step 2 — Propose a concrete blueprint
Turn the brief into specifics. Justify EACH choice against the funnel, not "it
flows nicely":
1. NARRATIVE PATTERN the references share — how each uses scroll to move a
   visitor from "who is this" to "I should hire this person," where each turns
   from proof to pitch, and how they earn the ask.
2. RECOMMENDED SECTION ORDER for my site — every section with a one-line reason
   for its placement and the transition into the next. Keep audience/niche-
   specific copy in swappable blocks so a later re-skin doesn't force
   restructuring.
3. The 2–3 HIGH-WEIGHT SCROLL MOMENTS (the emotional beats) that carry the most
   narrative weight, and which sections should stay quiet by contrast. Align
   these with the locked style's signature motion moments where possible.
4. WHERE THE CONVERSION LANDS — the primary ask, how the sections before it set
   it up, and whether/where any secondary CTAs repeat.

## How to decide
- Make DECISIVE recommendations for anything you can reasonably infer — a
  recommendation, not an exhaustive menu.
- Use TARGETED QUESTIONS only for genuine forks that depend on my judgment or
  strategy (e.g. demos-before-offers vs. after, one CTA vs. repeated, whether to
  name prices on the page). Present your recommended option first.

## Guardrails (apply unless my inputs override them)
- Structure and sequencing only — no code, no visual design, and no copywriting
  beyond stating each section's intent. When you need real words/numbers to
  place a section, pull them from CONTENT.md; never invent offers or prices.
- Single-page scroll: the sequence must feel like a story that EARNS the ask,
  not a stack of disconnected sections.
- Respect the funnel and don't reorder it away without flagging why.
- Keep audience-specific blocks swappable so a future niche re-skin doesn't
  require re-architecting.
- Keep it skimmable and accessible: logical heading order, anchor/skip
  navigation, and a scroll length that survives mobile.
- Stay coherent with the locked Style & Design System — don't propose beats the
  visual system can't support.

## After I approve
ONLY once I've approved the blueprint, record it in the project-root CLAUDE.md
under a "## Structure & Narrative Flow" section:
- Create the file if it doesn't exist.
- If it exists, add or update ONLY this section; leave the "## Style & Design
  System" section and all others untouched.
- Capture: the final section order with a one-line rationale per section, the
  funnel logic, the high-weight scroll moments, and where the conversion lands.
Do this only after approval — never while it's still a proposal.

---
STRUCTURE INPUT (optional):
[ Reference sites whose STRUCTURE and NARRATIVE FLOW you want to learn from
  (separate from the style references) — for each, note its section order and
  what it does well as you scroll. And/or a section order you already have in
  mind, plus any hard sequencing constraints. Leave blank if you have none and
  I'll infer. Project context is read automatically from CONTEXT.md (root or
  docs/); structural intent is read automatically from STRUCTURE.md (root or
  docs/) if present. ]
```

3. **Write the build prompt** calling the skill, and end with the clarifying-questions line:

```
/ui-ux-pro-max Build the site for this project to a high production-quality
bar. Single-page scroll unless CLAUDE.md says otherwise.

Before you start, read CLAUDE.md and the docs it points to. Build to what is
recorded there. If anything below conflicts with CLAUDE.md, CLAUDE.md wins.
If a required section is missing from CLAUDE.md (Style & Design System, or
Structure & Narrative Flow), stop and tell me: the build depends on them
being locked first.

SOURCES OF TRUTH (pull everything project-specific from these, not from this
prompt):
- CLAUDE.md: the rules and scaffolding. Style & Design System, Structure &
  Narrative Flow, Positioning & Copy Strategy, and the funnel role of each
  section.
- CONTENT.md: all real words and numbers (offers, prices, tiers, headlines,
  body copy, CTAs, credentials). Read it and pull every concrete value from
  there. Do not invent content or hard-code it from this prompt.
- CONTEXT.md: the why, who, and goal.

TECH STACK: follow the stack recorded in CLAUDE.md. If CLAUDE.md does not
specify one, default to a React app built with Next.js (App Router), Tailwind
CSS, and shadcn/ui, structured to deploy on Vercel. Keep client JS lean:
prefer server components and static rendering, add interactivity only where a
section needs it, and include only the shadcn components you actually use.
Respect the performance budget in CLAUDE.md; if the stack cannot meet it,
flag the conflict before building rather than silently exceeding it.

STRUCTURE & FUNNEL: follow the "## Structure & Narrative Flow" section in
CLAUDE.md for the section order, the funnel logic, the high-weight scroll
moments, and where the conversion lands. Do not restate or reorder the funnel
from this prompt.

POSITIONING: follow the positioning in CLAUDE.md / CONTEXT.md. Keep audience
or niche-specific language in easily swappable blocks so it can be re-skinned
later without restructuring; do not bake it into every section.

DEMOS (placeholder only, never live): if the project has demos of any kind,
present them as a gateway section only. Do NOT build, embed, run, or deploy
any live demo or interactive artifact. Each demo is a block the visitor can
click to reach a dedicated, more detailed section or page for it. The section
keeps its proof role narratively (per CLAUDE.md) but is an entry point, not a
running demo. This holds for any type of demo.

CORE DIFFERENTIATOR: infer it from CONTENT.md and CONTEXT.md and thread it
consistently throughout. Do not invent one here.

COPY: infer the voice and framing from CONTENT.md and match it rather than
imposing a new tone. General guardrails only: outcome-first, plain English,
confident and direct, no hype, no em-dashes in any copy you write. The
no-em-dash rule applies even to copy pulled from CONTENT.md: never add
em-dashes, and if CONTENT.md already contains them, leave that text exactly
as written but notify me of each instance.

STYLE DIRECTIONS:
The visual system is already locked in CLAUDE.md. Before proposing anything,
ask me one question: do I want you to propose 2 or 3 distinct style
directions to choose from, yes or no?
- If NO: build strictly to the locked Style & Design System in CLAUDE.md. Do
  not propose or invent alternative styles.
- If YES: ask a follow-up first, should the proposed directions be grounded
  in the project's locked structure and content (an evolution within the
  existing guidelines), or completely original (not based on any previous
  guidelines)? Then present the 2 or 3 directions for me to pick one, and
  build the chosen one. If I pick an original direction that departs from the
  locked Style system, treat it as superseding that section and flag that
  CLAUDE.md's Style section will need re-recording, but do not edit Style
  without my go-ahead.

Confirm you're following the CLAUDE.md Style + Structure. Then run the STYLE
DIRECTIONS question, flag the demos-placeholder approach if the project has
demos, and ask me anything unclear. Don't write code until I've answered.

Once I've answered and approved the direction, record only the STRATEGIC
SCAFFOLDING in CLAUDE.md under a "## Positioning & Copy Strategy" section (add
or update ONLY this section; leave Style, Structure, and all others
untouched). Capture ONLY durable, high-level decisions: the positioning
strategy and which blocks are swappable for later niching, the core
differentiator, the copy/tone rules, and the funnel role each section plays.
Do NOT store website content in CLAUDE.md (no prices, tiers, CTA wording,
headlines, body copy, or section text); that lives in CONTENT.md. If you need
to reference an offer or the CTA, point to CONTENT.md rather than copying its
text.

Do this only after I approve.
```

v0

```
/ui-ux-pro-max Build a $10k portfolio site for guirau.tech. Its job is to
close new clients in the tech space, so it must read as engineering
credibility and taste — not an art project. Single-page scroll.

Before you start, read CLAUDE.md — the approved Style & Design System and
Structure & Narrative Flow are recorded there. Build to those. If anything
below conflicts with CLAUDE.md, CLAUDE.md wins.

POSITIONING (keep it swappable):
Alejandro Guirau, freelance AI/ML engineer and consultant. Broad
positioning for now: production AI apps, agents, and automations for
businesses of any size or industry. Build the copy and structure so the
positioning/niche can be re-skinned later without restructuring — keep
audience-specific language in easily swappable blocks, not baked into every
section.

CONTENT: all real content — the four productized offers with their prices
and tiers, headlines, body copy, and the CTA wording — lives in CONTENT.md.
Read it and pull every concrete value from there. Do not invent offers,
prices, or CTA text, and do not hard-code them from this prompt; CONTENT.md
is the single source of truth for words and numbers.

THE FUNNEL (demos build trust, offers convert, call closes):
- Hero — lead with the work, not a bio. Open on a hook about building
  production AI, not a résumé line.
- Live ML demos as the centrepiece proof — interactive CLIP image
  classifier and SegFormer + SAM2 segmentation. These prove real, trained,
  deployed ML (not no-code, not prototypes).
- Productized offers as the backbone, shown as a visible price ladder from
  the entry offer up to the flagship (offers and prices from CONTENT.md).
- Credibility strip of past employers (names from CONTENT.md).
- One clear CTA repeated through the page: a free discovery call (exact
  wording from CONTENT.md).
(Exact section order comes from the locked Structure blueprint in CLAUDE.md.)

CORE DIFFERENTIATOR to thread throughout: production-grade engineering —
real trained ML and deployed systems, not prototypes or no-code patchwork.

COPY RULES: outcome-first framing. "Production" as the core differentiator.
Confident, direct, plain English, no hype. No em-dashes. Restrained,
sensory writing over adjective-stacking.

Confirm you're following the CLAUDE.md style + structure, then propose two
or three distinct style directions to choose from and ask me anything
unclear. Don't write code until I've answered.

Once I've answered your questions and approved the direction, record only
the STRATEGIC SCAFFOLDING in CLAUDE.md under a "## Positioning & Copy
Strategy" section (add or update ONLY this section; leave Style and
Structure untouched). Capture ONLY durable, high-level decisions: the
positioning strategy and which blocks are swappable for later niching, the
core differentiator (production-grade engineering), the copy/tone rules,
and the funnel role each section plays.

Do NOT store website CONTENT in CLAUDE.md — no offer prices or tiers, no
CTA wording, no headlines, no body copy, no section text. That all lives in
a separate CONTENT.md that I iterate on. CLAUDE.md holds the rules and
scaffolding; CONTENT.md holds the words. If you need to reference an offer
or the CTA, point to CONTENT.md rather than copying its text in.

Do this only after I approve.
```

Answering these "clarifying questions" thoughtfully is the single most important moment of the build: your answers become the entire site.

## Phase 3 — Generating cinematic assets (Higgsfield)

`Metrics Media`

**Workflow** via ElevenLabs aggregator:
Image in ChatGPT → use it as the starting frame for Veo 3.1 → upscale with Topaz, all in the same tab.

_Tip: ask Claude to write the image-generation prompt, since it already knows your project's aesthetic, so the asset matches on the first try._

`Nick Saraev`

**Workflow** via Higgsfield + Kling 3.0:

1. Hero panning loop: `"Generate me a high-quality 3D render style video of panning through a [scene]. Make the background white. Make the assets super high quality. This should read like something you'd see on a website or a landing page."`
2. Exploding view: `"Generate me a high-quality exploding view animation of a [subject]. No text, white background, it should explode in all directions (vertically and horizontally) and none of it should go outside of the bounds of the video itself."`
3. Settings: Kling 3.0, 5 seconds, 16:9, 1080p. Costs ~7.5 credits per generation (~$0.36). He recommends generating 2–3 at once and picking the best.
4. For tricky subjects (his rotating globe), generate the base still in Nano Banana Pro first, then feed it into Kling as an image-to-video source.

Save outputs into the project folder as e.g. `hero.mp4` and `exploding_view.mp4.`

## Phase 4 — Wiring video into the site

1. **Masked video hero**:

> ``"Take the hero.mp4 and make it the background of our hero header. Center the hero header so it looks really clean, then apply an inward masking gradient so the animation background doesn't interfere with the website background."``

2. **Frame-by-frame scroll section**:

> ``"I have exploding_view.mp4 in downloads. Create a scroll animation immediately underneath the hero header. As I scroll, rifle through two or three sections of text exposing my skills, and show the exploding view frame by frame as we go."``

This produces a "locomotive scroll" sequence. It'll be choppy at first, which leads to the key optimization step.

3. **The performance fix** (the most valuable technical detail in either video):

> ``"It's really laggy, fix up the lag and make it load significantly faster."``

Claude's solution: extract the video frames as optimized, preloaded compressed JPEGs and tie each image to scroll position instead of scrubbing a video element. This is how Apple's product pages work, and it's the difference between janky and silky

## Phase 5 — Polish (professional → expensive)

1. **The batch pass — lead with feeling, not specifics**:

> ``"We need more handcrafted micro-interactions. The lower sections feel a bit generic. We don't need to make them busier, just more expensive."``

Claude is better at translating intent into specifics than you are at writing specs. Metics' build returned five changes at once: site-wide film grain, animated hairlines between sections, a glowing ember effect, word-by-word headline reveals. Batching saves tokens and feels more cohesive than drip-feeding tweaks.

2. **The per-section pass you must drive yourself**. Claude can't feel your site. Scroll through, find flat sections, and give Claude **one cursor interaction or movement per section**, all restrained:

- `"Make the embers move like fire and react to the cursor." → cursor-parallax embers`
- `"Add elegant micro-movements and cursor interactions here, this section feels static."` → a candlelight halo following the cursor
- When the first attempt is too obvious: `"Make it more subtle, more refined."` → trailing motion that lags behind the cursor

3. **The Inter font check**. Inter screams "AI made this." If you see it, tell Claude to swap it. Metics' build replaced Inter with Gist, and chose Francines for display. (Correction to the Gemini doc: those font names are real and quoted from the video, not invented.)
4. **Dedicated mobile pass** — `"Do a dedicated pass on the mobile version. Don't just shrink it; decide what to hide, what to tighten, what to resize."` Phones see your site far more than desktop. Saraev's shortcut: "mobile optimize the site" run 3–4 times.
5. **Copy**. AI over-explains and over-adjectives by default. The Front-End Design skill pushes restrained, sensory writing (Metics' example: "six dishes, one fire"). Restraint is what reads as expensive.
6. **Re-grade against the checklist**. Paste the 8-pillar checklist back into Claude and ask `"Where does this site land against each criterion?"` The 8 pillars are: point of view, typography, color, hierarchy, imagery, motion, mobile, and the invisible "fast and finished" feel — grouped as taste, substance, and felt quality.

## Phase 6 — Deploy

Deploy to Vercel if it's a React project, or GitHub pages if it's a static HTML.

# Upwork Catalog Offers — Content

Shared across all offers:

- **Credibility line:** 7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.
- **Why me / credentials:**
  - HelloFresh — ML & automation for marketing
  - Hewlett Packard Enterprise — Data platforms for enterprise
  - Telefónica — Data engineering for telco
  - Enso (Startup) — AI agents for ecommerce
  - Santander Bank — Cloud & DevOps for banking
  - Masterschool — Data analytics instructor

---

# Offer 1 · AI Strategy Consultation

**From $199 · 3 days — the entry offer**

- **Headline:** Find where AI actually pays off
- **Tagline:** A scored audit & roadmap of your 2-3 best AI opportunities

## What you get — A clear plan ready to start

- A 60-minute free discovery call
- A written **audit** (up to 4 pages)
- Your 2-3 **best AI opportunities**, scored by return on investment
- A **roadmap** and recommended technical approach
- One round of revisions

## How it works — Know what to build before you pay

- **Day 1 — Discovery call:** We map your goals and bottlenecks. We take our time to understand your business and where AI can create the most value.
- **Day 2 — Analysis:** I assess and score your top AI opportunities by effort and financial impact, to find where is the highest return on investment (ROI).
- **Day 3 — Delivery:** Written audit and roadmap, ready to execute. With a recommended technical approach, timeframe, and cost estimates.

## No-risk guarantee — If AI is not the answer, you don't pay

I'll tell you honestly on the call. No upsell. No pressure.

## Why me — Backed by years in production

7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.

## Call to action — Start with a free call

Free, no risk, no commitment.
**CTA:** Book your discovery call · From $199 · 3 days

---

# Offer 2 · n8n Workflow Automation

**From $497 · 5 days**

- **Headline:** Manual work automated in a week
- **Tagline:** An n8n & AI workflow — built, tested, and live

## What you get — A complete n8n workflow, live in production

- A 30-minute free discovery call
- A complete **n8n** workflow (up to ~15 steps), live in production
- AI steps via any major LLM (Claude, OpenAI, Gemini...)
- Connected to your existing apps and tools
- Deployment, documentation, and a handover call
- 14 days of post-launch support

## How it works — Automate your business within a week

- **Days 1–2 — Discovery call:** We map your goals and process. We learn exactly how you work today, so the automation fits your process, not the other way around.
- **Days 3–4 — Build & test:** I build your workflow, and test it end-to-end. You will see it running on real data before it goes live. No surprises.
- **Day 5 — Deploy & hand over:** Live in production and documented. I deploy it, walk you through how it works, and continue supporting you for 14 days.

## Example use cases — What can you automate

- **Lead capture & follow-up:** Every new lead gets a personal reply in seconds, day or night.
- **Customer support:** Tickets read, prioritized, and routed the moment they arrive.
- **Document processing:** Data pulled from invoices and PDFs straight into your systems.
- **Email routing & auto-reply:** Emails sorted, and sent to the right person, or replies drafted automatically.
- **CRM sync & enrichment:** Records always up to date and enriched across all your tools.
- **Reports & alerts:** Reports delivered on schedule, with alerts when it matters.

## Why me — Backed by years in production

7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.

## Call to action — Start with a free call

Free, no risk, no commitment.
**CTA:** Book your discovery call · From $497 · 5 days

---

# Offer 3 · Custom AI Agent

**Three tiers — from $897**

- **Headline:** Agents that do the real work
- **Tagline:** From simple assistant to autonomous multi-step agent

## What you get — A working AI agent, live in production

- Built with **any framework and LLM** (Claude, OpenAI, Gemini...)
- Deployed to **your cloud** (AWS, GCP, Vercel...)
- Full technical and business documentation
- Handed over and ready to run
- At least 14 days of post-launch support

## Pricing — Pick a tier, or we'll decide together on the call

- **Simple Agent — $897 · 7 days:** A fully custom agent for one job, deployed and documented.
- **Knowledge Agent — $1,799 · 14 days (recommended):** RAG assistant trained on your content, with a web UI and evals.
- **Multi-Step Agent — $2,999 · 28 days:** Autonomous agent that runs a full process, connected to your apps.

## How it works — From idea to autonomous agent

- **Step 1 — Discovery call & scope:** We map the job, the goals, and the right scope for your agent. We learn how the work gets done today and design an agent that fits your process and tools.
- **Step 2 — Build & evaluate:** I build and validate your agent against real-world scenarios. We make sure it handles your real use cases perfectly before launch, no guesswork.
- **Step 3 — Deploy & hand over:** Live in your cloud and fully documented. I deploy it, walk you through how it works, and support you for at least 14 days after launch.

## Why me — Backed by years in production

7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.

## Call to action — Start with a free call

Free, no risk, no commitment.
**CTA:** Book your discovery call · From $897 · 3 tiers

---

# Offer 4 · AI App — End-to-End Build

**$8,997 · 5 weeks — the flagship**

- **Headline:** Your AI idea launched in 5 weeks
- **Tagline:** A full-stack AI product — live in your cloud

## What you get — A fully custom AI app, ready for users

- **A complete AI app:** Full-stack AI app running on cloud infrastructure. An app your customers can use from day one, not a prototype.
- **AI that thinks like your business:** Your workflows and knowledge digitalized, answers grounded in your data, and systems that follow your processes.
- **Solid architecture, no over-engineering:** AI agents, custom ML APIs, data pipelines, analytics systems, reporting platforms, workflow automation…
  - A solid **backend** in Python or TypeScript, built to scale and easy to maintain.
  - A modern React **frontend** that will make your product a pleasure to use.
- **Enterprise-grade infrastructure:** AWS, GCP or Vercel with Docker & Kubernetes for scalability, fault-tolerant design, and automated backups. You'll never lose data or stop serving users.
- **Your data stays private:** Your data lives in your own cloud, under your control, never passing through third parties. Compliant setup (GDPR, ISO) available.
- **Nothing depends on me:** Infrastructure-as-code and CI/CD make every setup reproducible, plus full technical docs for any engineer to extend it, and business docs for you to understand it without being technical.
- **30 days of post-launch support:** I stay on after launch to fix issues and make sure everything runs smoothly.

## How it works — From idea to launch in five weeks

- **Week 1 — Discovery sprint:** We set the scope, architecture, and roadmap. We align on exactly what we're building and how, before a line of code is written.
- **Weeks 2–4 — Build:** A full-stack app, with Agentic AI at the core. I bring your vision to life with regular check-ins and a working version to try as we go. AI-native, web, or mobile.
- **Week 5 — Deploy & hand over:** Live on your cloud and fully documented. We launch your product, hand over the keys and documentation, and support you for 30 days after launch.

## Who it's for — Built for people shipping something real

- **Founders testing an idea:** You have the vision and the funding, but no team to build it. Get a **working app** in front of users, to validate or sell.
- **Companies adding AI:** You have a product and want an **AI feature**, but your team is at capacity. I build it end-to-end and hand it over, ready to ship.
- **Teams pitching investors:** You need something that actually works to show investors. A **live app they can use**, not slides or a clickable mockup.

## Why me — Backed by years in production

7+ years shipping cloud-native systems to production across data engineering, machine learning, AI agents, and workflow automation.

## Call to action — Start with a free call

Free, no risk, no commitment.
**CTA:** Book your discovery call · $8,997 · 5 weeks
