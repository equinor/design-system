/* eslint-disable no-undef */
import { useState } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { dialog as tokens } from './Dialog.tokens'
import { Dialog } from '.'

const { Actions, Title, CustomContent } = Dialog

const { width, minHeight } = tokens

const StyledDialog = styled(Dialog)`
  background: red;
  min-height: ${minHeight};
  width: ${width};
`

afterEach(cleanup)

const DismissableDialog = (props) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog onClose={handleClose} open={isOpen} isDismissable {...props}>
      <Title>Title</Title>
      <Actions>
        <button type="button" onClick={handleClose}>
          OK
        </button>
      </Actions>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('Matches snapshot', () => {
    render(
      <Dialog open data-testid="dialog">
        <Title>Title</Title>
        <CustomContent>Description</CustomContent>
        <Actions>
          <button type="button">OK</button>
        </Actions>
      </Dialog>,
    )
    const modalComponent = screen.getByTestId('dialog')
    expect(modalComponent).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Dialog open />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Is dismissable with button click', () => {
    render(<DismissableDialog data-testid="dialog" />)
    const dialog = screen.getByTestId('dialog')

    expect(dialog).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    const targetButton = screen.queryByText('OK')
    fireEvent.click(targetButton)
    expect(dialog).not.toBeInTheDocument()
  })
  it('Is dismissable with Esc', () => {
    render(<DismissableDialog data-testid="dialog" />)
    const dialog = screen.getByTestId('dialog')

    expect(dialog).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    fireEvent.keyDown(dialog, {
      key: 'Escape',
      keyCode: 27,
    })
    expect(dialog).not.toBeInTheDocument()
  })
  it('Has all provided content', () => {
    const testIdTitle = 'dialog-test-title'
    const testIdCenter = 'dialog-test-center'
    const testIdActions = 'dialog-test-actions'

    render(
      <Dialog open>
        <Title>
          <div data-testid={testIdTitle}>Title</div>
        </Title>
        <CustomContent>
          <div data-testid={testIdCenter}>Description</div>
        </CustomContent>
        <Actions>
          <button type="button" data-testid={testIdActions}>
            OK
          </button>
        </Actions>
      </Dialog>,
    )
    expect(screen.queryByTestId(testIdTitle)).toBeDefined()
    expect(screen.queryByTestId(testIdCenter)).toBeDefined()
    expect(screen.queryByTestId(testIdActions)).toBeDefined()
  })
  it('Has scrollable content when scrollable props is present', () => {
    const testIdCenter = 'dialog-test-center'

    render(
      <Dialog open>
        <Title>
          <div>Title</div>
        </Title>
        <CustomContent data-testid={testIdCenter} scrollable>
          <div>Description</div>
        </CustomContent>
        <Actions>
          <button type="button">OK</button>
        </Actions>
      </Dialog>,
    )
    expect(screen.queryByTestId(testIdCenter)).toHaveStyleRule(
      'overflow-y',
      'auto',
    )
  })

  it('Can extend the css for the component', () => {
    render(<StyledDialog open data-testid="dialog" />)
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveStyleRule('background', 'red')
    expect(dialog).toHaveStyleRule('width', width)
    expect(dialog).toHaveStyleRule('min-height', minHeight)
  })
})
