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
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Icon', () => {
  it('Has correct svg data', () => {
    const { queryByTestId } = render(<Icon name="save" />)

    expect(queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Has correct color', () => {
    const { container } = render(<Icon name="save" color="red" />)

    expect(container.firstChild).toHaveAttribute('fill', 'red')
  })
  it('Has correct size', () => {
    const { container } = render(<Icon name="save" size={48} />)

    expect(container.firstChild).toHaveAttribute('height', '48')
    expect(container.firstChild).toHaveAttribute('width', '48')
  })
  it('Has correct elements when using title', () => {
    const title = 'Save me'
    const { container, queryAllByTitle } = render(
      <Icon name="save" title={title} />,
    )

    expect(container.firstChild).toHaveAttribute('aria-labelledby')
    expect(container.firstChild).toHaveAttribute('role', 'img')
    expect(queryAllByTitle(title)).toHaveLength(2)
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledIcon name="save" />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('height', '100px')
    expect(container.firstChild).toHaveStyleRule('width', '100px')
  })
})
