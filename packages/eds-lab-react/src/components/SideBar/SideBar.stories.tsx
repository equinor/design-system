import { Story, Meta } from '@storybook/react'

import { dashboard, favorite_outlined, history, home } from '@equinor/eds-icons'
import { SideBar } from '../../components/SideBar'
import { MenuItemType } from '../../components/SideBar/MenuItem'

export default {
  title: 'Components/SideBar',
  body: `
    Supports not having a create action if it isn't needed. Saves current open-state to localStorage with: 'amplify-sidebar-state: boolean'.

  `,
  component: SideBar,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

export const Primary: Story = () => {
  const menuItems: MenuItemType[] = [
    {
      name: 'home',
      icon: home,
      link: 'home',
    },
    {
      name: 'history',
      icon: history,
      link: 'history',
    },
    {
      name: 'favourites',
      icon: favorite_outlined,
      link: 'favourites',
    },
  ]

  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <SideBar
        createLabel="Create story"
        onCreate={() => console.log('Created 🖋')}
      >
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}

export const NoCreateAction: Story = () => {
  const menuItems: MenuItemType[] = [
    {
      name: 'Dashboard',
      icon: dashboard,
      link: 'dashboard',
    },
    {
      name: 'history',
      icon: history,
      link: 'history',
    },
    {
      name: 'favourites',
      icon: favorite_outlined,
      link: 'favourites',
    },
  ]

  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <SideBar>
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}

export const WithCreateAction: Story = () => {
  const menuItems: MenuItemType[] = [
    {
      name: 'Dashboard',
      icon: dashboard,
      link: 'dashboard',
    },
    {
      name: 'history',
      icon: history,
      link: 'history',
    },
    {
      name: 'favourites',
      icon: favorite_outlined,
      link: 'favourites',
    },
  ]

  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <SideBar
        createLabel="Create a diamond"
        onCreate={() => console.log('Created 💎')}
      >
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}

export const WithCurrentUrlAndCreate: Story = () => {
  const menuItems: MenuItemType[] = [
    {
      name: 'Dashboard',
      icon: dashboard,
      link: 'dashboard',
    },
    {
      name: 'history',
      icon: history,
      link: 'history',
    },
    {
      name: 'favourites',
      icon: favorite_outlined,
      link: 'favourites',
    },
  ]

  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <SideBar
        createLabel="Create story"
        onCreate={() => console.log('Created 🖋')}
      >
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}
