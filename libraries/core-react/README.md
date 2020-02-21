# @equinor/eds-core-react

Available componenets to help style your React application as an Equinor application. We publish new components regularly so make sure to check back often!

Make sure to check out our [Storybook](https://eds-storybook-react.azurewebsites.net/) for more examples!

## Installation

```sh
npm install @equinor/eds-core-react
```

## Components

### Available ✅
  - Button
    - Contained
    - Outlined
    - Ghost
    - Ghost Icon
  - Divider
  - Table
  - Typography
  - TextField
  - List
  - TopBar
  - Icon

### TODO 🛠️
  - Button
    - Contained w/icon left/right 
    - Outlined w/icon left/right
    - Ghost w/icon left/right
  - Accordian
  - Cards
  - Progress indicators
  - Popover
  - Chips
  - Menu
  - App launcher
  - Breadcrumbs
  - Table of contents
  - Navigation drawer
  - Pagination
  - Dialog
  - Banner
  - Snackbar
  - Scrim
  - Search
  - Selection Controls
  - Side Sheet
  - Slider
  - Stepper
  - Tooltip



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
