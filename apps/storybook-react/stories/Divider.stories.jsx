import React from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Divider, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__medium: { hex: darkBg },
    },
  },
} = tokens

export default {
  title: 'Components|Divider',
  component: Divider,
}

const VARIANT = {
  SMALL: 'small',
  MEDIUM: 'medium',
}

const COLOR = {
  LIGHTER: 'lighter',
  LIGHT: 'light',
  MEDIUM: 'medium',
}

const Wrapper = styled.div`
  margin: 32px;
`

const DarkBox = styled.div`
  background-color: ${darkBg};
  padding: 1em 0;
`

export const allDividers = () => (
  <Wrapper>
    <Typography variant="h1" bold>
      All Divider variants
    </Typography>

    <Typography variant="h2">Small</Typography>
    <Typography variant="h3">Default</Typography>
    <Divider variant="small" />
    <DarkBox>
      <Typography variant="h3">Lighter</Typography>
      <Divider color="lighter" variant="small" />
      <Typography variant="h3">Light</Typography>
      <Divider color="light" variant="small" />
    </DarkBox>
    <Typography variant="h3">Medium</Typography>
    <Divider color="medium" variant="small" />

    <Typography variant="h2">Medium</Typography>
    <Typography variant="h3">Default</Typography>
    <Divider variant="medium" />
    <DarkBox>
      <Typography variant="h3">Lighter</Typography>
      <Divider color="lighter" variant="medium" />
      <Typography variant="h3">Light</Typography>
      <Divider color="light" variant="medium" />
    </DarkBox>
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
    <DarkBox>
      <Typography variant="h2">Lighter</Typography>
      <Divider color="lighter" variant="small" />
      <Typography variant="h2">Light</Typography>
      <Divider color="light" variant="small" />
    </DarkBox>
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
    <DarkBox>
      <Typography variant="h2">Lighter</Typography>
      <Divider color="lighter" variant="medium" />
      <Typography variant="h2">Light</Typography>
      <Divider color="light" variant="medium" />
    </DarkBox>
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
