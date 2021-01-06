# @equinor/eds-core-react

Available components to help style your React application as an Equinor application. We publish new components regularly so make sure to check back often!

Make sure to check out our [Storybook](https://eds-storybook-react.azurewebsites.net/) for more examples!
Read the [changelog](https://github.com/equinor/design-system/blob/develop/libraries/core-react/CHANGELOG.md) for details on specific releases.

## Installation
Make sure you have Typescript v3.8 or newer

```sh
npm install @equinor/eds-core-react styled-components
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

### Available ✅

- Accordion
- Banner
- Breadcrumbs
- Button
- Cards
- Chips
- Dialog
- Divider
- Icon
- List
- Menu
- Pagination
- Popover
- Progress indicators
- Scrim
- Search
- Select (Native Select)
- Single Select
- Multi Select
- Selection Controls
- Side Sheet
- Slider
- Snackbar
- Table
- Table of contents
- Tabs
- TextField
- Tooltip
- TopBar
- Typography

### In progress 👷‍♀️

- Navigation Drawer

### TODO 🛠️

- App launcher
- Stepper

