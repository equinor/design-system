import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Icon, Chip, Avatar } from '@equinor/eds-core-react'
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

const onDelete = (x) => console.log('Triggered onDelete!', x)
const onClick = (x) => console.log('Triggered onClick!', x)

export const Chips = () => (
  <div>
    <Wrapper>
      <Chip
        id="some-chips-id"
        active={boolean('Active', false)}
        disabled={boolean('Disabled', false)}
        onClick={onClick}
        onDelete={onDelete}
      >
        <Icon name="save" />
        {text('Label', 'Label')}
      </Chip>
      <Chip onDelete={onDelete}>{text('Label', 'Label')}</Chip>
      <Chip disabled onDelete={onDelete}>
        {text('Label', 'Label')}
      </Chip>

      <Chip onClick={onClick}>{text('Label', 'Label')}</Chip>
      <Chip onClick={onClick}>
        <Icon name="save" />
        {text('Label', 'Label')}
      </Chip>
      <Chip onClick={onClick} disabled>
        <Icon name="save" />
        {text('Label', 'Label')}
      </Chip>
      <Chip active>{text('Label', 'Label')}</Chip>
      <Chip active onClick={onClick} onDelete={onDelete}>
        {text('Label', 'Label')}
      </Chip>
      <Chip active onClick={onClick} onDelete={onDelete} disabled>
        {text('Label', 'Label')}
      </Chip>

      <Chip onDelete={onDelete}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg"></Avatar>
        Luna
      </Chip>
    </Wrapper>
  </div>
)
