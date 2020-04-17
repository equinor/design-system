import React from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Divider, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import mdx from './Divider.docs.mdx'

const {
  colors: {
    ui: {
      background__info: { hex: darkBg },
    },
  },
} = tokens

export default {
  title: 'Components|Divider',
  parameters: {
    docs: {
      page: mdx,
    },
  },
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
  padding: 32px;
  background-color: #999;
`

export const Default = () => <Divider />

export const Small = () => (
  <Wrapper>
    <Divider color="lighter" variant="small" />
    <Divider color="light" variant="small" />
    <Divider variant="small" />
  </Wrapper>
)

export const Medium = () => (
  <Wrapper>
    <Divider color="lighter" />
    <Divider color="light" />
    <Divider />
  </Wrapper>
)

export const knobs = () => (
  <Wrapper>
    <Divider
      color={select('Color', [...Object.values(COLOR)], COLOR.MEDIUM)}
      variant={select('Variant', [...Object.values(VARIANT)], VARIANT.MEDIUM)}
    />
  </Wrapper>
)

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
