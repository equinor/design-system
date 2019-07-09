# @equinor/eds-core-react

The React implementation of the Equinor Design System, still in early alpha so by no means ready for production.

## Installation

```sh
npm install @equinor/eds-core-react@alpha
npm install styled-components
```

## Usage

```jsx
import React from 'react'
import { render } from 'react-dom'
import { Button } from '@equinor/eds-core-react'

const App = () => (
  <>
    <h1>Buttons</h1>

    <h2>Contained (default)</h2>

    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>

    <h2>Outlined</h2>

    <Button variant="outlined">Primary</Button>
    <Button variant="outlined" color="secondary">Secondary</Button>
    <Button variant="outlined" color="danger">Danger</Button>
    <Button variant="outlined" disabled>Disabled</Button>

    <h2>Ghost</h2>

    <Button variant="ghost">Primary</Button>
    <Button variant="ghost" color="secondary">Secondary</Button>
    <Button variant="ghost" color="danger">Danger</Button>
    <Button variant="ghost" disabled>Disabled</Button>
  </>
)

render(<App />, document.getElementById('root'))
```
