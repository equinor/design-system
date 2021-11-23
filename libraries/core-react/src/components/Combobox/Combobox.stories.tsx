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
  areaCode: string
}

export const Default: Story<ComboboxProps<CustomDataType>> = (args) => {
  return (
    <Wrapper>
      <Combobox {...args} />
    </Wrapper>
  )
}

Default.bind({})
Default.args = {
  label: 'Telefon areacodes',
  options: [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ],
}

export const Multiple: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox label="Telefon areacodes" {...args} options={data} multiple />
    </Wrapper>
  )
}

export const UsingOptionLabel: Story<ComboboxProps<CustomDataType>> = () => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox
        label="Telefon areacodes"
        options={data}
        optionLabel={(opt) => `${opt.areaCode} - ${opt.label}`}
      />
    </Wrapper>
  )
}

export const Disabled: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox label="Telefon areacodes" {...args} options={data} disabled />
    </Wrapper>
  )
}

export const Readonly: Story<ComboboxProps<CustomDataType>> = (args) => {
  const data = [
    { label: 'Oslo', areaCode: '02' },
    { label: 'Rogaland', areaCode: '04' },
    { label: 'Møre og Romsdal', areaCode: '070' },
    { label: 'Nord-Norge', areaCode: '08x' },
    { label: 'Hordaland', areaCode: '54' },
    { label: 'Østfold', areaCode: '09' },
  ]

  return (
    <Wrapper>
      <Combobox
        label="Telefon areacodes"
        initialSelectedOptions={[data[0]]}
        options={data}
        readOnly
        {...args}
      />
    </Wrapper>
  )
}
