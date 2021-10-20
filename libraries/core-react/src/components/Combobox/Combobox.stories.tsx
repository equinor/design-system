/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState } from 'react'
import { Combobox, ComboboxProps } from '../..'
import { Story, Meta } from '@storybook/react/types-6-0'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm, Controller } from 'react-hook-form'
import { items } from '../../stories/data'
import { label } from '../Label/Label.tokens'

export default {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component: `The Combobox component allows users to choose one or
        multiple items or options from a list.
        `,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  margin-bottom: 350px;
`

export const Default: Story<ComboboxProps> = (args) => (
  <Wrapper>
    <Combobox label="You can play with me" {...args} items={items} />
  </Wrapper>
)
export const Multiple: Story<ComboboxProps> = (args) => (
  <Wrapper>
    <Combobox label="Single" {...args} items={items} />
    <Combobox label="Multiple" {...args} items={items} multiple />
  </Wrapper>
)

const data = items.map((val) => ({
  label: val,
  custom: 'custom',
}))
export const DataObject: Story<ComboboxProps> = () => (
  <Wrapper>
    <Combobox
      label="Single"
      items={data}
      optionLabel={(opt) => `${opt.label} TEMPLATE`}
    />
    <Combobox label="Multiple" items={data} multiple />
  </Wrapper>
)
