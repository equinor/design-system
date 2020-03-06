import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Icon, Chip } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'

const icons = {
  save,
}

Icon.add(icons)

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(3, fit-content(100%));
`

export default {
  title: 'Components|Chips',
  component: Chip,
  decorators: [withKnobs],
}

export const Chips = () => (
  <div>
    <Wrapper>
      <Chip
        id="some-chips-id"
        active={boolean('Active', false)}
        disabled={boolean('Disabled', false)}
        clickable={boolean('Clickable', false)}
        onDelete={console.log}
      >
        <Icon name="save" />
        {text('Label', 'Label')}
      </Chip>
      <Chip onDelete={console.log}>{text('Label', 'Label')}</Chip>
      <Chip disabled onDelete={console.log}>
        {text('Label', 'Label')}
      </Chip>

      <Chip clickable>{text('Label', 'Label')}</Chip>
      <Chip clickable>
        <Icon name="save" />
        {text('Label', 'Label')}
      </Chip>
      <Chip clickable disabled>
        <Icon name="save" />
        {text('Label', 'Label')}
      </Chip>
      <Chip active>{text('Label', 'Label')}</Chip>
      <Chip active clickable onDelete={console.log}>
        {text('Label', 'Label')}
      </Chip>
      <Chip active clickable onDelete={console.log} disabled>
        {text('Label', 'Label')}
      </Chip>
    </Wrapper>
  </div>
)
