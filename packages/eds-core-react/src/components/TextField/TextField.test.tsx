/* eslint-disable no-undef */
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { TextField } from '.'
import { Icon } from '../Icon'
import { save } from '@equinor/eds-icons'

afterEach(cleanup)

describe('TextField', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <TextField id="textfield" label="textfield" />,
    )

    expect(asFragment).toMatchSnapshot()
  })
  it('Has correct label text', () => {
    const labelText = 'Some label'
    render(<TextField id="test-label" label={labelText} />)

    expect(screen.queryByText(labelText)).toBeInTheDocument()
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
    // eslint-disable-next-line testing-library/no-node-access
    const inputNode = screen.getByLabelText(labelText).parentElement
    // eslint-disable-next-line testing-library/no-node-access
    expect(inputNode.querySelectorAll('svg')).toHaveLength(1)
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
