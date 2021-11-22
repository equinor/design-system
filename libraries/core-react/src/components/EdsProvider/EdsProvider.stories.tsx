import styled from 'styled-components'
import { Story } from '@storybook/react'
import { menu } from '@equinor/eds-icons'

import { Button, Icon, EdsProvider, EdsProviderProps } from '../..'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`
export const Default: Story<EdsProviderProps['density']> = (args) => (
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
