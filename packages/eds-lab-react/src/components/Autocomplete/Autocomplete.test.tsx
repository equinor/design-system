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
import { Autocomplete } from '.'

const items = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]
const labelText = 'Select label test'

afterEach(cleanup)

describe('Autocomplete', () => {
  it('Matches snapshot', async () => {
    render(<Autocomplete options={items} label={labelText} />)

    const combobox = screen.getAllByLabelText(labelText)
    const input = combobox[0]

    fireEvent.click(input)

    const openAutocomplete = await screen.findAllByLabelText(labelText)
    const optionsList = openAutocomplete[1]

    expect(optionsList).toMatchSnapshot()
  })
  it('Has provided label', async () => {
    render(<Autocomplete label={labelText} options={items} />)

    // The same label is used for both the input field and the list of options
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const optionsList = labeledNodes[1]

    expect(input).toBeDefined()
    expect(input).toHaveAccessibleName(labelText)
    expect(input.nodeName).toBe('INPUT')

    expect(optionsList).toBeDefined()
    expect(optionsList).toHaveAccessibleName(labelText)
    expect(optionsList.nodeName).toBe('UL')
  })

  it('Can be disabled', async () => {
    render(<Autocomplete label={labelText} options={items} disabled />)
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]

    expect(input).toBeDisabled()
  })

  it('Can preselect specific options', async () => {
    render(
      <Autocomplete
        options={items}
        label={labelText}
        initialSelectedOptions={[{ label: 'One' }, { label: 'Two' }]}
        multiple
      />,
    )
    const input = await screen.findByPlaceholderText('2/3 selected')
    fireEvent.click(input)

    const checkboxes = await screen.findAllByRole('checkbox')
    const checked = checkboxes.filter((x) => x.hasAttribute('checked'))

    expect(input).toBeDefined()
    expect(checked.length).toBe(2)
  })

  it('Can open the options on button click', async () => {
    render(<Autocomplete options={items} label={labelText} />)

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })
    expect(optionsList.childNodes).toHaveLength(0)

    fireEvent.click(buttonNode)

    expect(await within(optionsList).findAllByRole('option')).toHaveLength(3)
  })

  type ControlledProps = {
    onOptionsChange: () => void
  }

  const HandleMultipleSelect = ({ onOptionsChange }: ControlledProps) => {
    const [selected, setSelected] = useState([])
    return (
      <Autocomplete
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

  it('Can be a controlled component', async () => {
    const handleChange = jest.fn()
    render(<HandleMultipleSelect onOptionsChange={handleChange} />)
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    expect(handleChange).toHaveBeenCalledTimes(0)
    fireEvent.click(buttonNode)
    const options = await within(optionsList).findAllByRole('option')
    fireEvent.click(options[2])
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('Can filter results by input value', async () => {
    render(<Autocomplete options={items} label={labelText} />)
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })
    expect(optionsList.childNodes).toHaveLength(0)

    fireEvent.click(buttonNode)
    expect(await within(optionsList).findAllByRole('option')).toHaveLength(3)

    fireEvent.change(input, {
      target: { value: 'ree' },
    })
    expect(await within(optionsList).findAllByRole('option')).toHaveLength(1)
  })

  it('Second option is first when first option is disabled', async () => {
    render(
      <Autocomplete
        options={items}
        label={labelText}
        optionDisabled={(item) => item === items[0]}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const optionsList = labeledNodes[1]

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const options = await within(optionsList).findAllByRole('option')
    expect(options).toHaveLength(2) // since one option is disabled
    expect(await within(options[0]).findByText(items[1].label)).toBeDefined()

    const withDisabledOptions = await within(optionsList).findAllByRole(
      'option',
      {
        hidden: true,
      },
    )
    expect(withDisabledOptions[0]).toHaveAttribute('aria-hidden')
    expect(
      await within(withDisabledOptions[0]).findByText(items[0].label),
    ).toBeDefined()
  })

  const StyledAutocomplete = styled(Autocomplete)`
    clip-path: unset;
  `

  it('Can extend the css for the component & props are passed correctly to input', async () => {
    const { container } = render(
      <StyledAutocomplete
        label="test"
        options={items}
        data-testid="styled-combobox"
      />,
    )

    const combobox = await screen.findByTestId('styled-combobox')

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
    expect(combobox.nodeName).toBe('INPUT')
  })
})
