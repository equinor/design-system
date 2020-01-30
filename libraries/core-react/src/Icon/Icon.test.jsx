/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { save } from '@equinor/eds-icons'
import { Icon } from '.'

Icon.add({ save })

const StyledIcon = styled(Icon)`
  position: relative;
`

afterEach(cleanup)

describe('Icon', () => {
  it('Has correct svg data', () => {
    const { queryByTestId } = render(<StyledIcon name="save" />)

    expect(queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Has correct color', () => {
    const { container } = render(<StyledIcon name="save" color="red" />)

    expect(container.firstChild).toHaveAttribute('fill', 'red')
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledIcon name="save" />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
})
