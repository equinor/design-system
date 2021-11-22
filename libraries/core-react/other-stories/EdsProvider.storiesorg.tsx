import { Button, Icon, EdsProvider, EdsProviderProps } from '../..'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { menu } from '@equinor/eds-icons'
import { gt } from 'ramda'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`
export default {
  title: 'Components/EdsProvider',
  component: EdsProvider,
  args: { density: 'comfortable' },
  argTypes: {
    density: { control: 'radio' },
  },
  parameters: {
    docs: {
      description: {
        /* prettier-ignore */
        component: `EdsProvider is used to provide users with the choice between comfortable and compact mode.

Compact should **not** be used directly as a value to &lt;EdsProvider /&gt;, but provided as a user choice.

See https://codesandbox.io/s/eds-compact-mode-y9l10 for a working example.
        `,
      },
      source: {
        type: 'code',
      },
    },
  },
} as Meta

export const Default: Story<EdsProviderProps['density']> = (args) => (
  /* args.density = 'comfortable|compact' */

  <EdsProvider {...args}>
    <Wrapper>
      <Button>Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost_icon">
        <Icon data={menu} title="Ghost icon menu"></Icon>
      </Button>
    </Wrapper>
  </EdsProvider>
)
