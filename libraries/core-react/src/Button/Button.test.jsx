/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { save } from '@equinor/eds-icons'
import { Button, Icon } from '..'
import { button } from './Button.tokens'

const {
  colors: {
    // eslint-disable-next-line camelcase
    primary: { ghost_icon },
  },
} = button

Icon.add({ save })

const StyledButton = styled(Button)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Button', () => {
  it('Has provided icon when variant is icon', () => {
    const { queryByTestId, container } = render(
      <Button variant="ghost_icon">
        <Icon name="save" />
      </Button>,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Has circular border when variant is icon & focused', () => {
    const { container } = render(
      <Button variant="ghost_icon">
        <Icon name="save" />
      </Button>,
    )
    container.focus()

    expect(container.firstChild).toHaveStyleRule(
      'border-radius',
      ghost_icon.focus.radius,
    )
  })
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledButton name="save">Test me!</StyledButton>,
    )
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('height', '100px')
    expect(container.firstChild).toHaveStyleRule('width', '100px')
  })
})
