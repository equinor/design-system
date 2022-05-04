/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Label } from './Label'

afterEach(cleanup)

describe('Label', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Label label="label" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Label label="Some label text" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with meta', async () => {
    const { container } = render(<Label label="Some label" meta="Meta" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with input', async () => {
    const { container } = render(
      <>
        <Label label="Some label text" htmlFor="input" />
        <input id="input" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Has correct label text', () => {
    const labelText = 'Some label'
    render(<Label label={labelText} />)

    expect(screen.getByText(labelText)).toBeInTheDocument()
  })

  it('Can add a meta text', () => {
    const labelText = 'Some label'
    const metaText = 'Meta'
    render(<Label label={labelText} meta={metaText} />)

    expect(screen.getByText(metaText)).toBeInTheDocument()
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
