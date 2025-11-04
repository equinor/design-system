# EDS Documentation Website

This documentation website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. It provides comprehensive documentation, guidelines, and resources for the Equinor Design System.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** -- Version 16.15 or compatible
* **pnpm** — Version 10.15.0 or higher (install globally with `npm install -g pnpm`)

## Important Note

This documentation site is part of the EDS monorepo. All commands should be run from the **root directory** of the monorepo, not from this directory.

If you haven't already, start by setting up the monorepo:

```bash
# Navigate to the root directory
cd ../..

# Install dependencies and build packages
pnpm run init
```

## Available Commands

Run these commands from the **root directory** of the monorepo:

### Local Development

```bash
pnpm docu:start
```

This command starts a local development server at `http://localhost:3000` and opens your browser. Most changes are reflected live without needing to restart the server.

### Build

```bash
pnpm docu:build
```

This command extracts prerequisites and generates static content into the `build` directory. You can serve this content using any static hosting service.

### Serve Built Site

```bash
pnpm docu:serve
```

Use this command to preview the production build locally before deploying.

### Clear Cache

```bash
pnpm docu:clear
```

If you encounter issues, clear the Docusaurus cache with this command.

### Extract Prerequisites

```bash
pnpm docu:prerequisites
```

This command extracts prerequisite information from package files. It runs automatically during the build process.

### Lint

```bash
pnpm lint:docs
```

Run ESLint to check for code quality issues in the documentation site.

## Project Structure

The documentation site includes:

* **docs/** — Documentation content in Markdown and MDX format
* **blog/** — Blog posts and updates
* **src/** — Custom React components and pages
* **static/** — Static assets like images and files
* **docusaurus.config.ts** — Docusaurus configuration

## Writing Documentation

When adding or updating documentation:

1. Create or edit Markdown/MDX files in the `docs/` directory
2. Use clear headings and structure for easy navigation
3. Test your changes locally with `pnpm docu:start`
4. Ensure all links work correctly

## Writing Tone Guides

When creating content for the documentation site, choose the appropriate tone guide:

* [Friendly Professional](./docs/tone-guide/friendly-professional.md) — Default for most documentation
* [Friendly Minimalist Blend](./docs/tone-guide/friendly-minimalist-blend.md) — Concise but approachable
* [Minimalist](./docs/tone-guide/minimalist.md) — Essential information only

## Technology Stack

The documentation site uses:

* **Docusaurus** — Static site generator
* **React** — UI framework
* **TypeScript** — Type-safe JavaScript
* **MDX** — Markdown with React components
* **EDS Tokens & Components** — Equinor Design System packages

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, either stop the conflicting process or Docusaurus will automatically use the next available port.

### Build Fails

Try clearing the cache, rebuilding and then restarting:

```bash
pnpm docu:clear
pnpm docu:build
pnpm docu:start
```

### Module Not Found Errors

Ensure all dependencies are installed by running from the root:

```bash
pnpm install
```

## Contributing

When contributing to the documentation:

1. Follow the [contribution guidelines](../../README.md#contributions)
2. Use the appropriate [tone guide](#writing-tone-guides) for your content
3. Test locally before submitting a pull request
4. Ensure all links and images work correctly

## Need Help?

* Check the main [project README](../../README.md) for more information about the monorepo
* Visit the [Docusaurus documentation](https://docusaurus.io/docs) for site-specific questions
* Join the conversation on Slack: [#eds-design-system](https://equinor.slack.com/archives/CJT20H1B9)
