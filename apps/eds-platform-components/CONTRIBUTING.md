# Contributing

## Setup

```bash
pnpm install    # From repo root
pnpm dev        # Start dev server
pnpm test       # Run tests
pnpm lint       # Lint code
```

## Guidelines

Follow repo-wide conventions documented in:

- [CLAUDE.md](../../.claude/CLAUDE.md) - Development standards
- [copilot-instructions.md](../../.github/copilot-instructions.md) - Code style

**Key points:**

- Vanilla CSS with BEM + EDS tokens
- Named exports only (except Next.js pages)
- WCAG 2.1 AA accessibility
- Conventional commits: `type(scope): description`

## Architecture

### Shared Logic Pattern

All platform-specific generation logic lives in `src/lib/`:

```typescript
// lib/buttonPropertySchema.ts - Define properties
export const buttonPropertySchema: PropertyDefinition[] = [...]

// lib/generateButtonYaml.ts - Generate YAML
export const generateButtonYaml = (options) => {...}
```

Both web app and CLI scripts import from `lib/` to ensure consistency.

### Adding New Components

1. **Create property schema** in `lib/[component]PropertySchema.ts`
2. **Create generator** in `lib/generate[Component]Yaml.ts`
3. **Build UI** in `src/app/power-apps/[component]/page.tsx`
4. **Update CLI** in `scripts/power-apps/` to use shared lib

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed patterns.

## File Structure

```text
ComponentName/
├── index.ts                 # Exports
├── ComponentName.tsx        # Implementation
├── ComponentName.types.ts   # TypeScript types
├── component-name.css       # BEM styles
└── ComponentName.test.tsx   # Tests
```

## Pull Requests

1. Create branch: `feat/your-feature`
2. Follow conventions above
3. Run `pnpm test && pnpm lint`
4. Commit with conventional commits
5. Create PR

## Resources

- [EDS Storybook](https://storybook.eds.equinor.com/)
- [Power Apps YAML Schema](https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
