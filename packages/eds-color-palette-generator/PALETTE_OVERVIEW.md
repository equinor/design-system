# EDS Color Palette Configuration Overview

_Generated overview of the current palette configuration (light/dark step values, contrast requirements, and reference contrast levels)._

> Generated: 2025-08-25

---

## 1. Color Definitions

| Name       | Hex       |
| ---------- | --------- |
| Moss Green | `#007079` |
| Gray       | `#4A4A4A` |
| Green      | `#3FA13D` |
| Blue       | `#0084C4` |
| Orange     | `#E57E00` |
| Red        | `#E20337` |

---

## 2. Step Definitions

| ID                        | Name                      | Category          | Variant         | Light (L) | Dark (L) | Contrast Reqs |
| ------------------------- | ------------------------- | ----------------- | --------------- | --------- | -------- | ------------- |
| background-default        | Background Default        | background        | default         | 1.00      | 0.15     |               |
| background-subtle         | Background Subtle         | background        | subtle          | 0.96      | 0.25     |               |
| background-medium-default | Background Medium Default | background-medium | medium-default  | 0.88      | 0.45     | Yes           |
| background-medium-hover   | Background Medium Hover   | background-medium | medium-hover    | 0.84      | 0.48     | Yes           |
| background-medium-active  | Background Medium Active  | background-medium | medium-active   | 0.80      | 0.50     | Yes           |
| border-subtle             | Border Subtle             | border            | subtle          | 0.82      | 0.63     | Yes           |
| border-medium             | Border Medium             | border            | medium          | 0.70      | 0.66     | Yes           |
| border-strong             | Border Strong             | border            | strong          | 0.66      | 0.68     | Yes           |
| background-strong-default | Background Strong Default | background-strong | strong-default  | 0.50      | 0.78     | Yes           |
| background-strong-hover   | Background Strong Hover   | background-strong | strong-hover    | 0.44      | 0.85     | Yes           |
| background-strong-active  | Background Strong Active  | background-strong | strong-active   | 0.42      | 0.92     | Yes           |
| text-subtle               | Text Subtle               | text              | subtle          | 0.40      | 0.91     | Yes           |
| text-strong               | Text Strong               | text              | strong          | 0.32      | 0.99     | Yes           |
| text-contrast-subtle      | Text Contrast Subtle      | text              | contrast-subtle | 0.89      | 0.30     | Yes           |
| text-contrast-strong      | Text Contrast Strong      | text              | contrast-strong | 0.99      | 0.10     | Yes           |

---

## 3. Contrast Requirements (Source → Target)

_APCA LC value shown is the required Lightness Contrast. WCAG column shows level key and numeric ratio._

| Source Step               | Target Step               | APCA LC | WCAG Level          |
| ------------------------- | ------------------------- | ------- | ------------------- |
| background-medium-default | background-default        | 15      | UI_COMPONENTS (3.0) |
| background-medium-default | background-subtle         | 15      | UI_COMPONENTS (3.0) |
| background-medium-hover   | background-default        | 15      | UI_COMPONENTS (3.0) |
| background-medium-hover   | background-subtle         | 15      | UI_COMPONENTS (3.0) |
| background-medium-active  | background-default        | 15      | UI_COMPONENTS (3.0) |
| background-medium-active  | background-subtle         | 15      | UI_COMPONENTS (3.0) |
| border-subtle             | background-default        | 15      | UI_COMPONENTS (3.0) |
| border-subtle             | background-subtle         | 15      | UI_COMPONENTS (3.0) |
| border-subtle             | background-medium-default | 15      | UI_COMPONENTS (3.0) |
| border-subtle             | background-medium-hover   | 15      | UI_COMPONENTS (3.0) |
| border-subtle             | background-medium-active  | 15      | UI_COMPONENTS (3.0) |
| border-medium             | background-default        | 15      | UI_COMPONENTS (3.0) |
| border-medium             | background-subtle         | 15      | UI_COMPONENTS (3.0) |
| border-medium             | background-medium-default | 15      | UI_COMPONENTS (3.0) |
| border-medium             | background-medium-hover   | 15      | UI_COMPONENTS (3.0) |
| border-medium             | background-medium-active  | 15      | UI_COMPONENTS (3.0) |
| border-strong             | background-default        | 15      | UI_COMPONENTS (3.0) |
| border-strong             | background-subtle         | 15      | UI_COMPONENTS (3.0) |
| border-strong             | background-medium-default | 15      | UI_COMPONENTS (3.0) |
| border-strong             | background-medium-hover   | 15      | UI_COMPONENTS (3.0) |
| border-strong             | background-medium-active  | 15      | UI_COMPONENTS (3.0) |
| background-strong-default | background-default        | 60      | UI_COMPONENTS (3.0) |
| background-strong-default | background-subtle         | 60      | UI_COMPONENTS (3.0) |
| background-strong-hover   | background-default        | 60      | UI_COMPONENTS (3.0) |
| background-strong-hover   | background-subtle         | 60      | UI_COMPONENTS (3.0) |
| background-strong-active  | background-default        | 60      | UI_COMPONENTS (3.0) |
| background-strong-active  | background-subtle         | 60      | UI_COMPONENTS (3.0) |
| text-subtle               | background-default        | 60      | AA_NORMAL (4.5)     |
| text-subtle               | background-subtle         | 60      | AA_NORMAL (4.5)     |
| text-subtle               | background-medium-default | 60      | AA_NORMAL (4.5)     |
| text-subtle               | background-medium-hover   | 60      | AA_NORMAL (4.5)     |
| text-subtle               | background-medium-active  | 60      | AA_NORMAL (4.5)     |
| text-strong               | background-default        | 90      | AAA_NORMAL (7.0)    |
| text-strong               | background-subtle         | 90      | AAA_NORMAL (7.0)    |
| text-strong               | background-medium-default | 60      | AAA_NORMAL (7.0)    |
| text-strong               | background-medium-hover   | 60      | AAA_NORMAL (7.0)    |
| text-strong               | background-medium-active  | 60      | AAA_NORMAL (7.0)    |
| text-contrast-subtle      | background-strong-default | 60      | AAA_NORMAL (7.0)    |
| text-contrast-subtle      | background-strong-hover   | 60      | AAA_NORMAL (7.0)    |
| text-contrast-subtle      | background-strong-active  | 60      | AAA_NORMAL (7.0)    |
| text-contrast-strong      | background-strong-default | 90      | AAA_NORMAL (7.0)    |
| text-contrast-strong      | background-strong-hover   | 90      | AAA_NORMAL (7.0)    |
| text-contrast-strong      | background-strong-active  | 90      | AAA_NORMAL (7.0)    |

---

## 4. APCA Contrast Levels Reference

| Key   | LC Value | Description (Summary)                            |
| ----- | -------- | ------------------------------------------------ |
| LC_90 | 90       | Preferred for fluent/body text; high readability |
| LC_75 | 75       | Minimum for body text in columns                 |
| LC_60 | 60       | Minimum for content (non-body) text              |
| LC_45 | 45       | Minimum for larger/heavier headlines             |
| LC_30 | 30       | Minimum for spot-readable / placeholder text     |
| LC_15 | 15       | Absolute minimum for non-semantic non-text       |

---

## 5. WCAG Contrast Levels Reference

| Key           | Ratio | Description (Summary)                         |
| ------------- | ----- | --------------------------------------------- |
| AAA_NORMAL    | 7.0   | Enhanced contrast for normal text (AAA)       |
| AAA_LARGE     | 4.5   | Enhanced contrast for large text (AAA)        |
| AA_NORMAL     | 4.5   | Standard minimum for normal text (AA)         |
| AA_LARGE      | 3.0   | Standard minimum for large/bold text (AA)     |
| UI_COMPONENTS | 3.0   | Minimum for UI components & graphical objects |

---

## 6. Observations

- Medium & border steps use LC 15 — borderline differentiation; validate real usage (focus, outlines, subtle dividers).
- Strong backgrounds require LC 60 relative to base backgrounds — aligns with semantic elevation.
- Text tiers follow semantic hierarchy: subtle (LC60), strong (LC90), inverse contrast text over strong backgrounds (LC60 / LC90).
- Contrast expectations are encoded declaratively — good for automated validation.

## 7. Potential Enhancements

| Idea                                                     | Benefit                               |
| -------------------------------------------------------- | ------------------------------------- | --------- | ------------------------------- |
| Generate matrix of actual APCA + WCAG scores per palette | Immediate verification of unmet pairs |
| Add role metadata to steps (e.g. `role: 'surface         | text                                  | border'`) | Easier downstream token mapping |
| Flag unmet contrast pairs during build                   | Prevent regressions                   |
| Provide suggested lightness adjustments when failing     | Guided remediation                    |
| Export machine-readable JSON alongside this doc          | Consumption by other tooling          |

---

_This document is auto-generated; update `config.ts` to change source values._
