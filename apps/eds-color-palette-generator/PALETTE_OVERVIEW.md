# EDS Color Palette Configuration Overview

_Generated overview of the current palette configuration (step values, contrast requirements, and reference contrast levels)._

Generated: 2025-11-24

## Step Definitions

| ID | Name | Category | Variant | Light (L) | Dark (L) |
| --- | ---- | -------- | ------- | --------- | -------- |
| bg-canvas | Background Canvas | Background | undefined | 0.97 | 0.15 |
| bg-surface | Background Surface | Background | surface | 1.00 | 0.25 |
| bg-fill-muted-default | Background Fill Muted Default | Background Fill Muted | default | 0.91 | 0.47 |
| bg-fill-muted-hover | Background Fill Muted Hover | Background Fill Muted | hover | 0.87 | 0.52 |
| bg-fill-muted-active | Background Fill Muted Active | Background Fill Muted | active | 0.82 | 0.58 |
| border-subtle | Border Subtle | Border | subtle | 0.87 | 0.47 |
| border-medium | Border Medium | Border | medium | 0.75 | 0.61 |
| border-strong | Border Strong | Border | strong | 0.52 | 0.76 |
| bg-fill-emphasis-default | Background Fill Emphasis Default | Background Fill Emphasis | default | 0.50 | 0.82 |
| bg-fill-emphasis-hover | Background Fill Emphasis Hover | Background Fill Emphasis | hover | 0.44 | 0.88 |
| bg-fill-emphasis-active | Background Fill Emphasis Active | Background Fill Emphasis | active | 0.42 | 0.93 |
| text-subtle | Text Subtle | Text | subtle | 0.46 | 0.91 |
| text-strong | Text Strong | Text | strong | 0.23 | 0.99 |
| text-subtle-on-emphasis | Text Subtle on Emphasis | Text | subtle-on-emphasis | 0.90 | 0.33 |
| text-strong-on-emphasis | Text Strong on Emphasis | Text | strong-on-emphasis | 1.00 | 0.10 |

## Contrast Requirements (Foreground → Background)

_APCA LC value shown is the required Lightness Contrast. WCAG column shows level key and numeric ratio._

| Foreground | Background | APCA | WCAG |
| --------------- | --------------- | ------- | ----------- |
| bg-fill-muted-default | bg-surface | 15 | AA_LARGE (3) |
| bg-fill-muted-hover | bg-surface | 15 | AA_LARGE (3) |
| bg-fill-muted-active | bg-surface | 15 | AA_LARGE (3) |
| border-subtle | bg-canvas | 15 | AA_LARGE (3) |
| border-subtle | bg-surface | 15 | AA_LARGE (3) |
| border-medium | bg-canvas | 30 | AA_LARGE (3) |
| border-medium | bg-surface | 30 | AA_LARGE (3) |
| border-medium | bg-fill-muted-default | 15 | AA_LARGE (3) |
| border-strong | bg-canvas | 30 | AA_LARGE (3) |
| border-strong | bg-surface | 30 | AA_LARGE (3) |
| border-strong | bg-fill-muted-default | 30 | AA_LARGE (3) |
| border-strong | bg-fill-muted-hover | 30 | AA_LARGE (3) |
| border-strong | border-medium | 15 | AA_LARGE (3) |
| bg-fill-emphasis-default | bg-canvas | 30 | AA_LARGE (3) |
| bg-fill-emphasis-default | bg-surface | 30 | AA_LARGE (3) |
| bg-fill-emphasis-hover | bg-canvas | 30 | AA_LARGE (3) |
| bg-fill-emphasis-hover | bg-surface | 30 | AA_LARGE (3) |
| bg-fill-emphasis-active | bg-canvas | 30 | AA_LARGE (3) |
| bg-fill-emphasis-active | bg-surface | 30 | AA_LARGE (3) |
| text-subtle | bg-canvas | 60 | AAA_LARGE (4.5) |
| text-subtle | bg-surface | 60 | AAA_LARGE (4.5) |
| text-subtle | bg-fill-muted-default | 60 | AAA_LARGE (4.5) |
| text-strong | bg-canvas | 90 | AAA_NORMAL (7) |
| text-strong | bg-surface | 90 | AAA_NORMAL (7) |
| text-strong | bg-fill-muted-default | 60 | AAA_LARGE (4.5) |
| text-subtle-on-emphasis | bg-fill-emphasis-default | 60 | AAA_LARGE (4.5) |
| text-subtle-on-emphasis | bg-fill-emphasis-hover | 60 | AAA_LARGE (4.5) |
| text-subtle-on-emphasis | bg-fill-emphasis-active | 60 | AAA_LARGE (4.5) |
| text-strong-on-emphasis | bg-fill-emphasis-default | 60 | AAA_NORMAL (7) |
| text-strong-on-emphasis | bg-fill-emphasis-hover | 60 | AAA_NORMAL (7) |
| text-strong-on-emphasis | bg-fill-emphasis-active | 60 | AAA_NORMAL (7) |

## APCA Contrast Levels Reference

| Key | LC Value | Description |
| --- | -------- | ----------- |
| LC_90 | 90 | Preferred for fluent/body text. |
| LC_75 | 75 | Minimum for body text. |
| LC_60 | 60 | Minimum for content text that is not body/column/block text. |
| LC_45 | 45 | Minimum for large/heavy fluent text and detailed icons. |
| LC_30 | 30 | Absolute minimum for spot-readable text and large, simple UI graphics. |
| LC_15 | 15 | Absolute minimum for decorative or structural non-text elements. |

## WCAG Contrast Levels Reference

| Key | Ratio | Description |
| --- | ----- | ----------- |
| AAA_LARGE | 4.5 | Contrast for large text. |
| AAA_NORMAL | 7 | Contrast for normal text. |
| AA_LARGE | 3 | Contrast for large text. |
| AA_NORMAL | 4.5 | Contrast for normal text |
| UI_COMPONENTS | 3 | Contrast for UI components and graphical objects. |

---

_This document is auto-generated; update `config.ts` to change source values._
