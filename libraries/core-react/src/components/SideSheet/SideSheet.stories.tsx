import React, { useState } from 'react'
import styled from 'styled-components'
import { SideSheet, SideSheetProps, Button } from '@components'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Components/SideSheet',
  component: SideSheet,
  argTypes: {
    title: {
      defaultValue: 'Title',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A side sheet is a a toggleable area that is anchored to the edge 
        of the viewport with supplementary content.
        `,
      },
    },
  },
} as Meta

export const Default: Story<SideSheetProps> = (args) => {
  const [toggle, setToggle] = useState(true)
  const Child = styled.div`
    padding: 6px;
    background-color: rgba(255, 146, 0, 0.15);
    box-sizing: border-box;
    border: 1px dashed #ff9200;
    border-radius: 4px;
  `
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
