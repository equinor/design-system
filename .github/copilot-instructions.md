# GitHub Copilot Instructions for Equinor Design System

## Overview

Equinor Design System (EDS) is a monorepo with component libraries and design tokens implementing Equinor's design language.

## Packages

- **`@equinor/eds-core-react`** - Main React component library (most development happens here)
- **`@equinor/eds-tokens`** - Design tokens, CSS variables, and theming
- **`@equinor/eds-icons`** - Icon library
- **`@equinor/eds-lab-react`** - Experimental/WIP components
- **`@equinor/eds-data-grid-react`** - Data grid component

## Guidelines

- [Global standards](./instructions/global-coding.instructions.md) - Accessibility, naming, exports
- [TypeScript](./instructions/ts.instructions.md) - Type patterns and testing
- [React](./instructions/react.instructions.md) - Components, hooks, file structure
- [Styling](./instructions/styling.instructions.md) - CSS, BEM, responsive design
- [Figma](./instructions/figma.instructions.md) - Design-to-code workflow
- [Markdown](./instructions/markdown.instructions.md) - Documentation format

For color systems: See `packages/eds-tokens/instructions/colors.md`
