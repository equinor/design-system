/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { Label } from './Label'

afterEach(cleanup)

describe('Label', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Label label="label" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has correct label text', () => {
    const labelText = 'Some label'
    render(<Label label={labelText} />)

    expect(screen.queryByText(labelText)).toBeInTheDocument()
  })

  it('Can add a meta text', () => {
    const labelText = 'Some label'
    const metaText = 'Meta'
    render(<Label label={labelText} meta={metaText} />)

    expect(screen.queryByText(metaText)).toBeInTheDocument()
  })

  const StyledLabel = styled(Label)`
    margin-top: 48px;
  `
  it('Can extend the css of the component', () => {
    const labelText = 'Some label'
    render(<StyledLabel label={labelText} data-testid="label" />)

    expect(screen.getByTestId('label')).toHaveStyleRule('margin-top', '48px')
  })
})
