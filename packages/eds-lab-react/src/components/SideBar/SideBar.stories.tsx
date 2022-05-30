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
      <SideBar {...args}>
        <SideBar.Content>
          {menuItems.map((m) => (
            <SideBar.Item key={m.name} {...m} />
          ))}
        </SideBar.Content>
        <SideBar.Footer>
          <SideBar.Toggle />
        </SideBar.Footer>
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
      <SideBar
        toggleButton="top"
        onToggle={(toggle) => console.log('toggled test ', toggle)}
      >
        <SideBar.Content>
          <SideBar.Toggle />
          {menuItems.map((m) => (
            <SideBar.Item key={m.name} {...m} />
          ))}
        </SideBar.Content>
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
        <SideBar.Content>
          {menuItems.map((m) => (
            <SideBar.Item key={m.name} {...m} />
          ))}
        </SideBar.Content>
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
        <SideBar.Content>
          {menuItems.map((m) => (
            <SideBar.Item key={m.name} {...m} />
          ))}
        </SideBar.Content>
      </SideBar>
    </div>
  )
}
