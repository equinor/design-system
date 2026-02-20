# EDS Token Pipeline — A Complete Guide

## What is this?

The EDS (Equinor Design System) token pipeline turns **design decisions in Figma** into **code that developers use** — CSS variables, TypeScript objects, JSON files, and more.

This guide walks through every layer of that pipeline so you understand exactly how it works.

---

## The Big Picture

```
Figma (design tool)
    │
    ▼
eds-tokens-sync         ← Pulls variables from Figma via API
    │
    ▼
JSON token files        ← Raw design data stored locally
    │
    ▼
eds-tokens-build        ← Transforms tokens using Style Dictionary
    │
    ▼
CSS / JS / TS / JSON    ← Multiple output formats
    │
    ▼
eds-tokens              ← Published npm package consumers import
```

---

## The Three Packages

### 1. `eds-tokens-sync` — The Figma Bridge

**Location:** `packages/eds-tokens-sync/`

This package has one job: talk to Figma. It can:

- **Pull** variables from Figma → save as local JSON files
- **Push** local JSON files → update Figma variables

It needs a `PERSONAL_ACCESS_TOKEN` (Figma API key) to work.

**Think of it as:** A translator between Figma's world and our codebase.

---

### 2. `eds-tokens-build` — The Factory

**Location:** `packages/eds-tokens-build/`

This is where the real transformation happens. It contains:

- **Generate scripts** — Create intermediate token files from config + raw data
- **Build scripts** — Turn token JSON into CSS/JS/TS/JSON using Style Dictionary
- **Custom transforms** — Special rules like converting `px` to `rem`, or creating CSS `light-dark()` functions
- **Custom formats** — Like the `typescriptNestedFormat` that outputs nice nested TypeScript objects

**Think of it as:** A factory that takes raw materials (JSON) and produces finished goods (CSS, TS, etc).

---

### 3. `eds-tokens` — The Storefront

**Location:** `packages/eds-tokens/`

This is what developers actually install (`@equinor/eds-tokens`). It:

- Orchestrates the full build pipeline (calls sync and build scripts)
- Contains the source token JSON files
- Publishes the final outputs to npm
- Exposes multiple entry points: CSS, JS, TS, JSON

**Think of it as:** The shop where consumers pick up the finished product.

---

## How They Connect

```
eds-tokens (orchestrator)
    ├── uses eds-tokens-sync   to fetch from Figma
    ├── uses eds-tokens-build  to generate & transform tokens
    └── publishes the result   as an npm package
```

Both `eds-tokens-sync` and `eds-tokens-build` are **devDependencies** of `eds-tokens`. They're tools used during the build, not shipped to consumers.

---

## Guide Contents

| File | Topic |
|------|-------|
| `00-intro.md` | This file — overview of the three packages |
| `01-figma-sync.md` | How tokens get from Figma into JSON files |
| `02-token-structure.md` | What the JSON files look like and the color hierarchy |
| `03-style-dictionary-build.md` | How JSON becomes CSS/JS/TS |
| `04-full-pipeline.md` | What `pnpm run build:variables` does step by step |

---

## Key Locations to Remember

```
packages/
├── eds-tokens/                  ← The main package
│   ├── tokens/                  ← Raw JSON from Figma (grouped by file key)
│   ├── build/                   ← Generated outputs (CSS, JS, TS, JSON)
│   ├── src/                     ← Source code + legacy token exports
│   ├── token-config.json        ← Master config for token generation
│   └── package.json             ← All the build scripts
│
├── eds-tokens-build/            ← Build tools
│   └── src/
│       ├── scripts/             ← Generate + build CLI scripts
│       ├── transform/           ← Custom Style Dictionary transforms
│       └── format/              ← Custom output formats
│
└── eds-tokens-sync/             ← Figma API integration
    ├── src/
    │   ├── api/                 ← Figma REST client
    │   └── scripts/             ← Sync CLI scripts
    └── bin/                     ← CLI entry points + .env location
```

---

**Start reading:** [01-figma-sync.md](./01-figma-sync.md) — How tokens get from Figma into JSON files.
