/* eslint-disable no-undef */
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Snackbar } from '.'
import { snackbar as tokens } from './Snackbar.tokens'

const StyledSnackbar = styled(Snackbar)`
  clip-path: unset;
`
const message = "Hi, I'm the snackbar"

describe('Snackbar', () => {
  it('Matches snapshot', () => {
    render(<Snackbar open>snacks</Snackbar>)
    const snackbar = screen.getByText('snacks')

    expect(snackbar).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Snackbar open>snacks</Snackbar>)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Can extend the css for the component', () => {
    render(
      <StyledSnackbar open data-testid="test-snackbar">
        {message}
      </StyledSnackbar>,
    )
    expect(screen.getByTestId('test-snackbar')).toHaveStyleRule(
      'clip-path',
      'unset',
    )
  })
  it('Sets the message', () => {
    render(<Snackbar open>{message}</Snackbar>)
    const snackbar = screen.getByText(message)
    expect(snackbar).toBeDefined()
  })
  it('Is only visible when the open prop is true', () => {
    const { rerender } = render(
      <StyledSnackbar open={false} data-testid="test-snackbar-1">
        {message}
      </StyledSnackbar>,
    )
    expect(screen.queryAllByTestId('test-snackbar-1')).toHaveLength(0)
    rerender(
      <StyledSnackbar open data-testid="test-snackbar-2">
        {message}
      </StyledSnackbar>,
    )
    expect(screen.getByTestId('test-snackbar-2')).toBeDefined()
  })
  it('Disappears automatically after a provided timeout', async () => {
    render(
      <Snackbar open autoHideDuration={1000}>
        {message}
      </Snackbar>,
    )
    expect(screen.getByText(message)).toBeDefined()
    await waitForElementToBeRemoved(() => screen.queryByText(message), {
      timeout: 1500,
    })
  })
  it('Can have one button attached', () => {
    const buttonText = "I'm the button"
    render(
      <Snackbar open>
        {message}
        <Snackbar.Action>
          <button type="button">{buttonText}</button>
        </Snackbar.Action>
      </Snackbar>,
    )
    expect(screen.getByText(buttonText)).toBeDefined()
  })
  it('Placement prop is placing the snackbar as expected', () => {
    render(
      <Snackbar open placement="top" data-testid="test-snackbar-3">
        {message}
      </Snackbar>,
    )
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByTestId('test-snackbar-3').parentElement).toHaveStyleRule(
      'top',
      tokens.spacings.top,
    )
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByTestId('test-snackbar-3').parentElement).toHaveStyleRule(
      'left',
      '50%',
    )
  })
})
