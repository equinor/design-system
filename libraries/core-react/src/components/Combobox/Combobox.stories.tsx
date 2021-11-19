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
  custom?: string
  id?: number
}

const data = items.map<CustomDataType>((x) => ({
  label: x,
  custom: 'custom property',
}))

export const Default: Story<ComboboxProps<CustomDataType>> = (args) => (
  <Wrapper>
    <Combobox label="You can play with me" {...args} items={data} />
  </Wrapper>
)
export const Multiple: Story<ComboboxProps<CustomDataType>> = (args) => (
  <Wrapper>
    <Combobox label="Single" {...args} items={data} />
    <Combobox label="Multiple" {...args} items={data} multiple />
  </Wrapper>
)

export const DataObject: Story<ComboboxProps<CustomDataType>> = () => (
  <Wrapper>
    <Combobox
      label="Single"
      items={data}
      optionLabel={(opt) => `${opt.label}`}
    />
    <Combobox label="Multiple" items={data} multiple />
  </Wrapper>
)

const test = [
  {
    label: 'dfsdf',
    id: 12312,
    foo: {
      bar: 'jaja',
    },
  },
]

export const Test = () => (
  <Combobox
    label="Pick one"
    items={[
      {
        label: 'dfsdf',
        id: 12312,
        foo: {
          bar: 'jaja',
        },
      },
    ]}
    optionLabel={(opt) => opt.label}
  ></Combobox>
)
