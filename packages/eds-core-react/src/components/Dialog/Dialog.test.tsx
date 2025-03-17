/* eslint-disable no-undef */
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { dialog as tokens } from './Dialog.tokens'
import { Dialog } from '.'
import { useHideBodyScroll, dialogState } from '@equinor/eds-utils'

const { Actions, Title, CustomContent } = Dialog

const { width, minHeight } = tokens

const StyledDialog = styled(Dialog)`
  background: red;
  min-height: ${minHeight};
  width: ${width};
`
//dialog is not yet implemented in jsdom, keep an eye on: https://github.com/jsdom/jsdom/issues/3294
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn()
  HTMLDialogElement.prototype.close = jest.fn()
})

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    configurable: true,
    value: 1000,
  })
})

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

const ScrollLockComponent = ({ active }: { active: boolean }) => {
  useHideBodyScroll(active)
  return <div data-testid="scroll-lock-component">Scroll Lock Test</div>
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
    expect(screen.getByText('OK')).toBeInTheDocument()
    const targetButton = screen.getByText('OK')
    fireEvent.click(targetButton)
    expect(dialog).not.toBeInTheDocument()
  })
  it('Is dismissable with Esc', () => {
    render(<DismissableDialog data-testid="dialog" />)
    const dialog = screen.getByTestId('dialog')

    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
    fireEvent.keyDown(dialog, {
      key: 'Escape',
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
    expect(screen.getByTestId(testIdTitle)).toBeDefined()
    expect(screen.getByTestId(testIdCenter)).toBeDefined()
    expect(screen.getByTestId(testIdActions)).toBeDefined()
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

describe('useHideBodyScroll', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  })

  it('Locks scroll when active is true', () => {
    render(<ScrollLockComponent active={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    expect(parseInt(document.body.style.paddingRight)).toBeGreaterThan(0)
  })

  it('Unlocks scroll when active is false', () => {
    const { rerender } = render(<ScrollLockComponent active={true} />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<ScrollLockComponent active={false} />)
    expect(document.body.style.overflow).toBe(dialogState.originalOverflow)
    expect(document.body.style.paddingRight).toBe(
      dialogState.originalPaddingRight,
    )
  })

  it('Maintains scroll lock when multiple dialogs are open', () => {
    render(<ScrollLockComponent active={true} />)
    expect(document.body.style.overflow).toBe('hidden')

    render(<ScrollLockComponent active={true} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('Unlocks scroll only after all dialogs are closed', () => {
    const { unmount: unmount1 } = render(<ScrollLockComponent active={true} />)
    const { unmount: unmount2 } = render(<ScrollLockComponent active={true} />)

    expect(document.body.style.overflow).toBe('hidden')

    unmount1()
    expect(document.body.style.overflow).toBe('hidden')

    unmount2()
    expect(document.body.style.overflow).toBe('')
  })
})
