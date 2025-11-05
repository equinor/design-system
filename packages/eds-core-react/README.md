# @equinor/eds-core-react

Available components to help style your React application as an Equinor application. We publish new components regularly so make sure to check back often!

Make sure to check out our [Storybook](https://storybook.eds.equinor.com/) for more examples!
Read the [changelog](https://github.com/equinor/design-system/blob/main/packages/eds-core-react/CHANGELOG.md) for details on specific releases.

## Installation

```sh
npm install @equinor/eds-core-react @equinor/eds-tokens styled-components 
```
If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

### Fonts

 The Equinor typeface is not included and needs to be added to the head of your project. Its available from the EDS CDN:

```html
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/equinor-font.css" />
```

### Required Stylesheets

EDS Core React components require css variables and foundation styles for typography and spacing. Import both stylesheets from `@equinor/eds-tokens`:

```css
@import '@equinor/eds-tokens/css/variables';
@import '@equinor/eds-tokens/css/foundation';
```

**Why both?**
- **Variables CSS** (`/css/variables`) provides all design tokens (colors, spacing, typography variables)
- **Foundation CSS** (`/css/foundation`) provides typography and spacing utility classes used in our components.

For more information about the typography system, see the [Typography component documentation](./src/components/Typography/README.md).

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
