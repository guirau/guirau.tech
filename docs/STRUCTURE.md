
# STRUCTURE.md — Scroll-Driven Showcase Funnel

> A structural + funnel teardown of a single-page, scroll-driven marketing site pattern used by high-end design studios to showcase capability.
>
> **Important framing:** This pattern powers a *creative showcase* rather than a straightforward commerce site. The surface "product" is often a vehicle — the real product being sold is the **studio's design and engineering capability**, and the real conversion goal is **getting brands to hire the studio**. The funnel is therefore a *demonstration funnel*, not a commerce funnel. Understanding this dual layer is the whole point.

---

## 1. General Structure

### 1.1 Format & mechanics

- **Single-page application (SPA)**, one continuous vertical scroll — no multi-page navigation.
- **Scroll-driven narrative:** each section is a discrete "scene" revealed on scroll ("Scroll to continue" prompt).
- **Anchor-based nav** with a few jump points, not separate routes:
  - `#hero` (Intro)
  - `#features` (Features)
  - `#testimonies` (Product / proof)
  - `#contact` (Contact)
- **Fixed/overlay nav** with Menu / Close toggle; persistent general-enquiries email.
- **Mobile-first, locked viewport** (`maximum-scale=1.0, user-scalable=no`) — a controlled, app-like cinematic experience.
- **Dark theme** (`theme-color: #000000`), heavy on 3D/video/interactive canvas (a hero 3D asset).

### 1.2 Tech/experience signals

- Interactive set-pieces: hoverable 3D model, hand/cursor interactions, animated demos, data/temperature visualizations, a fake in-context chat.
- Rich media: hero video with PLAY control, WebP imagery throughout, downloadable supporting files (e.g. a research paper, model files on GitHub).
- Parody or homage framing borrowed from AI/ML culture (open-weight model, GPU references, OOM, temperature sampling, BibTeX citation).

---

## 2. Section-by-Section Structure

| #  | Section                  | Anchor           | Role                                |
| -- | ------------------------ | ---------------- | ----------------------------------- |
| 1  | Hero                     | `#hero`        | Hook + tagline + studio credibility |
| 2  | Product reveal video     | —               | Emotional/visual pull               |
| 3  | "Powered by AI*" premise | `#features`    | Core narrative premise              |
| 4  | Feature demos            | `#features`    | Interactive proof-of-craft          |
| 5  | Spec/benefit blocks      | `#features`    | Product benefits                    |
| 6  | Testimonials & Reviews   | `#testimonies` | Social proof                        |
| 7  | Social content grid      | —               | Culture/meme reinforcement          |
| 8  | Product tiers            | —               | "Choose your model" selection       |
| 9  | Comparison table         | —               | Spec sheet                          |
| 10 | Research paper section   | —               | Academic-style credibility          |
| 11 | The Reveal / CTA         | `#contact`     | **Real conversion moment**    |
| 12 | Footer                   | `#contact`     | Contact, social, legal              |

---

## 3. The Funnel Structure

The pattern runs **two funnels simultaneously**. The surface funnel (selling the showcased "product") is a vehicle for the real funnel (selling the studio).

### 3.1 Surface funnel — the "product" (showcase)

**Stage 1 — Hook / Attention (Hero)**

- A short, punchy, benefit-led tagline.
- A one-line value proposition describing what the product does.
- Immediate credibility anchor: "Designed by [studio], the award-winning design studio."
- Self-aware positioning line that creates intrigue.

**Stage 2 — Interest (Product reveal + premise)**

- Hero video with PLAY.
- The twist: the product "isn't just a [product]. It's the result of unprecedented AI\* breakthroughs."
- Introduces a named "model" — the running premise that carries the whole page.

**Stage 3 — Desire (Feature demos + benefits)**
Interactive, benefit-framed set-pieces, each a mini-demo of craft:

- Portability
- Precision / performance
- Thermal or technical stability
- Sustainability / circularity
- A "smart"/encryption demo
- Grip / anti-slip / durability
- Materials / eco angle
  Each pairs a mock-technical claim with a visual/interactive payoff.

**Stage 4 — Trust (Social proof)**

- Ratings block (e.g. 4.9/5, hundreds of reviews).
- Character testimonials — comedic or persona-driven, but structurally doing the "reviews" job.
- Social content grid (edge/on-device, always-on, GPU, drop-tested) — meme-format credibility.

**Stage 5 — Consideration / Product selection**

- Three tiers: **Standard / Pro / Pro Max** (or equivalent good-better-best).
- Full comparison table (spec rows, connectivity, updates, best for).
- Mimics a real e-commerce "choose your model" decision step.

**Stage 6 — Deepened credibility (Research parody)**

- A "SOTA open-weight model" framing with Paper, Model, and Code links (often a real GitHub repo).
- Abstract, Acknowledgements, Peer Review, BibTeX — full academic pastiche.

### 3.2 Real funnel — the studio pitch

This is where the two funnels converge. The surface product funnel deliberately builds to a **rug-pull reveal** that reframes everything as a capability demo:

**The Reveal (CTA section, `#contact`):**

> *"We caught your attention with a non-existent product. If we can sell [a simple product], imagine what we can do for your brand."* → link to the studio site.

- This single line converts the entire preceding experience into a **portfolio argument**. Every impressive interaction retroactively becomes evidence of what the studio can build for a paying client.
- A disclaimer (the site is a fictional creative project; the product doesn't exist) both protects legally and reinforces the cleverness.

**Conversion actions (Footer / Contact):**

- New Business email.
- General Enquiries email.
- Newsletter subscribe (lead capture).
- Share / Copy URL (viral loop — the site *is* the ad).
- Social: X, Instagram, LinkedIn.
- Legal: Terms, Privacy.

---

## 4. Funnel Logic — Why It Works

1. **Curiosity-first, not product-first.** The hook is intrigue, not a feature list. Attention is the actual product being sold.
2. **The joke is the demo.** Every satirical "AI feature" is secretly a technical flex (3D, interactivity, motion, WebGL). The medium proves the message.
3. **Borrowed structure creates familiarity.** It faithfully copies a real DTC product-launch funnel (hero → features → reviews → tiers → spec sheet), so the parody lands and the craft reads as "production-grade."
4. **Delayed reveal maximizes impact.** The studio pitch only arrives *after* you're impressed, so the CTA feels earned rather than salesy.
5. **The site is its own top-of-funnel.** Built-in sharing + memeable content means the artifact markets the studio by being passed around — the funnel's awareness stage is the internet itself.

---

## 5. Reusable Skeleton

```
[Hook: intrigue-led tagline + instant credibility anchor]
        ↓
[Reveal the premise / twist that makes you unique]
        ↓
[Interactive feature demos — each proves a real capability]
        ↓
[Social proof — reviews, ratings, culture signals]
        ↓
[Product/offer selection — tiers + comparison]
        ↓
[Deepened credibility — docs, data, proof-of-rigor]
        ↓
[THE REVEAL — reframe everything toward the real CTA]
        ↓
[Conversion + viral loop — contact, subscribe, share]
```
