---
title: Develop
hide_title: true
---

import Prerequisites from '@site/src/components/Prerequisites';

## Develop

Welcome to building with EDS! Get production-ready React components, full TypeScript support, and everything you need to create consistent, accessible applications.

**Prerequisites:** <Prerequisites minimal />  
**Time to get started:** 10-15 minutes

## Getting Started

Install the core React components:

```bash
npm install @equinor/eds-core-react
# or
yarn add @equinor/eds-core-react
```

Import and use components in your React application:

```tsx
import { Button, Typography } from '@equinor/eds-core-react'

function App() {
  return (
    <div>
      <Typography variant="h1">Welcome to EDS</Typography>
      <Button variant="contained">Get Started</Button>
    </div>
  )
}
```

For consistent styling, install and use design tokens:

```bash
npm install @equinor/eds-tokens
```

```javascript
import { tokens } from '@equinor/eds-tokens'

const { typography, colors } = tokens

const styles = {
  fontSize: typography.heading.h1.fontSize,
  color: colors.interactive.primary__resting.rgba,
}
```

## Key Features

**TypeScript support:** Full autocomplete, type checking, and inline documentation included.

**Accessibility built-in:** Every component follows WCAG 2.1 AA standards with semantic HTML structure, keyboard navigation, proper colour contrast, and screen reader compatibility.

**Complete documentation:** Each component includes prop definitions, TypeScript types, interactive examples, and accessibility considerations.

## Common Issues

**TypeScript errors:** Check import paths and ensure TypeScript version is <Prerequisites />  
**Build issues:** Verify peer dependencies match requirements  
**Runtime problems:** Confirm styled-components version compatibility

Need help? Visit our [Support page](../../../support/support.md) for GitHub repository, community discussions, and office hours.
