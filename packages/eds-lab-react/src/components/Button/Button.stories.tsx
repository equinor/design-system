import { useState, useEffect, CSSProperties } from 'react'
import {
  Button,
  Icon,
  ButtonProps,
  EdsProvider,
  Density,
} from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'
import styled from 'styled-components'
import { StoryFn, Meta } from '@storybook/react-vite'

Icon.add({ save })

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
  align-items: start;
`

const meta: Meta<typeof Button> = {
  title:
    'Core-react experimental features/css-variables/Button With Relative Units',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Overriding exposed css variables.
        `,
      },
    },
  },
}

export default meta

export const Default: StoryFn<ButtonProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  const style = {
    '--eds_button__font_size': 'calc(14 / 16 * 1rem)',
    '--eds_button__radius': 'calc(4 / 14 * 1em)',
    '--eds_button__height': 'auto',
    '--eds_button__height_compact': 'auto',
    '--eds_button__gap': 'calc(8 / 14 * 1em)',
    '--eds_button__border_width': '1px',
    '--eds_button__padding_y':
      'calc(10 / 14 * 1em - var(--eds_button__border_width))',
    '--eds_button__padding_y_compact':
      'calc(4 / 14 * 1em - var(--eds_button__border_width))',
    '--eds_button__padding_x': 'calc(16 / 14 * 1em)',
    '--eds_button__icon__size': '24px',
    '--eds_button__icon__margin_y': '-4px', // icon = 24px, line-height: 16px, (24 - 16) / 2 = 4px
    '--eds_button__fullwidth__icon__margin_x': 'calc(8 / 14 * 1em)',
    '--eds_button__fullwidth__label__margin_x': 'calc(32 / 14 * 1em)',
  } as CSSProperties

  return (
    <Wrapper style={style}>
      <Button variant="outlined">Outlined</Button>
      <Button>
        Contained
        <br />
        multiline
      </Button>
      <EdsProvider density={density}>
        <Button variant="outlined">Compact</Button>
        <Button variant="outlined">
          Compact
          <br />
          multiline
        </Button>
      </EdsProvider>
      <Button>
        <Icon name="save" title="save" />
        Icon
      </Button>
      <Button>
        <Icon name="save" title="save" />
        Icon
        <br />
        multiline
      </Button>
    </Wrapper>
  )
}
