import React from 'react'
import { render, screen, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SideBarButtonProps } from './index'
import { SideBar } from '../'
import { add } from '@equinor/eds-icons'

const defaultProps: SideBarButtonProps = {
  label: 'Label',
  icon: add,
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { ...options })

function SideBarWrapperOpen(children: React.ReactNode) {
  return <SideBar open={true}>{children}</SideBar>
}
function SideBarWrapperClosed(children: React.ReactNode) {
  return <SideBar open={false}>{children}</SideBar>
}

test('SideBarButton Renders', () => {
  customRender(<SideBar.Button {...defaultProps}></SideBar.Button>, {
    wrapper: ({ children }) => SideBarWrapperOpen(children),
  })
})

test('Renders label when open', () => {
  customRender(<SideBar.Button label="Label" icon={add}></SideBar.Button>, {
    wrapper: ({ children }) => SideBarWrapperOpen(children),
  })
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test('Renders label when open', () => {
  customRender(<SideBar.Button label="Label" icon={add}></SideBar.Button>, {
    wrapper: ({ children }) => SideBarWrapperOpen(children),
  })
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test("Doesn't render label when closed", () => {
  customRender(<SideBar.Button {...defaultProps}></SideBar.Button>, {
    wrapper: ({ children }) => SideBarWrapperClosed(children),
  })

  expect(screen.queryByText('Label')).not.toBeInTheDocument()
})

test('Fires onClick when clicked', async () => {
  const onActionFn = jest.fn()

  customRender(
    <SideBar.Button
      icon={add}
      label="Label"
      onClick={onActionFn}
    ></SideBar.Button>,
    {
      wrapper: ({ children }) => SideBarWrapperOpen(children),
    },
  )

  const btn = screen.getByText('Label')

  await userEvent.click(btn)

  expect(onActionFn).toHaveBeenCalledTimes(1)
})
