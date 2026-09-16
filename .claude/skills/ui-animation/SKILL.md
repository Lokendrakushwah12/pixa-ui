---
name: ui-animation
description: Apply the house animation rules to pixa ui components — the seven practical tips from emilkowal.ski/ui/7-practical-animation-tips, mapped onto this repo's tokens and primitives. Use when adding or reviewing any transition, popup, hover or press animation in packages/ui or apps/www.
---

# UI animation

Seven rules, adapted from [Emil Kowalski's practical animation
tips](https://emilkowal.ski/ui/7-practical-animation-tips) to this codebase.
They are cheap to apply and each one is checkable, so treat them as a
checklist rather than advice.

The order matters: 1, 4 and 6 are the ones that make an interface feel
different. 2, 5 and 7 are polish that compounds. 3 is specific to tooltips.

## The tokens

Use these rather than inventing values. Durations live in Tailwind classes;
the fluid set also has spring tiers in `packages/ui/src/fluid/lib/springs.ts`.

| Intent | Value |
|---|---|
| Press feedback | `active:scale-[0.97]` |
| Enter / exit (default) | `duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]` |
| Small or instant-feeling | `duration-100` … `duration-160` |
| Never exceed | `300ms` |
| Framer springs | `spring.fast` (80ms), `spring.moderate` (160ms), `spring.slow` (240ms) |
| Blur bridge | `blur(2px)` |

`cubic-bezier(0.23,1,0.32,1)` is the house ease-out. Prefer it over bare
`ease-out`; never use `ease-in` or `ease-in-out` for something entering or
leaving the screen.

## 1. Scale on press

Every control the user clicks should acknowledge it.

```css
active:scale-[0.97]
```

Apply to buttons, menu items, toggles, tabs, cards that act as links.
Exception: controls that already have a geometric press response — the fluid
button collapses its surface inset by 1px instead, which reads as a press
without a transform. Do not stack both.

## 2. Never animate from `scale(0)`

An element growing from nothing has no weight. Start at **0.9 or higher**.

```
initial={{ opacity: 0, scale: 0.95 }}   // good
initial={{ opacity: 0, scale: 0.6 }}    // too far — reads as a zoom
```

Higher start = gentler motion. 0.95–0.97 for popups, 0.9 floor.

## 3. Don't delay subsequent tooltips

First tooltip waits, so a cursor crossing the UI doesn't spray tooltips.
Once one is open, the next is immediate — no delay and no transition.

Base UI gives you this: the popup carries `data-instant` when it should skip.

```
transition-[transform,opacity] duration-125 ease-out
data-instant:transition-none
```

This repo already wires `data-instant` in 69 files; match that pattern
rather than adding your own delay bookkeeping.

## 4. Choose the easing deliberately

`ease-out` for anything entering or exiting — fast start, settles slowly.
That is what makes a UI feel like it responded instantly.

- Entering / exiting → house ease-out `cubic-bezier(0.23,1,0.32,1)`
- Continuous / looping → `linear`
- Two-way moves where both ends matter → `ease-in-out`, sparingly
- `ease-in` → never, for UI

## 5. Make popups origin-aware

A dropdown should grow from its trigger, not the middle of itself. Base UI
exposes the origin; use it.

```
origin-(--transform-origin)
```

Every `Positioner` → `Popup` pair needs this on the popup. Piixa's
`MenuPopup` already does it — copy that.

## 6. Keep it under 300ms

Anything a user sees dozens of times a day must be quick or it becomes
friction. 180ms feels responsive; 400ms feels like waiting.

- Popups, menus, tooltips: 100–200ms
- Larger surfaces (sheets, dialogs): up to 240ms
- Over 300ms: only for something seen once, like a first-load reveal

If an animation is repeated constantly and adds nothing, delete it.

## 7. Blur as a last resort

When two states won't tween cleanly, `filter: blur(2px)` at the midpoint
blends them and the eye reads continuous motion. Use it to rescue a
transition, not as a default.

## Checking a change

Run these against the repo; each maps to a rule above.

```bash
# 6 — anything too slow
grep -rhoE "duration-[0-9]{3,4}" packages/ui/src apps/www | sort -u

# 4 — easings that should probably be ease-out
grep -rn "ease-in-out\|ease-in\b" packages/ui/src apps/www/components

# 2 — starts that are too small
grep -rnE "scale: 0\.[0-8]|scale-\[0\.[0-8]" packages/ui/src apps/www

# 5 — popups missing an origin
grep -rn "Popup" packages/ui/src/components | grep -v "transform-origin"

# 1 — controls with no press feedback
grep -rln "active:scale" packages/ui/src/components
```

Reduced motion is not optional: anything spring- or transform-driven needs a
`useReducedMotion()` guard or a `motion-reduce:` variant. The fluid
components already take a `reduceMotion` path — follow it.
