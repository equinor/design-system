import { useState, useEffect } from 'react'
import { Button, Icon, ButtonProps, EdsProvider, EdsProviderProps } from '../..'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { menu } from '@equinor/eds-icons'

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
        component: `EdsProvider is used to provide users with the choice between comfortable and compact mode.
        `,
      },
    },
  },
} as Meta

export const Default: Story<EdsProviderProps['density']> = (args) => {
  // console.log(args)
  // const [density, setDensity] =
  //   useState<EdsProviderProps['density']>('comfortable')

  // useEffect(() => {
  //   /* In this example we use useEffect for brevity, but this should be a user choice –
  //    * do NOT set density to compact as the default value!
  //    * See Playground -> Examples -> Test Page
  //    */
  //   setDensity('compact')
  // }, [])

  // const density: EdsProviderProps['density'] = 'compact'

  return (
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
}
