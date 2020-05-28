/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Search } from '.'

const StyledSearch = styled(Search)`
  position: relative;
  width: 50%;
`

afterEach(cleanup)

describe('Search', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSearch />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('width', '50%')
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
      callbackId = id
      callbackValue = value
    })

    render(<Search id={searchId} onChange={handleOnChange} />)
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
      callbackValue = value
      callbackId = id
    })

    render(
      <Search id={searchId} value="initial value" onChange={handleOnChange} />,
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
      callbackId = id
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
      callbackId = id
    })

    render(<Search id={searchId} onBlur={handleOnBlur} />)
    const searchBox = screen.queryByRole('searchbox')

    fireEvent.blur(searchBox)

    expect(handleOnBlur).toHaveBeenCalled()
    expect(callbackId).toEqual(searchId)
  })
})
