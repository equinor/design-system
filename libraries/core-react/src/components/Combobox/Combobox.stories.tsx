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

type CustomDataType = {
  label: string
  index?: number
  id?: number
}

const data = items.map<CustomDataType>((label, index) => ({
  label,
  index,
}))

export const Default: Story<ComboboxProps<CustomDataType>> = (args) => (
  <Wrapper>
    <Combobox label="You can play with me" {...args} options={data} />
  </Wrapper>
)
export const Multiple: Story<ComboboxProps<CustomDataType>> = (args) => (
  <Wrapper>
    <Combobox label="Single" {...args} options={data} />
    <Combobox label="Multiple" {...args} options={data} multiple />
  </Wrapper>
)

export const DataObject: Story<ComboboxProps<CustomDataType>> = () => {
  return (
    <Wrapper>
      <Combobox
        label="Single"
        options={data}
        optionLabel={(opt) => `${opt.index + 1}. ${opt.label}`}
      />
      <Combobox
        label="Multiple"
        options={data}
        multiple
        optionLabel={(opt) => `${opt.index + 1}. ${opt.label}`}
      />
    </Wrapper>
  )
}
