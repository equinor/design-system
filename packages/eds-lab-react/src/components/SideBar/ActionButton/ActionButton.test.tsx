import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionButton, ActionButtonProps } from './index'
import { SideBar } from '../SideBar'
import { add } from '@equinor/eds-icons'

const defaultProps: ActionButtonProps = {
  label: 'Label',
  isOpen: false,
  icon: add,
  onAction: () => undefined,
}

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { ...options })

function SideBarWrapper(children: React.ReactChildren, isOpen?: boolean) {
  return <SideBar open={isOpen}>{children}</SideBar>
}

test('ActionButton Renders', () => {
  customRender(<ActionButton {...defaultProps}></ActionButton>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })
})

test('Renders label when open', () => {
  customRender(
    <ActionButton
      label="Label"
      icon={add}
      isOpen={true}
      onAction={() => undefined}
    ></ActionButton>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test('Renders label when open', () => {
  customRender(
    <ActionButton
      label="Label"
      icon={add}
      isOpen={true}
      onAction={() => undefined}
    ></ActionButton>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test("Doesn't render label when closed", () => {
  customRender(<ActionButton {...defaultProps}></ActionButton>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })

  expect(screen.queryByText('Label')).not.toBeInTheDocument()
})

test('Fires onAction when clicked', () => {
  const onActionFn = jest.fn()

  customRender(
    <ActionButton
      icon={add}
      label="Label"
      isOpen={true}
      onAction={onActionFn}
    ></ActionButton>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )

  const btn = screen.getByText('Label')

  userEvent.click(btn)

  expect(onActionFn).toHaveBeenCalledTimes(1)
})
