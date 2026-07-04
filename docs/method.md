# The Method

> Building an animated website with Claude + Higgsfield

## Phase 1 — Setup and skills

1. Install design skills

`Metrics Media`

- **Front-End Design (by Anthropic)** — runs in the background, bans overused fonts, pushes bolder layouts, and improves copywriting
- **UI/UX Pro Max (community)** — 57 UI styles, 95 color palettes, 56 font pairings. You call this one directly when you want a big design intervention

`Nick Saraev`

- Leon Lin's **taste-skill** ([github.com/Leonxlnx/taste-skill](github.com/Leonxlnx/taste-skill))

2. Turn on auto mode

## Phase 2 — The brief and first build

1. **Gather 3–5 references**. Screenshots of sites you like from Dribbble, Awwwards, or a Pinterest search. You're not copying; you're showing Claude your taste, which is easier than describing it in words.

2. **Write the build prompt** calling the skill, and end with the clarifying-questions line:

>```/ui-ux-pro-max Build a website worth $10k for [project]. It should include elegant animations that load well on any device. Ask me any clarifying questions you need before building.```

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

>```"Take the hero.mp4 and make it the background of our hero header. Center the hero header so it looks really clean, then apply an inward masking gradient so the animation background doesn't interfere with the website background."```

2. **Frame-by-frame scroll section**:

>```"I have exploding_view.mp4 in downloads. Create a scroll animation immediately underneath the hero header. As I scroll, rifle through two or three sections of text exposing my skills, and show the exploding view frame by frame as we go."```

This produces a "locomotive scroll" sequence. It'll be choppy at first, which leads to the key optimization step.

3. **The performance fix** (the most valuable technical detail in either video):

>```"It's really laggy, fix up the lag and make it load significantly faster."```

Claude's solution: extract the video frames as optimized, preloaded compressed JPEGs and tie each image to scroll position instead of scrubbing a video element. This is how Apple's product pages work, and it's the difference between janky and silky

## Phase 5 — Polish (professional → expensive)

1. **The batch pass — lead with feeling, not specifics**:

>```"We need more handcrafted micro-interactions. The lower sections feel a bit generic. We don't need to make them busier, just more expensive."```

Claude is better at translating intent into specifics than you are at writing specs. Metics' build returned five changes at once: site-wide film grain, animated hairlines between sections, a glowing ember effect, word-by-word headline reveals. Batching saves tokens and feels more cohesive than drip-feeding tweaks.

2. **The per-section pass you must drive yourself**. Claude can't feel your site. Scroll through, find flat sections, and give Claude **one cursor interaction or movement per section**, all restrained:

- `"Make the embers move like fire and react to the cursor." → cursor-parallax embers`
- `"Add elegant micro-movements and cursor interactions here, this section feels static."` → a candlelight halo following the cursor
- When the first attempt is too obvious: `"Make it more subtle, more refined."` → trailing motion that lags behind the cursor

3. **The Inter font check**. Inter screams "AI made this." If you see it, tell Claude to swap it. Metics' build replaced Inter with Gist, and chose Francines for display. (Correction to the Gemini doc: those font names are real and quoted from the video, not invented.)

4. **Dedicated mobile pass** — `"Do a dedicated pass on the mobile version. Don't just shrink it; decide what to hide, what to tighten, what to resize."` Phones see your site far more than desktop. Saraev's shortcut: "mobile optimize the site" run 3–4 times.

5. **Copy**. AI over-explains and over-adjectives by default. The Front-End Design skill pushes restrained, sensory writing (Metics' example: "six dishes, one fire"). Restraint is what reads as expensive.

14. **Re-grade against the checklist**. Paste the 8-pillar checklist back into Claude and ask `"Where does this site land against each criterion?"` The 8 pillars are: point of view, typography, color, hierarchy, imagery, motion, mobile, and the invisible "fast and finished" feel — grouped as taste, substance, and felt quality.

## Phase 6 — Deploy

Deploy to Vercel if it's a React project, or GitHub pages if it's a static HTML.
