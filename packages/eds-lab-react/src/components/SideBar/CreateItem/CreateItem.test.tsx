import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateItem, CreateItemProps } from './index'
import { SideBar } from '../SideBar'

const defaultProps: CreateItemProps = {
  createLabel: 'Label',
  isOpen: false,
  onCreate: () => undefined,
}

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { ...options })

function SideBarWrapper(children: React.ReactChildren, isOpen?: boolean) {
  return <SideBar open={isOpen}>{children}</SideBar>
}

test('CreateItem Renders', () => {
  customRender(<CreateItem {...defaultProps}></CreateItem>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })
})

test('Renders label when open', () => {
  customRender(
    <CreateItem
      createLabel="Label"
      isOpen={true}
      onCreate={() => undefined}
    ></CreateItem>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test('Renders label when open', () => {
  customRender(
    <CreateItem
      createLabel="Label"
      isOpen={true}
      onCreate={() => undefined}
    ></CreateItem>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test("Doesn't render label when closed", () => {
  customRender(<CreateItem {...defaultProps}></CreateItem>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })

  expect(screen.queryByText('Label')).not.toBeInTheDocument()
})

test('Fires onCreate when clicked', () => {
  const onCreateFn = jest.fn()

  customRender(
    <CreateItem
      createLabel="Label"
      isOpen={true}
      onCreate={onCreateFn}
    ></CreateItem>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )

  const btn = screen.getByText('Label')

  userEvent.click(btn)

  expect(onCreateFn).toHaveBeenCalledTimes(1)
})
