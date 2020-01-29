/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Icon } from '.'

const testIcon = {
  prefix: 'eds',
  height: '24',
  width: '24',
  svgPathData:
    'M7 10H5V5h5v2H7v3zm-2 4h2v3h3v2H5v-5zm12 3h-3v2h5v-5h-2v3zM14 7V5h5v5h-2V7h-3z',
}

Icon.add({ testIcon })

const StyledIcon = styled(Icon)`
  position: relative;
`

afterEach(cleanup)

describe('Icon', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledIcon name="testIcon" />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
})
