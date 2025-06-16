/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react'
import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
} from '@testing-library/react'
import styled from 'styled-components'
import { Autocomplete } from '.'

const itemObjects = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]
const items = ['One', 'Two', 'Three']
const labelText = 'Select label test'

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: jest.fn((options) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const count = options?.count || 3
    const items = Array.from({ length: count }, (_, index) => ({
      index,
      start: index * 48,
      size: 48,
      key: index,
    }))

    return {
      getVirtualItems: () => items,
      getTotalSize: () => count * 48,
      scrollToIndex: jest.fn(),
      measureElement: jest.fn(),
      measure: jest.fn(),
    }
  }),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver

  //https://github.com/TanStack/virtual/issues/641
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      width: 120,
      height: 120,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }
  })
})

const waitForVirtualizedOptions = async (
  optionsList: HTMLElement,
  expectedCount: number,
) => {
  await waitFor(
    () => {
      const options = within(optionsList).queryAllByRole('option')
      expect(options.length).toBeGreaterThanOrEqual(expectedCount)
    },
    { timeout: 3000 },
  )

  const options = within(optionsList).getAllByRole('option')

  const validOptions = options.filter((option) => {
    const text = option.textContent?.trim()
    return text && text.length > 0
  })

  return validOptions.slice(0, expectedCount)
}

const StyledAutocomplete = styled(Autocomplete)`
  clip-path: unset;
`

describe('Autocomplete', () => {
  it('Matches snapshot', async () => {
    render(<Autocomplete options={items} label={labelText} />)

    const autocomplete = screen.getAllByLabelText(labelText)
    const input = autocomplete[0]

    fireEvent.click(input)

    const openAutocomplete = await screen.findAllByLabelText(labelText)
    const optionsList = openAutocomplete[1]

    await waitFor(() => {
      expect(optionsList).toBeVisible()
    })

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

  it('Has provided ReactNode label', async () => {
    render(<Autocomplete label={<div>{labelText}</div>} options={items} />)

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

  it('Has provided option label', async () => {
    const labler = (text: string) => `${text}+1`
    render(
      <Autocomplete
        options={itemObjects}
        label={labelText}
        optionLabel={(item) => labler(item.label)}
      />,
    )
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })
    expect(optionsList.childNodes).toHaveLength(0)

    fireEvent.click(buttonNode)
    const options = await waitForVirtualizedOptions(optionsList, 3)

    expect(
      within(options[0]).getByText(labler(itemObjects[0].label)),
    ).toBeDefined()
    expect(
      within(options[1]).getByText(labler(itemObjects[1].label)),
    ).toBeDefined()
    expect(
      within(options[2]).getByText(labler(itemObjects[2].label)),
    ).toBeDefined()
  })

  it('Can render custom items with optionComponent', async () => {
    type Item = {
      label: string
    }
    function CustomItem(option: Item) {
      const { label } = option
      return <h1>{label}</h1>
    }
    render(
      <Autocomplete
        options={itemObjects}
        label={labelText}
        optionLabel={(item) => item.label}
        optionComponent={CustomItem}
      />,
    )
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })
    expect(optionsList.childNodes).toHaveLength(0)

    fireEvent.click(buttonNode)
    const options = await waitForVirtualizedOptions(optionsList, 3)

    expect(within(options[0]).getByText(itemObjects[0].label)).toBeDefined()
    const heading = screen.getByText(itemObjects[0].label)
    expect(heading.nodeName).toBe('H1')
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
        initialSelectedOptions={['One', 'Two']}
        multiple
      />,
    )
    const input = await screen.findByPlaceholderText('2/3 selected')
    fireEvent.click(input)

    await waitFor(() => {
      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    const checkboxes = await screen.findAllByRole('checkbox')
    const checked = checkboxes.filter((x) => x.hasAttribute('checked'))

    expect(input).toBeDefined()
    expect(checked.length).toBe(2)
  })

  it('Can select all options', async () => {
    const onChange = jest.fn()
    render(
      <StyledAutocomplete
        //a bug in styled-components 6.1.8 breaks the conditional type for optionLabel when using styled(Autocomplete)
        optionLabel={(label: string) => label}
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        multiple={true}
        allowSelectAll={true}
        onOptionsChange={onChange}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)

    await waitFor(() => {
      const options = within(optionsList).queryAllByRole('option')
      expect(options.length).toBeGreaterThanOrEqual(3)
    })

    const options = within(optionsList).getAllByRole('option')

    const selectAllOption =
      options.find(
        (option) =>
          option.textContent?.includes('Select all') ||
          option.getAttribute('data-testid') === 'select-all',
      ) || options[0]

    fireEvent.click(selectAllOption)

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ selectedItems: items })
    })

    fireEvent.click(selectAllOption)

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ selectedItems: [] })
    })
  })

  it('Can deselect complex options', async () => {
    const onChange = jest.fn()
    const opts = [
      { label: 'Its', value: 'relationship' },
      { label: 'Complicated', value: 'status' },
    ]
    render(
      <Autocomplete
        optionLabel={(o) => o.label}
        itemToKey={(item) => item?.value}
        label={labelText}
        options={opts}
        data-testid="styled-autocomplete"
        multiple={true}
        onOptionsChange={onChange}
        selectedOptions={[
          {
            label: 'Its',
            value: 'relationship',
          },
        ]}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)

    await waitFor(() => {
      const options = within(optionsList).queryAllByRole('option')
      expect(options.length).toBeGreaterThanOrEqual(2)
    })

    const options = within(optionsList).getAllByRole('option')
    const firstValidOption = options.find((option) => {
      const text = option.textContent?.trim()
      return text && text.length > 0 && text !== ''
    })

    if (firstValidOption) {
      fireEvent.click(firstValidOption)
    }

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ selectedItems: [] })
    })
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

    await waitForVirtualizedOptions(optionsList, 3)
  })

  type ControlledProps = {
    onOptionsChange: () => void
  }

  const ControlledAutoComplete = ({ onOptionsChange }: ControlledProps) => {
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
    render(<ControlledAutoComplete onOptionsChange={handleChange} />)
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const optionsList = labeledNodes[1]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(0)
    })
    fireEvent.click(buttonNode)

    const options = await waitForVirtualizedOptions(optionsList, 3)
    fireEvent.click(options[2])

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
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

    await waitForVirtualizedOptions(optionsList, 3)

    fireEvent.change(input, {
      target: { value: 'ree' },
    })

    await waitFor(() => {
      const options = within(optionsList).queryAllByRole('option')
      const validOptions = options.filter((option) => {
        const text = option.textContent?.trim()
        return text && text.includes('Three')
      })
      expect(validOptions.length).toBeGreaterThanOrEqual(1)
    })

    const allOptions = within(optionsList).getAllByRole('option')
    const filteredOptions = allOptions.filter((option) => {
      const text = option.textContent?.trim()
      return text && text.includes('Three')
    })

    expect(filteredOptions.length).toBeGreaterThanOrEqual(1)
    expect(filteredOptions[0]).toHaveTextContent('Three')
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

    await waitFor(() => {
      const options = within(optionsList).queryAllByRole('option')
      expect(options.length).toBeGreaterThan(0)
    })

    const options = within(optionsList).getAllByRole('option')
    expect(options).toHaveLength(2) // since one option is disabled
    expect(await within(options[0]).findByText(items[1])).toBeDefined()

    const withDisabledOptions = await within(optionsList).findAllByRole(
      'option',
      {
        hidden: true,
      },
    )
    expect(withDisabledOptions[0]).toHaveAttribute('aria-hidden')
    expect(
      await within(withDisabledOptions[0]).findByText(items[0]),
    ).toBeDefined()
  })

  it('Clears the input text on blur when no option is selected', async () => {
    render(<Autocomplete options={items} label={labelText} />)
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]

    fireEvent.change(input, {
      target: { value: 'ree' },
    })

    fireEvent.blur(input)
    expect(input).toHaveValue('')
  })

  it('Correctly handles keypresses up/down when all options are disabled', async () => {
    render(
      <Autocomplete
        options={items}
        label={labelText}
        // Somewhat contrived condition to emulate a scenario where an undefined item would return true for the 'option' being disabled
        optionDisabled={(item) => item !== items[0]}
      />,
    )
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const optionsList = labeledNodes[1]

    fireEvent.keyDown(input, { key: 'ArrowDown' })

    await waitFor(() => {
      const options = within(optionsList).queryAllByRole('option')
      expect(options.length).toBeGreaterThan(0)
    })

    const options = within(optionsList).getAllByRole('option')
    expect(options).toHaveLength(1) // since all but one options are disabled

    fireEvent.change(input, {
      target: { value: 'asfsggsdhfj' },
    })

    await waitFor(() => {
      const optionsAfterSearch = within(optionsList).queryAllByRole('option')
      expect(optionsAfterSearch).toHaveLength(0) // since all are filtered out
    })

    // Prevent regression: key up/down when options are disabled causes infinite loop
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.blur(input)
    expect(input).toHaveValue('')
  })

  it('Can extend the css for the component & props are passed correctly to input', async () => {
    const { container } = render(
      <StyledAutocomplete
        //a bug in styled-components 6.1.8 breaks the conditional type for optionLabel when using styled(Autocomplete)
        optionLabel={(label: string) => label}
        label="test"
        options={items}
        data-testid="styled-autocomplete"
      />,
    )

    const autocomplete = await screen.findByTestId('styled-autocomplete')

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
    expect(autocomplete.nodeName).toBe('INPUT')
  })
})
describe('Autocomplete: Add new options feature', () => {
  it('Can add new options', async () => {
    const onChange = jest.fn()
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onOptionsChange={onChange}
        onAddNewOption={onAddNewOption}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const optionsList = labeledNodes[1]

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)
    fireEvent.change(input, {
      target: { value: 'New option' },
    })

    const options = await within(optionsList).findAllByRole('option')
    fireEvent.click(options[0])

    await waitFor(() => {
      expect(onAddNewOption).toHaveBeenNthCalledWith(1, 'New option')
    })
  })
  it('Does not show add option when input is empty', async () => {
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onAddNewOption={onAddNewOption}
      />,
    )

    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })
    fireEvent.click(buttonNode)

    const addOption = screen.queryByTestId('add-item')
    expect(addOption).not.toBeInTheDocument()
  })

  it('Shows add option only when no matches are found', async () => {
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onAddNewOption={onAddNewOption}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)

    fireEvent.change(input, {
      target: { value: 'One' }, // In test data
    })

    const addOption = screen.queryByTestId('add-item')
    expect(addOption).not.toBeInTheDocument()

    fireEvent.change(input, {
      target: { value: 'Completely new item' },
    })

    const addOptionAfter = await screen.findByTestId('add-item')
    expect(addOptionAfter).toBeInTheDocument()
  })

  it('Can add new option using arrow down and Enter key', async () => {
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onAddNewOption={onAddNewOption}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const optionsList = labeledNodes[1]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)
    fireEvent.change(input, {
      target: { value: 'New option via arrow+enter' },
    })

    const addOption = await within(optionsList).findByTestId('add-item')
    expect(addOption).toBeInTheDocument()

    // Use arrow down to highlight the add option, then Enter
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(onAddNewOption).toHaveBeenCalledWith('New option via arrow+enter')
    })
  })

  it('Does not call onAddNewOption with empty string', async () => {
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onAddNewOption={onAddNewOption}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]

    fireEvent.focus(input)
    fireEvent.change(input, {
      target: { value: '   ' },
    })

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(onAddNewOption).not.toHaveBeenCalled()
  })

  it('Clears input after adding new option', async () => {
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onAddNewOption={onAddNewOption}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0] as HTMLInputElement
    const optionsList = labeledNodes[1]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)
    fireEvent.change(input, {
      target: { value: 'New option to clear' },
    })

    const options = await within(optionsList).findAllByRole('option')
    fireEvent.click(options[0])

    await waitFor(() => {
      expect(onAddNewOption).toHaveBeenCalledWith('New option to clear')
    })
    expect(input.value).toBe('')
  })

  it('Displays correct aria-label for add option', async () => {
    const onAddNewOption = jest.fn()
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        onAddNewOption={onAddNewOption}
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)
    fireEvent.change(input, {
      target: { value: 'Test option' },
    })

    const addOption = await screen.findByTestId('add-item')
    expect(addOption).toHaveAttribute(
      'aria-label',
      'Add new option: Test option',
    )
  })

  it('Does not show add option when onAddNewOption is not provided', async () => {
    render(
      <StyledAutocomplete
        label={labelText}
        options={items}
        data-testid="styled-autocomplete"
        // no onAddNewOption prop
      />,
    )

    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]
    const buttonNode = await screen.findByLabelText('toggle options', {
      selector: 'button',
    })

    fireEvent.click(buttonNode)
    fireEvent.change(input, {
      target: { value: 'Should not show add option' },
    })

    const addOption = screen.queryByTestId('add-item')
    expect(addOption).not.toBeInTheDocument()
  })
})
