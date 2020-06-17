/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Breadcrumbs } from '.'

const { Breadcrumb } = Breadcrumbs

const StyledBreadcrumbs = styled(Breadcrumbs)`
  position: absolute;
`

const StyledBreadcrumb = styled(Breadcrumb)`
  position: absolute;
`

afterEach(cleanup)

describe('Breadcrumbs', () => {
  it('can extend the css for the component', () => {
    render(
      <StyledBreadcrumbs>
        <StyledBreadcrumb>Hei</StyledBreadcrumb>
      </StyledBreadcrumbs>,
    )
    const breadcrumbs = screen.getByRole('breadcrumbs')
    expect(breadcrumbs).toHaveStyleRule('position', 'absolute')
  })
})
