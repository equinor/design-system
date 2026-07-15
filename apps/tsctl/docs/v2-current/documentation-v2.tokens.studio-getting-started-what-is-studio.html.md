<!-- source: https://documentation-v2.tokens.studio/getting-started/what-is-studio.html -->

# What is Studio? [​](#what-is-studio)

Studio is a collaborative platform for managing design tokens — the building blocks of your design system. It serves as your workspace's single source of truth, connecting design decisions in tools like Figma with your codebase.

![Project dashboard interface](/images/getting-started/project-dashboard-light.png)![Project dashboard interface](/images/getting-started/project-dashboard-dark.png)

## Why Studio? [​](#why-studio)

Design systems break down when design decisions live in multiple places. A color gets updated in Figma but not in code. A spacing value changes in the codebase but the designer doesn't know. Studio solves this by giving your entire team one place to manage, review, and ship design token changes.

## Core Concepts [​](#core-concepts)

### Design Tokens [​](#design-tokens)

Design tokens are the smallest pieces of your design system — colors, spacing, typography, shadows, and more. In Studio, tokens follow the [Design Tokens Community Group (DTCG)](https://www.designtokens.org/) specification, making them interoperable across tools and platforms.

### Token Sets [​](#token-sets)

Token sets are collections of related tokens. You might organize them by category (colors, typography) or by component (button, card). Token sets help you keep things structured as your system grows.

### Branches [​](#branches)

Just like Git, Studio uses branches to let you work on changes in isolation. Create a branch, make your token updates, then merge when you're ready. Your team can review changes before they go live.

### Themes [​](#themes)

Themes let you create variations of your tokens — like light mode and dark mode, or different brand palettes. Studio supports multi-dimensional theming, so you can combine theme axes (e.g., brand × mode × density).

### Releases [​](#releases)

When your tokens are ready to ship, create a release. Releases snapshot your tokens at a point in time and can trigger CI/CD pipelines to push changes to your codebase automatically.

## How It All Fits Together [​](#how-it-all-fits-together)

![Studio workflow: Figma syncs with Studio, which connects to your codebase and CI/CD pipeline](/images/diagrams/studio-workflow-light.svg)![Studio workflow: Figma syncs with Studio, which connects to your codebase and CI/CD pipeline](/images/diagrams/studio-workflow-dark.svg)

1.  **Design** — Your designers work in Figma, using variables and styles that sync with Studio
2.  **Manage** — Your team manages tokens in Studio, using branches for changes and reviews for approval
3.  **Ship** — When tokens are released, webhooks and CI triggers push the changes to your code repositories
4.  **Build** — Your build tools (Style Dictionary, etc.) transform tokens into platform-specific code

## What's New in This Version [​](#what-s-new-in-this-version)

Studio has been rebuilt from the ground up with:

-   **Event sourcing** — Every change is recorded, giving you a complete audit trail
-   **Real-time collaboration** — See changes from your team as they happen
-   **Improved Figma sync** — Bi-directional sync for both variables and styles
-   **CI/CD integrations** — Direct GitHub Actions and GitLab CI triggers with OIDC authentication
-   **Branch reviews** — Code review-style approval workflows for token changes

## Next Steps [​](#next-steps)

-   [Create your account](./create-your-account.html) and set up your first workspace
-   [Create your first project](./your-first-project.html) and start managing tokens
-   [Follow the Quick Start guide](./quick-start.html) for a hands-on walkthrough