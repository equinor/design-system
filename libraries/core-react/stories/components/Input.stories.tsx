import React from 'react'
import styled from 'styled-components'
import { Input, InputProps } from '@components'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `The **Input** component is intended to use if you need to more flexibility than the wrapped <code>TextField</code> or
        select components give.<br/>
        
        `,
      },
    },
  },
} as Meta

export const Default: Story<InputProps> = (args) => <Input {...args} />
