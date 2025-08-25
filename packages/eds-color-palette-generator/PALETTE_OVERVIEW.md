# EDS Color Palette Configuration Overview

_Generated overview of the current palette configuration (step values, contrast requirements, and reference contrast levels)._

Generated: 2025-08-25

## Step Definitions

| ID | Name | Category | Variant | Light (L) | Dark (L) |
| --- | ---- | -------- | ------- | --------- | -------- |
| background-default | Background Default | background | default | 1.00 | 0.15 |
| background-subtle | Background Subtle | background | subtle | 0.96 | 0.25 |
| background-medium-default | Background Medium Default | background-medium | medium-default | 0.88 | 0.45 |
| background-medium-hover | Background Medium Hover | background-medium | medium-hover | 0.84 | 0.48 |
| background-medium-active | Background Medium Active | background-medium | medium-active | 0.80 | 0.50 |
| border-subtle | Border Subtle | border | subtle | 0.82 | 0.63 |
| border-medium | Border Medium | border | medium | 0.70 | 0.66 |
| border-strong | Border Strong | border | strong | 0.66 | 0.68 |
| background-strong-default | Background Strong Default | background-strong | strong-default | 0.50 | 0.78 |
| background-strong-hover | Background Strong Hover | background-strong | strong-hover | 0.44 | 0.85 |
| background-strong-active | Background Strong Active | background-strong | strong-active | 0.42 | 0.92 |
| text-subtle | Text Subtle | text | subtle | 0.40 | 0.91 |
| text-strong | Text Strong | text | strong | 0.32 | 0.99 |
| text-contrast-subtle | Text Contrast Subtle | text | contrast-subtle | 0.89 | 0.30 |
| text-contrast-strong | Text Contrast Strong | text | contrast-strong | 0.99 | 0.10 |

## Contrast Requirements (Foreground → Background)

_APCA LC value shown is the required Lightness Contrast. WCAG column shows level key and numeric ratio._

| Foreground | Background | APCA | WCAG |
| --------------- | --------------- | ------- | ----------- |
| background-medium-default | background-default | 15 | AA_LARGE (3) |
| background-medium-default | background-subtle | 15 | AA_LARGE (3) |
| background-medium-hover | background-default | 15 | AA_LARGE (3) |
| background-medium-hover | background-subtle | 15 | AA_LARGE (3) |
| background-medium-active | background-default | 15 | AA_LARGE (3) |
| background-medium-active | background-subtle | 15 | AA_LARGE (3) |
| border-subtle | background-default | 15 | AA_LARGE (3) |
| border-subtle | background-subtle | 15 | AA_LARGE (3) |
| border-subtle | background-medium-default | 15 | AA_LARGE (3) |
| border-subtle | background-medium-hover | 15 | AA_LARGE (3) |
| border-subtle | background-medium-active | 15 | AA_LARGE (3) |
| border-medium | background-default | 15 | AA_LARGE (3) |
| border-medium | background-subtle | 15 | AA_LARGE (3) |
| border-medium | background-medium-default | 15 | AA_LARGE (3) |
| border-medium | background-medium-hover | 15 | AA_LARGE (3) |
| border-medium | background-medium-active | 15 | AA_LARGE (3) |
| border-strong | background-default | 15 | AA_LARGE (3) |
| border-strong | background-subtle | 15 | AA_LARGE (3) |
| border-strong | background-medium-default | 15 | AA_LARGE (3) |
| border-strong | background-medium-hover | 15 | AA_LARGE (3) |
| border-strong | background-medium-active | 15 | AA_LARGE (3) |
| background-strong-default | background-default | 60 | AA_LARGE (3) |
| background-strong-default | background-subtle | 60 | AA_LARGE (3) |
| background-strong-hover | background-default | 60 | AA_LARGE (3) |
| background-strong-hover | background-subtle | 60 | AA_LARGE (3) |
| background-strong-active | background-default | 60 | AA_LARGE (3) |
| background-strong-active | background-subtle | 60 | AA_LARGE (3) |
| text-subtle | background-default | 60 | AAA_LARGE (4.5) |
| text-subtle | background-subtle | 60 | AAA_LARGE (4.5) |
| text-subtle | background-medium-default | 60 | AAA_LARGE (4.5) |
| text-subtle | background-medium-hover | 60 | AAA_LARGE (4.5) |
| text-subtle | background-medium-active | 60 | AAA_LARGE (4.5) |
| text-strong | background-default | 90 | AAA_NORMAL (7) |
| text-strong | background-subtle | 90 | AAA_NORMAL (7) |
| text-strong | background-medium-default | 60 | AAA_NORMAL (7) |
| text-strong | background-medium-hover | 60 | AAA_NORMAL (7) |
| text-strong | background-medium-active | 60 | AAA_NORMAL (7) |
| text-contrast-subtle | background-strong-default | 60 | AAA_NORMAL (7) |
| text-contrast-subtle | background-strong-hover | 60 | AAA_NORMAL (7) |
| text-contrast-subtle | background-strong-active | 60 | AAA_NORMAL (7) |
| text-contrast-strong | background-strong-default | 90 | AAA_NORMAL (7) |
| text-contrast-strong | background-strong-hover | 90 | AAA_NORMAL (7) |
| text-contrast-strong | background-strong-active | 90 | AAA_NORMAL (7) |

## APCA Contrast Levels Reference

| Key | LC Value | Description |
| --- | -------- | ----------- |
| LC_90 | 90 | Preferred level for fluent text and body text |
| LC_75 | 75 | Minimum level for body text in columns |
| LC_60 | 60 | Minimum for content text that is not body or block text |
| LC_45 | 45 | Minimum for larger, heavier text such as headlines |
| LC_30 | 30 | Absolute minimum for spot-readable text |
| LC_15 | 15 | Absolute minimum for non-semantic non-text elements |

## WCAG Contrast Levels Reference

| Key | Ratio | Description |
| --- | ----- | ----------- |
| AAA_LARGE | 4.5 | Enhanced contrast for large text (Level AAA) |
| AAA_NORMAL | 7 | Enhanced contrast for normal text (Level AAA) |
| AA_LARGE | 3 | Standard contrast for large text (Level AA) |
| AA_NORMAL | 4.5 | Standard contrast for normal text (Level AA) |
| UI_COMPONENTS | 3 | Contrast for UI components and graphical objects |

---

_This document is auto-generated; update `config.ts` to change source values._
