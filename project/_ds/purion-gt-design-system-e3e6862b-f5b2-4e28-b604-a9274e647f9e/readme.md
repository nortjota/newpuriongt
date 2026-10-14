# PURION GT — Design System

PURION GT is a Brazilian **premium automotive perfume** (perfume automotivo) — launch 16/06/2026, Instagram @purionbrasil. Audience: men 25–45 into cars and men's fragrance. Positioning: premium-discreet (think Jo Malone / Aesop / Byredo), not aftermarket "aromatizante". The product is a single clear-glass cylindrical bottle (pale ice-blue liquid, brushed-steel cap) with the black PURION wordmark and an italic "GT".

The **visual language** borrows from editorial sport landing pages the brand supplied as references (tennis/padel club sites): mega condensed grotesk headlines that bleed off-canvas, ghost-and-ink two-tone type, frosted glass stat capsules floating on full-bleed photography, 28px rounded photo cards, ghosted marquee bands, underlined "CTA ↗" links and one sharp sport-lime accent. Motion takes cues from the requested animation reference (mojunsh.com — not fetchable from here; motion spec is written from the brief): masked line reveals, slow image zooms, smooth parallax, infinite tickers.

## Sources
- `uploads/Logo da purion.png` → `assets/logo-mark.png` (the capsule "O" mark only)
- `uploads/Gemini_Generated_Image_tm2zxmtm2zxmtm2z.png` → `assets/product-bottle.png` (transparent cutout)
- `uploads/00569f57-…png` → `assets/hero-street.png` (golden-hour lifestyle: bottle, white SUV, limestone facade)
- Style references (third-party, **not** shipped as assets): `uploads/f88ad13d….jpg` (Tenista tennis landing), `uploads/1353e1b3….jpg` (Elan tennis gear), `uploads/ae81f302….jpg` (Padel Social Club)
- Animation reference: https://mojunsh.com/ (could not be loaded)
- No codebase, Figma, or production site was provided — components and UI kit are an authored proposal.

## Index
- `styles.css` — entry point (imports only) → `tokens/` fonts, colors, typography, spacing, effects, motion, base
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Motion, Brand)
- `components/` — React primitives (below), one `@dsCard` per folder
- `ui_kits/store/` — PURION GT storefront: Home, Produto, Sacola drawer
- `assets/` — logo-mark.png, product-bottle.png, hero-street.png
- `thumbnail.html`, `SKILL.md`

## Components
- **actions/** — Button, IconButton, ArrowLink, Icon
- **forms/** — Input, Select, Checkbox, Radio, Switch, Stepper
- **display/** — Card, GlassStat, Badge, Tag, Marquee, RevealText
- **navigation/** — Tabs
- **feedback/** — Dialog, Toast, Tooltip

### Intentional additions
No source component inventory existed, so a standard set was authored. Beyond it:
- **Icon** — wraps Lucide (CDN) as a currentColor mask so every glyph is consistent.
- **ArrowLink** — the "RESERVE A COURT ↗" text-CTA from the references.
- **GlassStat** — frosted stat capsule over photography (references' "18K+ / 4.8" cards).
- **Marquee**, **RevealText** — the two signature motion patterns.
- **Stepper** — quantity selection for the store.

---

## CONTENT FUNDAMENTALS
- **Language:** Brazilian Portuguese. Sentence case for body and headlines; UPPERCASE only for small caps labels, ArrowLinks and marquees.
- **Voice:** premium-discreet, sensorial, confident. Short declaratives. Speaks to **você** (informal "you"), brand never says "eu"; "nós" sparingly.
- **Length:** headlines 2–5 words, often split in two tones ("Discreto na entrada, *presente na memória.*"). Body ≤ 2 sentences. Captions max 4 short phrases.
- **Do:** concrete sensory nouns (bergamota, cedro, couro claro, pedra molhada), moments (saída de garagem, volta para casa), numbers set in mono (100 ml, 30d, 16.06).
- **Don't:** emoji, "!!", generic superlatives ("o melhor", "incrível", "revolucionário"), aftermarket vocabulary ("cheirinho", "aromatizante" as self-description), hype urgency.
- **CTAs:** verb-first, ≤ 3 words: "Comprar agora", "Garantir o meu", "Entre na lista", "Ver sacola".
- **Examples:** "Cheiro de chegada." · "Seu carro é extensão de você. A fragrância também deveria ser." · "Primeiro lote em 16 de junho. Quem está na lista recebe o link antes."

## VISUAL FOUNDATIONS
- **Color:** monochrome base — Ink (#0B0C0E, wordmark black) on Paper (#F7F6F2, warm limestone). Ice (liquid) and Sun (golden-hour reflections) are secondary tints for product tiles and warm accents. **Signal lime #D6FF3D** is the sport accent: one use per view (a CTA, a dot, one word). Steel greys carry ghosted text.
- **Type:** Archivo variable (display, `wdth` 88 condensed, weight 500, tracking −0.045 to −0.065em, line-height .84–.9) for everything large; `wdth` 125 for wide caps labels echoing the wide wordmark. Geist for text (15/1.5). Geist Mono for prices, volumes, counters. Two-tone headlines: first clause in steel-300, second in ink.
- **Spacing:** 4px base; generous sections (`--section-y` 80–180px fluid), fluid gutter 16–28px. Full-bleed sections are inset 10px from the viewport with 28px radius ("framed bleed").
- **Backgrounds:** full-bleed photography (hero, CTA), flat paper, flat ink for dark sections. No gradients except protection scrims. No patterns or textures.
- **Imagery:** warm golden-hour, natural light, glossy reflections on wet stone, shallow depth of field. Product on ice-blue tiles as a cutout. Never cold/blue-filtered, never grainy.
- **Protection:** bottom scrim (`--scrim-bottom`) under card text; top scrim under header on hero. Glass capsules for floating stats/labels.
- **Glass & blur:** `rgba(255,255,255,.14)` + 1px `rgba(255,255,255,.28)` border + inset highlight + blur(18px). Only over photography. Frosted paper header (blur 16) once scrolled.
- **Corner radii:** 6 (checkbox) · 12 (thumbs) · 20 (glass, tiles) · 28 (cards, sections) · 40 (feature tile) · pill for every control. Nothing sharp.
- **Cards:** media cards = photo + scrim + text bottom-left, no border/shadow. Plain cards = white on paper, 1px hairline, no shadow, big "#01" eyebrow.
- **Borders:** hairlines at 8%/18% ink; 14% white on dark. Dividers are 1px rules, often with a label + rule + action row ("O RITUAL ———— Arraste para ver →").
- **Shadows:** mostly flat. Shadow only on floating layers (drawers, toasts, tilted product tile).
- **Animation:** ease-out expo `cubic-bezier(.16,1,.3,1)`. Signature: headline lines rise from overflow masks (1100ms, 70ms stagger); hero image scales 1.12→1 on load and parallaxes at 0.25×; media cards zoom to 1.06 on hover over 1100ms; marquees loop at 38s linear; content fades up 24px. Respect `prefers-reduced-motion`. No bounces.
- **Hover:** buttons darken (ink-700) / lime deepens; arrows nudge ↗ 2–3px; ArrowLink underline retracts to 35%; IconButtons scale 1.06; images zoom slowly.
- **Press:** scale(.97) on buttons. Focus: 4px ice-400 ring.
- **Layout:** fixed header (transparent over hero → frosted paper). Centered wordmark header with links left, cart right. Sticky product gallery. Horizontal snap rails for cards.

## ICONOGRAPHY
- No icon set was supplied. **Substitution: Lucide** (outline, 2px stroke, rounded caps) via `lucide-static@0.460.0` CDN, rendered by the `Icon` component as a currentColor mask.
- Key glyphs: `arrow-up-right` (the brand CTA arrow), `arrow-right`, `chevron-left/right`, `menu`, `x`, `plus/minus`, `shopping-bag`, `truck`, `rotate-ccw`, `droplet`, `trash-2`, `play`, `info`.
- Icons are small and quiet (14–20px) — type and photography carry the page. No emoji. Unicode used only for "·" separators and "×" in installment copy.
- Logo: `assets/logo-mark.png` is the capsule "O" only (light grey on transparent; use `filter:brightness(0)` on light grounds). **The full PURION wordmark was not provided as a file** — in UI it is set in plain type ("PURION GT", Archivo wdth 125) next to the mark. Do not redraw the wordmark.

## Fonts
Webfonts are **Google Fonts substitutes** loaded via `@import` in `tokens/fonts.css`: Archivo (display, variable width), Geist (text), Geist Mono. The real wordmark face is unknown; send brand font files to replace.
