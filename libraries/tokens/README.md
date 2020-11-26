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
- Interaction states
- Typography (`ot`, `woff` or `woff2` font required)

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
