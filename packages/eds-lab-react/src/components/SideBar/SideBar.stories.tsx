import { Story, Meta } from '@storybook/react'
import {
  dashboard,
  favorite_outlined,
  history,
  home,
  add,
} from '@equinor/eds-icons'
import { SideBar, SidebarType } from '../../components/SideBar'
import { SidebarItemType } from './SidebarItem'

export default {
  title: 'Components/SideBar',
  body: `
    Sidebar component imported from Amplify

  `,
  component: SideBar,
  args: {
    actionLabel: 'Create story',
    open: true,
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    toggleButton: {
      options: ['top', 'bottom', null],
      control: {
        type: 'select',
      },
    },
  },
} as Meta

export const Primary: Story<SidebarType> = (args) => {
  const menuItems: SidebarItemType[] = [
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
        actionIcon={add}
        onToggle={(toggle) => console.log('toggled ', toggle)}
        onAction={() => console.log('Created 🖋')}
        {...args}
      >
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}

export const NoAction: Story = () => {
  const menuItems: SidebarItemType[] = [
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
      <SideBar toggleButton="top">
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}

export const WithAction: Story = () => {
  const menuItems: SidebarItemType[] = [
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
        actionLabel="Create a diamond"
        actionIcon={add}
        onAction={() => console.log('Created 💎')}
        toggleButton="bottom"
      >
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}

export const WithCurrentUrlAndAction: Story = () => {
  const menuItems: SidebarItemType[] = [
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
        actionLabel="Create story"
        actionIcon={add}
        toggleButton="bottom"
        onAction={() => console.log('Created 🖋')}
      >
        {menuItems.map((m) => (
          <SideBar.Item key={m.name} {...m} />
        ))}
      </SideBar>
    </div>
  )
}
