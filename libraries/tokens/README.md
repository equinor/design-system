# @equinor/eds-tokens

Design tokens used in Equinor Design System (EDS).

## Documentation

### Base

Generic tokens used across EDS, such as colours, typography, spacings etc…

#### Tokens

- Clickbounds
- Colors
- Elevation
- Shape
- Spacing
- States
- Typography (`ot`, `woff` or `woff2` font required)

### Components

Component specific tokens, such as button, input, table etc. These tokens can be used to implement a component in your own technology if needed whilst upholding consistency with design.

#### Update december 2019

The component tokens already made are still part of this package, but we encourage users to use base tokens for now – it proved to be too time consuming at this stage to create every token first in json and then in React. We might revisit the initial strategy at a later point.

#### Tokens

- Button
- Table

### Usage

#### Use as ESM Module

Add `"type":"module"` to your apps `package.json`

```javascript
import { tokens } from "@equinor/eds-tokens"
```

#### Use as CommonJS Module

CommonJS will have a separate package path

```javascript
import { tokens } from "@equinor/eds-tokens/commonjs"
```

#### React storybook example

```js
import React from 'react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

const { h1: h1Tokens } = tokens.typography.heading

const H1 = styled.h1(h1Tokens)

export default {
  title: 'Tokens|Example',
  component: H1,
}

export const TokensExample = () => (
  <div>
    <H1>Some header</H1>
  </div>
)

```

[design tokens]: https://css-tricks.com/what-are-design-tokens/
