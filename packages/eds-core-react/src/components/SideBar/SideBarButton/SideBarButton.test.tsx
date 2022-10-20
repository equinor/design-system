import React from 'react'
import { render, screen, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SideBarButton, SideBarButtonProps } from './index'
import { SideBar } from '../SideBar'
import { add } from '@equinor/eds-icons'

const defaultProps: SideBarButtonProps = {
  label: 'Label',
  icon: add,
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { ...options })

function SideBarWrapperOpen(children: React.ReactElement) {
  return <SideBar open={true}>{children}</SideBar>
}
function SideBarWrapperClosed(children: React.ReactElement) {
  return <SideBar open={false}>{children}</SideBar>
}

test('SideBarButton Renders', () => {
  customRender(<SideBarButton {...defaultProps}></SideBarButton>, {
    wrapper: ({ children }) => SideBarWrapperOpen(children),
  })
})

test('Renders label when open', () => {
  customRender(<SideBarButton label="Label" icon={add}></SideBarButton>, {
    wrapper: ({ children }) => SideBarWrapperOpen(children),
  })
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test('Renders label when open', () => {
  customRender(<SideBarButton label="Label" icon={add}></SideBarButton>, {
    wrapper: ({ children }) => SideBarWrapperOpen(children),
  })
  expect(screen.getByText('Label')).toBeInTheDocument()
})

test("Doesn't render label when closed", () => {
  customRender(<SideBarButton {...defaultProps}></SideBarButton>, {
    wrapper: ({ children }) => SideBarWrapperClosed(children),
  })

  expect(screen.queryByText('Label')).not.toBeInTheDocument()
})

test('Fires onClick when clicked', async () => {
  const onActionFn = jest.fn()

  customRender(
    <SideBarButton
      icon={add}
      label="Label"
      onClick={onActionFn}
    ></SideBarButton>,
    {
      wrapper: ({ children }) => SideBarWrapperOpen(children),
    },
  )

  const btn = screen.getByText('Label')

  await userEvent.click(btn)

  expect(onActionFn).toHaveBeenCalledTimes(1)
})
