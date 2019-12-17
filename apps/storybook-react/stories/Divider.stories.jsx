import React from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Divider, Typography } from '@equinor/eds-core-react'

export default {
  title: 'Components|Divider',
  component: Divider,
}

const VARIANT = {
  SMALL: 'small',
  MEDIUM: 'medium',
}

const COLOR = {
  BRIGHT: 'bright',
  LIGHT: 'light',
  MEDIUM: 'medium',
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
`

export const allDividers = () => (
  <Wrapper>
    <Typography variant="h1" bold>
      All Divider variants
    </Typography>

    <Typography variant="h2" bold>
      Small
    </Typography>
    <Typography variant="h3">Default</Typography>
    <Divider variant="small" />
    <Typography variant="h3">Bright</Typography>
    <Divider color="bright" variant="small" />
    <Typography variant="h3">Light</Typography>
    <Divider color="light" variant="small" />
    <Typography variant="h3">Medium</Typography>
    <Divider color="medium" variant="small" />

    <Typography variant="h2" bold>
      Medium
    </Typography>
    <Typography variant="h3">Default</Typography>
    <Divider variant="medium" />
    <Typography variant="h3">Bright</Typography>
    <Divider color="bright" variant="medium" />
    <Typography variant="h3">Light</Typography>
    <Divider color="light" variant="medium" />
    <Typography variant="h3">Medium</Typography>
    <Divider color="medium" variant="medium" />
  </Wrapper>
)

export const Small = () => (
  <Wrapper>
    <Typography variant="h1" bold>
      Small
    </Typography>
    <Typography variant="h2">Default</Typography>
    <Divider variant="small" />
    <Typography variant="h2">Bright</Typography>
    <Divider color="bright" variant="small" />
    <Typography variant="h2">Light</Typography>
    <Divider color="light" variant="small" />
    <Typography variant="h2">Medium</Typography>
    <Divider color="medium" variant="small" />
  </Wrapper>
)

export const Medium = () => (
  <Wrapper>
    <Typography variant="h1" bold>
      Medium
    </Typography>
    <Typography variant="h2">Default</Typography>
    <Divider variant="medium" />
    <Typography variant="h2">Bright</Typography>
    <Divider color="bright" variant="medium" />
    <Typography variant="h2">Light</Typography>
    <Divider color="light" variant="medium" />
    <Typography variant="h2">Medium</Typography>
    <Divider color="medium" variant="medium" />
  </Wrapper>
)

export const knobs = () => (
  <Wrapper>
    <Typography variant="h1" bold>
      With knobs
    </Typography>
    <Typography variant="body_long">Some Text</Typography>
    <Divider
      color={select('Color', [...Object.values(COLOR)], COLOR.MEDIUM)}
      variant={select('Variant', [...Object.values(VARIANT)], VARIANT.MEDIUM)}
    />
    <Typography variant="body_long">Some more Text</Typography>
  </Wrapper>
)

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
