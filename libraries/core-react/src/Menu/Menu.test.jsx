/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Menu } from '.'

const StyledMenu = styled(Menu)`
  background: red;
`

afterEach(cleanup)

describe('Menu', () => {
  it('Can extend the css for the component', () => {
    render(
      <StyledMenu open>
        <div>some random content</div>
      </StyledMenu>,
    )
    const menuContainer = screen.queryByRole('menu').parentElement

    expect(menuContainer).toHaveStyleRule('background', 'red')
  })
})
