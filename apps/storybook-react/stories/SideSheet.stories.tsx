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
} as Meta

export const Default: Story<SideSheetProps> = (args) => {
  const [toggle, setToggle] = useState(false)

  return (
    <div style={{ margin: '10rem' }}>
      <Button variant="outlined" onClick={() => setToggle(!toggle)}>
        Click me!
      </Button>
      <SideSheet
        {...args}
        open={toggle || args.open}
        onClose={() => setToggle(!toggle)}
      >
        <Child>Children</Child>
      </SideSheet>
    </div>
  )
}
