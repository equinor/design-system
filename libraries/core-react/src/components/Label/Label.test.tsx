/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { Label } from './Label'

afterEach(cleanup)

describe('Label', () => {
  it('Has correct label text', () => {
    const labelText = 'Some label'
    const { queryByText } = render(<Label label={labelText} />)

    expect(queryByText(labelText)).toBeInTheDocument()
  })

  it('Can add a meta text', () => {
    const labelText = 'Some label'
    const metaText = 'Meta'
    const { queryByText } = render(<Label label={labelText} meta={metaText} />)

    expect(queryByText(metaText)).toBeInTheDocument()
  })

  const StyledLabel = styled(Label)`
    margin-top: 48px;
  `
  it('Can extend the css of the component', () => {
    const labelText = 'Some label'
    const { container } = render(<StyledLabel label={labelText} />)

    expect(container.firstChild).toHaveStyleRule('margin-top', '48px')
  })
})
