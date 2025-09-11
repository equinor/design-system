import { useState, useEffect } from 'react'
import { NativeSelect, NativeSelectProps, EdsProvider, Density } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import page from './NativeSelect.docs.mdx'

const meta: Meta<typeof NativeSelect> = {
  title: 'Inputs/NativeSelect',
  component: NativeSelect,
  parameters: {
    docs: {
      page,
    },
  },
}

export default meta

export const Introduction: StoryFn<NativeSelectProps> = (args) => {
  return (
    <NativeSelect label="Label text" meta="m2" id="default-select" {...args}>
      <option>First option with a really really long text</option>
      <option>Second</option>
    </NativeSelect>
  )
}
export const Multiple: StoryFn<NativeSelectProps> = () => (
  <NativeSelect label="Label text" id="multiple-select" multiple>
    <option>First option with a really really long text</option>
    <option>Second</option>
    <option>Third</option>
    <option>Another</option>
    <option>Even another</option>
  </NativeSelect>
)

export const Disabled: StoryFn<NativeSelectProps> = () => (
  <NativeSelect label="Label text" disabled id="disabled-select">
    <option>Pick one</option>
  </NativeSelect>
)

export const Compact: StoryFn<NativeSelectProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <NativeSelect label="This is compact" id="compact-select">
        <option>First option with a really really long text</option>
        <option>Second</option>
        <option>Third</option>
        <option>Another</option>
        <option>Even another</option>
      </NativeSelect>
    </EdsProvider>
  )
}
