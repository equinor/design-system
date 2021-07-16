/* eslint-disable no-undef */
import {
  render,
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Snackbar } from '.'

afterEach(cleanup)

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
    expect(screen.queryByText(message)).toBeDefined()
    await waitForElementToBeRemoved(() => screen.queryByText(message))
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
    expect(screen.queryByText(buttonText)).toBeDefined()
  })
})
