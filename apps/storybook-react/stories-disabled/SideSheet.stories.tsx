import React, { useState } from 'react'
import styled from 'styled-components'
import { SideSheet, SideSheetProps, Button } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

const Child = styled.div`
  padding: 6px;
  background-color: rgba(255, 146, 0, 0.15);
  box-sizing: border-box;
  border: 1px dashed #ff9200;
  border-radius: 4px;
`

export default {
  title: 'Components/SideSheet',
  component: SideSheet,
  argTypes: {
    title: {
      defaultValue: 'Title',
    },
  },
} as Meta

export const Default: Story<SideSheetProps> = (args) => {
  const [toggle, setToggle] = useState(true)

  return (
    <div style={{ height: '400px' }}>
      <Button variant="outlined" onClick={() => setToggle(!toggle)}>
        Click me!
      </Button>
      <SideSheet {...args} open={toggle} onClose={() => setToggle(!toggle)}>
        <Child>Children</Child>
      </SideSheet>
    </div>
  )
}
