/* eslint-disable no-undef */
import { render, fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { TextField } from '.'
import { Icon } from '../Icon'
import { save } from '@equinor/eds-icons'

describe('TextField', () => {
  it('Matches snapshot', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789)
    const { asFragment } = render(
      <TextField id="textfield" label="textfield" />,
    )
    jest.spyOn(Math, 'random').mockRestore()
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pas a11y test', async () => {
    const { container } = render(<TextField id="textfield" label="textfield" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pas a11y test with meta & text helper', async () => {
    const { container } = render(
      <TextField
        id="textfield"
        label="textfield"
        meta="meta"
        helperText="helper text"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pas a11y test with icon', async () => {
    const { container } = render(
      <TextField
        id="textfield"
        label="textfield"
        helperIcon={<Icon data={save} />}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pas a11y test even if no id has been provided', async () => {
    const { container } = render(
      <TextField
        label="textfield"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Has correct label text', () => {
    const labelText = 'Some label'
    render(<TextField id="test-label" label={labelText} />)

    expect(screen.getByText(labelText)).toBeInTheDocument()
  })

  it('Has correct label ReactNode', () => {
    const labelText = 'Some label'
    render(<TextField id="test-label" label={<div>{labelText}</div>} />)

    expect(screen.getByText(labelText)).toBeInTheDocument()
  })

  it('Has correct default value', () => {
    const value = 'Some value'
    render(<TextField id="test-value" value={value} readOnly />)
    const inputElement: HTMLInputElement = screen.queryByDisplayValue(value)

    expect(inputElement.value).toBe(value)
  })

  it('Has correct updated value when changed', () => {
    let value = 'Initial value'
    const newValue = 'Updated value'
    const onChangeHandler = (ele) => {
      // eslint-disable-next-line
      value = ele.target.value
    }

    render(
      <TextField
        id="test-value-updated"
        value={value}
        onChange={onChangeHandler}
      />,
    )

    fireEvent.change(screen.getByDisplayValue(value), {
      target: { value: newValue },
    })

    expect(value).toBe(newValue)
  })

  it('Can have a helper text', () => {
    const helperText = 'Help me'

    render(<TextField id="test" helperText={helperText} />)
    const inputNode = screen.getByText(helperText)
    expect(inputNode).toBeDefined()
  })

  it('Can have an icon inside the input', () => {
    const labelText = 'Label for test'
    render(
      <TextField
        id="test"
        label={labelText}
        inputIcon={<Icon data={save} />}
      />,
    )
    const textFieldContainer =
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByLabelText(labelText).parentElement.parentElement

    // eslint-disable-next-line testing-library/no-node-access
    expect(textFieldContainer.querySelectorAll('svg')).toHaveLength(1)
  })
  it('Can have an icon by the helper text', () => {
    const helperText = 'Help me'
    render(
      <TextField
        id="test"
        label="hi"
        helperText={helperText}
        helperIcon={<Icon data={save} />}
      />,
    )
    // eslint-disable-next-line testing-library/no-node-access
    const helperNode = screen.getByText(helperText).parentNode
    // eslint-disable-next-line testing-library/no-node-access
    expect(helperNode.querySelectorAll('svg')).toHaveLength(1)
  })

  const StyledTextField = styled(TextField)`
    margin-top: 48px;
  `
  it('Can extend the css of the component', () => {
    const { container } = render(
      <StyledTextField id="test-css-extend" variant="error" />,
    )

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyleRule('margin-top', '48px')
  })
})
