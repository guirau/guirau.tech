
# Apple HIG — Web-Relevant Design System

> Extracted from Apple's Human Interface Guidelines, filtered to what is directly useful for building a **website** (app-only and platform-specific guidance omitted).

---

## Core principles (the "why" behind

>every choice)

Apple's design rests on three ideas worth internalizing because they drive concrete decisions:

- **Clarity** — remove ambiguity. Labels say exactly what happens ("Send Payment," not "Submit"). Content leads, chrome recedes.
- **Deference** — the UI serves the content, never competes with it. Generous whitespace, restrained color, minimal decoration.
- **Depth** — layers, translucency, and shadow communicate hierarchy (what's on top vs. foundational).

---

## Typography

One system family carries the entire hierarchy through weight and size — Apple deliberately avoids a second display font.

- **Primary typeface:** SF Pro (system sans). On the web, `-apple-system, BlinkMacSystemFont, "SF Pro", ...` falls back to the native system font. Companion serif is New York; monospace is SF Mono for code.
- **Body floor:** 17px is the legibility baseline for body text. Don't go below ~11px for any text.
- **Type scale** (Apple's reference metrics — adapt to px for web), Large title down to caption:

| Role        | Size        | Weight       |
| ----------- | ----------- | ------------ |
| Large Title | 34px        | Regular/Bold |
| Title 1     | 28px        | Regular      |
| Title 2     | 22px        | Regular      |
| Title 3     | 20px        | Regular      |
| Body        | 17px        | Regular      |
| Callout     | 16px        | Regular      |
| Subhead     | 15px        | Regular      |
| Footnote    | 13px        | Regular      |
| Caption     | 12px / 11px | Regular      |

- **Weight guidance:** Avoid ultralight/thin weights for readable text — use regular, medium, semibold, or bold. Establish hierarchy by *weight and size*, not by adding typefaces.
- **Tracking:** SF tightens letter-spacing at larger sizes (e.g. 17px ≈ −0.43px tracking, 28px ≈ −0.8px). Larger display text gets slightly negative tracking.
- **Limit typefaces** — too many faces harms hierarchy and reads as poorly designed.

---

## Color

Apple's system is **semantic, not literal** — colors are named roles that adapt to light/dark mode automatically. Build your CSS the same way: define role-based custom properties (`--label`, `--background`, `--accent`) with light/dark values, rather than hardcoding hex everywhere.

**Rules that matter:**

- **Reserve color for action.** Limit your accent color to interactive elements (links, buttons, switches). This trains users that "colored = clickable."
- **One primary accent.** systemBlue is the canonical single accent. Don't scatter multiple accent hues.
- **Never use the same color for different meanings.** Primary actions blue, destructive actions red, kept visually distinct from secondary/disabled states.
- **Color never carries meaning alone** — always pair with a label, icon, or shape (accessibility + colorblind users).

**Semantic roles to define** (each needs a light + dark value):

- Text: `label`, `secondaryLabel`, `tertiaryLabel` (primary → de-emphasized hierarchy)
- Backgrounds: `systemBackground`, `secondarySystemBackground` (layering)
- Accents: `systemBlue` (primary), `systemRed` (destructive), plus the named ramp (green, orange, yellow, teal, indigo, purple, pink) and `systemGray`–`systemGray6`.

> ⚠️ **On hex values:** Apple deliberately does *not* publish guaranteed hex codes — rendered color depends on the environment (light/dark/contrast). The widely circulated `#007AFF` for systemBlue is *community-measured, not official*, and shifts between OS versions. Use it as a starting reference, but architect around the role name. Community-measured values are available at sites like mar.codes/apple-colors if you need concrete starting points for both modes.

---

## Layout & spacing

- **8pt grid.** Space and size elements in multiples of 8 (with 4px subdivisions for fine adjustments). This is convention, not a hard Apple mandate, but it's what produces the "Apple rhythm."
- **Whitespace is an active tool.** Use generous, consistent padding/margins to *group* related elements and *separate* sections. Let the main content be the star.
- **Adaptive/responsive by default.** Layouts must reflow cleanly across screen sizes while preserving visual hierarchy — directly maps to responsive web design.
- **Minimum tap/click target: 44×44px.** Applies to every interactive element including icon-only buttons and secondary actions. Critical for touch/mobile web.

---

## Materials (Liquid Glass)

Apple's 2025 material system (WWDC25) — a **translucent layer that floats above and gives way to content**, reflecting/refracting its surroundings. On the web this translates to:

- `backdrop-filter: blur(...)` with semi-transparent backgrounds for sticky headers, nav bars, sidebars, cards, and overlays.
- Use translucency + layering + shadow to signal what's elevated (a modal) vs. foundational (the page).
- Keep it purposeful — materials clarify hierarchy, they're not decoration.

---

## Iconography

- Line icons that **optically match your text weight** — the coherence between icon weight and font weight is central to the Apple look. SF Symbols is the native library; for web, choose/configure an icon set whose stroke weight aligns with your type. Avoid mismatched icon weights.

---

## Accessibility (non-negotiable in Apple's system)

- Text contrast **4.5:1** for normal text, **3:1** for large text.
- Support user text-size scaling (don't lock font sizes in fixed px that can't scale — use relative units where possible).
- Respect **`prefers-reduced-motion`** — no forced animations.
- Every interactive element needs an accessible label (icon-only buttons especially).
- Full light **and** dark mode support via semantic colors (`prefers-color-scheme`).

---

## The one-paragraph version

Content-first, calm UI where chrome recedes. One type family (SF Pro, 17px body floor) with hierarchy from weight and size. Semantic, role-based color where the accent (systemBlue) is reserved almost entirely for interactive elements. 8px spacing grid with generous whitespace, 44px minimum click targets, translucent "Liquid Glass" surfaces (`backdrop-filter`) layered over content, and line icons matched to text weight — all fully adaptive across screen sizes and both color schemes.

---

*Source: [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)*
