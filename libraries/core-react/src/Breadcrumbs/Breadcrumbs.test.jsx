/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Breadcrumbs } from '.'

const { Breadcrumb } = Breadcrumbs

const StyledBreadcrumbs = styled(Breadcrumbs)`
  position: absolute;
  width: 100px;
`

afterEach(cleanup)

describe('Breadcrumbs', () => {
  it('can extend the css for the component', () => {
    const { container } = render(
      <StyledBreadcrumbs>
        <Breadcrumb>Breadcrumb</Breadcrumb>
      </StyledBreadcrumbs>,
    )
    expect(container).toHaveStyleRule('position', 'absolute')
  })
})
