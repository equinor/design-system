# @equinor/eds-core-react

Available components to help style your React application as an Equinor application. We publish new components regularly so make sure to check back often!

Make sure to check out our [Storybook](https://eds-storybook-react.azurewebsites.net/) for more examples!
Read the [changelog](https://github.com/equinor/design-system/blob/develop/libraries/core-react/CHANGELOG.md) for details on specific releases.

## Installation

```sh
npm install @equinor/eds-core-react styled-components
```

## Components

### Available ✅

- Accordion
- Button
  - Contained
  - Outlined
  - Ghost
  - Ghost Icon
- Cards
- Chips
- Dialog
- Divider
- Icon
- List
- Scrim
- Search
- Side Sheet
- Table
- Table of contents
- Tabs
- TextField
- TopBar
- Typography
- Tooltip

### In progress 👷‍♀️

- Menu
- Navigation drawer
- Slider
- Popover

### TODO 🛠️

- App launcher
- Banner
- Breadcrumbs
- Button
  - Contained w/icon left/right
  - Outlined w/icon left/right
  - Ghost w/icon left/right
- Pagination
- Progress indicators
- Selection Controls
- Snackbar
- Stepper

## Usage

```jsx
import React from 'react'
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
