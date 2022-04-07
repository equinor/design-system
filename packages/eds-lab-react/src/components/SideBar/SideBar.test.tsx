import React from 'react'
import { render, screen } from '@testing-library/react'
//import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { SideBar } from '.'
import { SidebarItemType } from './SidebarItem'
import { home, star_half } from '@equinor/eds-icons'

const defaultMenuItems: SidebarItemType[] = [
  {
    name: 'Home',
    icon: home,
  },
  {
    name: 'Another Link',
    icon: star_half,
  },
]

test('Sidebar renders', () => {
  const currentUrl = 'home'
  render(
    <SideBar>
      {defaultMenuItems.map((m) => {
        return <SideBar.Item key={m.name} currentUrl={currentUrl} {...m} />
      })}
    </SideBar>,
  )
})

test('Renders action button when onAction, actionLabel and actionIcon props are given', () => {
  render(
    <SideBar
      onAction={() => console.log('test')}
      actionLabel="actionLabel"
      actionIcon={home}
      open={true}
    >
      {defaultMenuItems.map((m) => (
        <SideBar.Item key={m.name} {...m} />
      ))}
    </SideBar>,
  )
  expect(screen.getByText('actionLabel')).toBeInTheDocument()
})

test('Renders closed width when closed', () => {
  render(
    <SideBar open={false}>
      {defaultMenuItems.map((m) => (
        <SideBar.Item key={m.name} {...m} />
      ))}
    </SideBar>,
  )

  expect(screen.getAllByRole('generic')[2]).toHaveStyle({ width: '72px' })
})

test('Renders open width when open', () => {
  render(
    <SideBar open={true}>
      {defaultMenuItems.map((m) => (
        <SideBar.Item key={m.name} {...m} />
      ))}
    </SideBar>,
  )

  expect(screen.getAllByRole('generic')[2]).toHaveStyle({ width: '256px' })
})

test('Triggers onToggle callback when closed', () => {
  const cb = jest.fn()
  render(
    <SideBar open={true} onToggle={cb}>
      {defaultMenuItems.map((m) => (
        <SideBar.Item key={m.name} {...m} />
      ))}
    </SideBar>,
  )

  const collapse = screen.getByRole('button', { name: /collapse/i })
  userEvent.click(collapse)

  expect(cb).toHaveBeenCalled()
})

test('Triggers onToggle callback when opened', () => {
  const cb = jest.fn()
  render(
    <SideBar open={false} onToggle={cb}>
      {defaultMenuItems.map((m) => (
        <SideBar.Item key={m.name} {...m} />
      ))}
    </SideBar>,
  )

  const expand = screen.getByRole('button')
  userEvent.click(expand)

  expect(cb).toHaveBeenCalled()
})

test('onToggle send correct state back', () => {
  const toggle = jest.fn()
  render(
    <SideBar open={false} onToggle={toggle}>
      {defaultMenuItems.map((m) => (
        <SideBar.Item key={m.name} {...m} />
      ))}
    </SideBar>,
  )

  const expand = screen.getByRole('button')
  userEvent.click(expand)

  expect(toggle).toBeCalled()
  expect(toggle).toHaveBeenCalledWith(true) // Since we send in false to start with
})
