import { useState } from 'react'
import styled from 'styled-components'
import { SideSheet, SideSheetProps, Button } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import page from './SideSheet.docs.mdx'

export default {
  title: 'Surfaces/SideSheet',
  component: SideSheet,
  args: {
    title: 'Title',
  },
  parameters: {
    docs: {
      page,
      source: {
        type: 'code',
      },
    },
  },
} as ComponentMeta<typeof SideSheet>

const Child = styled.div`
  padding: 6px;
  background-color: rgba(255, 146, 0, 0.15);
  box-sizing: border-box;
  border: 1px dashed #ff9200;
  border-radius: 4px;
`
export const Introduction: Story<SideSheetProps> = (args) => {
  const [toggle, setToggle] = useState(true)
  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Button variant="outlined" onClick={() => setToggle(!toggle)}>
        Click me!
      </Button>
      <SideSheet {...args} open={toggle} onClose={() => setToggle(!toggle)}>
        <Child>Children</Child>
      </SideSheet>
    </div>
  )
}
