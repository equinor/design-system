import { useState } from 'react'
import {
  render,
  cleanup,
  fireEvent,
  screen,
  within,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'

import styled from 'styled-components'
import { Combobox } from '.'

const items = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]
const labelText = 'Select label test'

afterEach(cleanup)

describe('Combobox', () => {
  it('Matches snapshot', () => {
    render(<Combobox options={items} label={labelText} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('toggle options', {
      selector: 'button',
    })
    expect(optionsNode).toMatchSnapshot()
    // expect(buttonNode).toMatchSnapshot()
  })
  it('Has provided label', () => {
    render(<Combobox label={labelText} options={items} id="id" />)
    // The same label is used for both the input field and the list of options
    const inputNode = screen.getAllByLabelText(labelText)
    expect(inputNode).toBeDefined()
  })

  it('Can be disabled', () => {
    render(<Combobox label={labelText} options={items} disabled />)
    const inputNode = screen.getAllByLabelText(labelText)[0]
    expect(inputNode).toBeDisabled()
  })

  it('Can preselect specific options', () => {
    render(
      <Combobox
        options={items}
        label={labelText}
        initialSelectedOptions={[{ label: 'One' }, { label: 'Two' }]}
        multiple
      />,
    )
    const placeholderText = screen.getByPlaceholderText('2/3 selected')
    expect(placeholderText).toBeDefined()
  })

  it('Can open the options on button click', () => {
    render(<Combobox options={items} label={labelText} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('toggle options', {
      selector: 'button',
    })
    expect(within(optionsNode).queryAllByRole('option')).toHaveLength(0)
    fireEvent.click(buttonNode)
    expect(within(optionsNode).queryAllByRole('option')).toHaveLength(3)
  })

  type ControlledProps = {
    onOptionsChange: () => void
  }

  const HandleMultipleSelect = ({ onOptionsChange }: ControlledProps) => {
    const [selected, setSelected] = useState([])
    return (
      <Combobox
        multiple
        options={items}
        label={labelText}
        selectedOptions={selected}
        onOptionsChange={(changes) => {
          setSelected(changes.selectedItems)
          onOptionsChange()
        }}
      />
    )
  }

  it('Can be a controlled component', () => {
    const handleChange = jest.fn()
    render(<HandleMultipleSelect onOptionsChange={handleChange} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('toggle options', {
      selector: 'button',
    })

    expect(handleChange).toHaveBeenCalledTimes(0)
    fireEvent.click(buttonNode)
    fireEvent.click(within(optionsNode).queryAllByRole('option')[2])
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('Can filter results by contains search', () => {
    render(<Combobox options={items} label={labelText} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]

    const optionsNode = screen.getAllByLabelText(labelText)[1]

    const buttonNode = screen.getByLabelText('toggle options', {
      selector: 'button',
    })
    expect(within(optionsNode).queryAllByRole('option')).toHaveLength(0)
    fireEvent.click(buttonNode)
    expect(within(optionsNode).queryAllByRole('option')).toHaveLength(3)
    fireEvent.change(inputNode, {
      target: { value: 'ree' },
    })
    expect(within(optionsNode).queryAllByRole('option')).toHaveLength(1)
  })

  it('Second option is first when first option is disabled', () => {
    const options = [
      {
        label: 'option1',
        id: 1,
        disabled: true,
      },
      {
        label: 'option2',
        id: 2,
      },
      {
        label: 'option3',
        id: 3,
      },
    ]

    render(<Combobox options={options} label={labelText} />)
    const inputNode = screen.getAllByLabelText(labelText)[0]
    const optionsNode = screen.getByRole('listbox')

    fireEvent.keyDown(inputNode, { key: 'ArrowDown' })
    expect(within(optionsNode).queryAllByRole('option')).toHaveLength(2) // since one option is disabled
    const firstOption = within(optionsNode).queryAllByRole('option')[0]
    expect(within(firstOption).getByText(options[1].label)).toBeDefined()
  })

  const StyledMultiSelect = styled(Combobox)`
    clip-path: unset;
  `

  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledMultiSelect label="test" options={items} />,
    )
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
})
