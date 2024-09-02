import { useState } from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { NativeSelect } from '.'

type SelectProps = {
  label: string
  id: string
}
const SelectMarkup = ({ label, id }: SelectProps) => {
  return (
    <NativeSelect label={label} id={id}>
      <option>Option one</option>
      <option>Option two</option>
      <option>Option three</option>
    </NativeSelect>
  )
}

describe('NativeSelect', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <NativeSelect label="label" id="native-select-snapshot">
        <option>Option one</option>
        <option>Option two</option>
        <option>Option three</option>
      </NativeSelect>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Matches multi-select snapshot', () => {
    const { asFragment } = render(
      <NativeSelect label="label" id="native-multi-select-snapshot" multiple>
        <option>Option one</option>
        <option>Option two</option>
        <option>Option three</option>
      </NativeSelect>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <NativeSelect label="label" id="a11y-id">
        <option>Option one</option>
        <option>Option two</option>
      </NativeSelect>,
    )
    await act(async () => {
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  it('Has provided label', () => {
    const label = 'Select label'
    render(<SelectMarkup label={label} id="test-id" />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })

  it('Can be disabled', () => {
    const label = 'Select label'
    render(
      <NativeSelect label={label} id="testDisabled" disabled>
        <option>Option one</option>
        <option>Option two</option>
        <option>Option three</option>
      </NativeSelect>,
    )
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDisabled()
  })

  it('Can preselect a specific option', () => {
    const label = 'Select label'
    render(
      <NativeSelect label={label} id="testPreselect" defaultValue="two">
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
      </NativeSelect>,
    )
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toHaveValue('two')
  })

  type ControlledProps = {
    onChange: () => void
  }

  const ControlledSelect = ({ onChange }: ControlledProps) => {
    const [value, setValue] = useState('one')
    return (
      <NativeSelect
        label="select-label"
        id="selectId"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange()
        }}
      >
        {' '}
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
      </NativeSelect>
    )
  }

  it('Can be a controlled component', () => {
    const newValue = 'three'
    const handleChange = jest.fn()
    render(<ControlledSelect onChange={handleChange} />)
    const select = screen.queryByLabelText('select-label')

    expect(select).toHaveValue('one')
    expect(handleChange).toHaveBeenCalledTimes(0)

    fireEvent.change(select, {
      target: { value: newValue },
    })
    expect(select).toHaveValue('three')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('Can select multiple elements', () => {
    const label = 'Select label'
    render(
      <NativeSelect label={label} id="testMultiple" multiple>
        <option>Option one</option>
        <option>Option two</option>
        <option>Option three</option>
      </NativeSelect>,
    )
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toHaveAttribute('multiple')
  })

  const StyledSelect = styled(NativeSelect)`
    clip-path: unset;
  `
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSelect label="test" id="testId" />)
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
})
