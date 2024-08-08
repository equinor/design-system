import { render, fireEvent, screen, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Search } from '.'

const StyledSearch = styled(Search)`
  position: relative;
  width: 50%;
`

describe('Search', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Search />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    /** workaround the console error */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getComputedStyle } = window
    window.getComputedStyle = (elt) => getComputedStyle(elt)

    const { container } = render(
      <Search aria-label="Expect user to declare label" />,
    )
    await act(async () => {
      const result = await axe(container)
      expect(result).toHaveNoViolations()
    })
  })
  it('Can extend the css for the component', () => {
    render(<StyledSearch data-testid="search" />)
    const search = screen.getByRole('search')
    expect(search).toHaveStyleRule('position', 'relative')
    expect(search).toHaveStyleRule('width', '50%')
  })
  it('Has rendered provided value in input field', () => {
    const value = 'provided value'

    render(<Search value={value} data-testid="search" />)

    const searchInput = screen.getByTestId('search')

    expect(searchInput).toHaveValue(value)
  })
  it('Has called onChange once with event & new value, when value is changed', () => {
    const searchId = 'search-id-when-testing'
    const newValue = 'some new value'
    let callbackId = ''
    let callbackValue = ''
    const handleOnChange = jest.fn(({ target: { id, value } }) => {
      callbackId = id as string
      callbackValue = value as string
    })

    render(
      <Search
        id={searchId}
        value="some old value"
        onChange={handleOnChange}
        data-testid="search"
      />,
    )
    const searchInput = screen.queryByTestId('search')

    fireEvent.change(searchInput, {
      target: { value: newValue },
    })

    expect(handleOnChange).toHaveBeenCalled()
    expect(callbackId).toEqual(searchId)
    expect(callbackValue).toEqual(newValue)
  })

  it('Has cleared value when clear button is clicked', () => {
    const searchId = 'search-id-when-testing'
    let callbackId = ''
    let callbackValue = ''
    const handleOnChange = jest.fn(({ target: { id, value } }) => {
      callbackValue = value as string
      callbackId = id as string
    })

    render(
      <Search
        id={searchId}
        defaultValue="initial value"
        onChange={handleOnChange}
        data-testid="search"
      />,
    )
    const clearButton = screen.queryByRole('button')
    const searchInput = screen.queryByTestId('search')
    fireEvent.click(clearButton)

    expect(handleOnChange).toHaveBeenCalled()
    expect(searchInput).toHaveValue('')
    expect(callbackValue).toEqual('')
    expect(callbackId).toEqual(searchId)
  })

  it('Has called onFocus when search if focused', () => {
    const searchId = 'search-id-when-testing'
    let callbackId = ''
    const handleOnFocus = jest.fn(({ target: { id } }) => {
      callbackId = id as string
    })

    render(
      <Search id={searchId} onFocus={handleOnFocus} data-testid="search" />,
    )
    const searchInput = screen.queryByTestId('search')

    fireEvent.focus(searchInput)

    expect(handleOnFocus).toHaveBeenCalled()
    expect(callbackId).toEqual(searchId)
  })
  it('Has called onBlur when search if blured', () => {
    const searchId = 'search-id-when-testing'
    let callbackId = ''
    const handleOnBlur = jest.fn(({ target: { id } }) => {
      callbackId = id as string
    })

    render(<Search id={searchId} onBlur={handleOnBlur} data-testid="search" />)
    const searchInput = screen.queryByTestId('search')

    fireEvent.blur(searchInput)

    expect(handleOnBlur).toHaveBeenCalled()
    expect(callbackId).toEqual(searchId)
  })

  it('Has new value, when value property is changed after first render', () => {
    const { rerender } = render(<Search value="old" data-testid="search-old" />)

    rerender(<Search value="new" data-testid="search-new" />)

    const searchInput: HTMLInputElement = screen.queryByTestId('search-new')

    expect(searchInput.value).toEqual('new')
  })
})
