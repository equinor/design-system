import { render, cleanup, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Search } from '.'

const StyledSearch = styled(Search)`
  position: relative;
  width: 50%;
`

afterEach(cleanup)

describe('Search', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Search />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Search />)
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

    render(<Search value={value} />)

    const searchBox = screen.queryByRole('searchbox')

    expect(searchBox).toHaveValue(value)
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
      <Search id={searchId} value="some old value" onChange={handleOnChange} />,
    )
    const searchBox = screen.queryByRole('searchbox')

    fireEvent.change(searchBox, {
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
      />,
    )
    const clearButton = screen.queryByRole('button')
    const searchBox = screen.queryByRole('searchbox')

    fireEvent.click(clearButton)

    expect(handleOnChange).toHaveBeenCalled()
    expect(searchBox).toHaveValue('')
    expect(callbackValue).toEqual('')
    expect(callbackId).toEqual(searchId)
  })

  it('Has called onFocus when search if focused', () => {
    const searchId = 'search-id-when-testing'
    let callbackId = ''
    const handleOnFocus = jest.fn(({ target: { id } }) => {
      callbackId = id as string
    })

    render(<Search id={searchId} onFocus={handleOnFocus} />)
    const searchBox = screen.queryByRole('searchbox')

    fireEvent.focus(searchBox)

    expect(handleOnFocus).toHaveBeenCalled()
    expect(callbackId).toEqual(searchId)
  })
  it('Has called onBlur when search if blured', () => {
    const searchId = 'search-id-when-testing'
    let callbackId = ''
    const handleOnBlur = jest.fn(({ target: { id } }) => {
      callbackId = id as string
    })

    render(<Search id={searchId} onBlur={handleOnBlur} />)
    const searchBox = screen.queryByRole('searchbox')

    fireEvent.blur(searchBox)

    expect(handleOnBlur).toHaveBeenCalled()
    expect(callbackId).toEqual(searchId)
  })

  it('Has new value, when value property is changed after first render', () => {
    const { rerender } = render(<Search value="old" />)

    rerender(<Search value="new" />)

    const searchBox: HTMLInputElement = screen.queryByRole('searchbox')

    expect(searchBox.value).toEqual('new')
  })
})
