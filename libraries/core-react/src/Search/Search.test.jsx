/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Search } from '.'
import { search as tokens } from './Search.tokens'

const StyledSearch = styled(Search)`
  position: relative;
`

const {} = tokens

const rgbaTrim = (x) => x.split(' ').join('')

afterEach(cleanup)

describe('Search', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSearch />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
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
})
