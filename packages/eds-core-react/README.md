# @equinor/eds-core-react

React implementation of the Equinor Design System (EDS). Use it to build applications that follow the EDS guidelines and stay up to date with the latest components.

Make sure to check out our [Storybook](https://storybook.eds.equinor.com/) for more examples!
Read the [changelog](https://github.com/equinor/design-system/blob/main/packages/eds-core-react/CHANGELOG.md) for details on specific releases.

## Installation

### Stable Release (Recommended)

```bash
npm install @equinor/eds-core-react styled-components 
```

```typescript
import { Button, Typography } from '@equinor/eds-core-react'
```

### Beta Release (EDS 2.0)

⚠️ **Experimental** – For testing and feedback only. Not production-ready.

```bash
npm install @equinor/eds-core-react@beta
```

```typescript
import { Button, Typography } from '@equinor/eds-core-react/next'
```

**Learn more:**
- [Complete Beta Release Guide](../../documentation/how-to/BETA_RELEASE_GUIDE.md)
- [Preview EDS 2.0 components in Storybook](https://storybook.eds.equinor.com)

### Additional Setup

If you use TypeScript, make sure you have TypeScript >= 3.8 as a devDependency:

```bash
npm install typescript --save-dev
```

Install the design tokens and styled-components runtime to get the required styles:

```bash
npm install @equinor/eds-core-react @equinor/eds-tokens styled-components
```

### Fonts

 The Equinor typeface is not included and needs to be added to the head of your project. Its available from the EDS CDN:

```html
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css" />
```

### Required Stylesheets

EDS Core React components require css variables (colors, spacing and typography).

```css
@import '@equinor/eds-tokens/css/variables';
```


## Usage

```jsx
import * as React from 'react'
import { render } from 'react-dom'
import { Button, Typography } from '@equinor/eds-core-react'

const App = () => (
  <>
    <Typography variant="h1" bold>Buttons</Typography>

    <Typography variant="h2">Contained (default)</Typography>

    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>

    <Typography variant="h2">Outlined</Typography>

    <Button variant="outlined">Primary</Button>
    <Button variant="outlined" color="secondary">Secondary</Button>
    <Button variant="outlined" color="danger">Danger</Button>
    <Button variant="outlined" disabled>Disabled</Button>

    <Typography variant="h2">Ghost</Typography>

    <Button variant="ghost">Primary</Button>
    <Button variant="ghost" color="secondary">Secondary</Button>
    <Button variant="ghost" color="danger">Danger</Button>
    <Button variant="ghost" disabled>Disabled</Button>
  </>
)

render(<App />, document.getElementById('root'))
```


## Components

- Accordion
- Autocomplete
- Avatar
- Banner
- Breadcrumbs
- Button
  - ButtonGroup
  - ToggleButton
- Card
- Checkbox
- Chip
- Dialog
- Divider
- EdsProvider
- Icon
- Input
- Label
- List
- Menu
- Native Select
- Pagination
- Paper
- Popover
- Progress
  - Circular
  - Dots
  - Linear
  - Star
- Radio
- Scrim
- Search
- SideBar
- Side Sheet
- Slider
- Snackbar
- Switch
- Table
- Table of contents
- Tabs
- TextArea
- TextField
- Tooltip
- TopBar
- Typography

## Documentation

- **Storybook**: https://storybook.eds.equinor.com
- **Design System Docs**: https://eds.equinor.com
- **Contributing**: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Changelogs

- **Stable**: [CHANGELOG.md](./CHANGELOG.md)
- **Beta**: [CHANGELOG.md](./src/components/next/CHANGELOG.md)

## Package Structure

```
@equinor/eds-core-react
├── /                    # Stable components (EDS 1.0)
└── /next                # Beta components (EDS 2.0)
```
