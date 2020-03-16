/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Chip } from '.'

const StyledChips = styled(Chip)`
  position: relative;
`

/* <Avatar src="https://i.imgur.com/UM3mrju.jpg"></Avatar> */

afterEach(cleanup)

describe('Chips', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledChips />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
  it('Has provided text', () => {
    const chipText = 'hello, I am a chip'
    const { queryByText } = render(<Chip>{chipText}</Chip>)
    expect(queryByText(chipText)).toBeDefined()
  })
  it('Has provided text', () => {
    const chipText = 'hello, I am a chip'
    const { queryByText } = render(<Chip>{chipText}</Chip>)
    expect(queryByText(chipText)).toBeDefined()
  })
})
