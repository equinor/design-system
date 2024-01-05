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

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})

describe('Autocomplete', () => {
  it('Matches snapshot', async () => {
    render(<Autocomplete options={items} label={labelText} />)

    const autocomplete = screen.getAllByLabelText(labelText)
    const input = autocomplete[0]

    fireEvent.click(input)

    const openAutocomplete = await screen.findAllByLabelText(labelText)
    const optionsList = openAutocomplete[1]

    expect(optionsList).toMatchSnapshot()
  })
  it('Has provided label', async () => {
    render(<Autocomplete disablePortal label={labelText} options={items} />)

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
    render(
      <Autocomplete
        disablePortal
        label={<div>{labelText}</div>}
        options={items}
      />,
    )

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
        disablePortal
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
    expect(await within(optionsList).findAllByRole('option')).toHaveLength(3)

    const options = await within(optionsList).findAllByRole('option')
    expect(within(options[0]).getByText(labler(items[0]))).toBeDefined()
    expect(within(options[1]).getByText(labler(items[1]))).toBeDefined()
    expect(within(options[2]).getByText(labler(items[2]))).toBeDefined()
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
        disablePortal
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
    expect(await within(optionsList).findAllByRole('option')).toHaveLength(3)

    const options = await within(optionsList).findAllByRole('option')
    expect(within(options[0]).getByText(items[0])).toBeDefined()
    const heading = screen.getByText(items[0])
    expect(heading.nodeName).toBe('H1')
  })

  it('Can be disabled', async () => {
    render(
      <Autocomplete disablePortal label={labelText} options={items} disabled />,
    )
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

    const checkboxes = await screen.findAllByRole('checkbox')
    const checked = checkboxes.filter((x) => x.hasAttribute('checked'))

    expect(input).toBeDefined()
    expect(checked.length).toBe(2)
  })

  it('Can open the options on button click', async () => {
    render(<Autocomplete disablePortal options={items} label={labelText} />)

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

  const ControlledAutoComplete = ({ onOptionsChange }: ControlledProps) => {
    const [selected, setSelected] = useState([])
    return (
      <Autocomplete
        multiple
        disablePortal
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
    const options = await within(optionsList).findAllByRole('option')
    fireEvent.click(options[2])

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  it('Can filter results by input value', async () => {
    render(<Autocomplete disablePortal options={items} label={labelText} />)
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
    const filteredOptions = await within(optionsList).findAllByRole('option')
    expect(filteredOptions).toHaveLength(1)
    expect(within(filteredOptions[0]).getByText('Three')).toBeDefined()
  })

  it('Clears the input text on blur when no option is selected', async () => {
    render(<Autocomplete disablePortal options={items} label={labelText} />)
    const labeledNodes = await screen.findAllByLabelText(labelText)
    const input = labeledNodes[0]

    fireEvent.change(input, {
      target: { value: 'ree' },
    })

    fireEvent.blur(input)
    expect(input).toHaveValue('')
  })

  it('Second option is first when first option is disabled', async () => {
    render(
      <Autocomplete
        disablePortal
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

  const StyledAutocomplete = styled(Autocomplete)`
    clip-path: unset;
  `

  it('Can extend the css for the component & props are passed correctly to input', async () => {
    const { container } = render(
      <StyledAutocomplete
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
