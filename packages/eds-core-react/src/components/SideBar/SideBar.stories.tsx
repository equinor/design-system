import { StoryFn, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import styled from 'styled-components'
import {
  dashboard,
  favorite_outlined,
  history,
  home,
  add,
  business,
  gas,
  lock,
} from '@equinor/eds-icons'
import {
  TopBar,
  Divider,
  SideBar,
  SidebarType,
  SidebarLinkProps,
  useSideBar,
  Menu,
  Typography,
} from '../..'
import page from './SideBar.docs.mdx'

const meta: Meta<typeof SideBar> = {
  title: 'Navigation/SideBar',
  component: SideBar,
  subcomponents: {
    Content: SideBar.Content,
    Footer: SideBar.Footer,
    Link: SideBar.Link,
    Toggle: SideBar.Toggle,
    Button: SideBar.Button,
    Accordion: SideBar.Accordion,
    AccordionItem: SideBar.AccordionItem,
  },
  args: {
    open: true,
  },
  parameters: {
    docs: {
      page,
    },
  },
}

export default meta

const SidebarContainer = styled.div`
  height: 60vh;
  margin: -30px -20px;
`

export const Primary: StoryFn<SidebarType> = (args) => {
  const menuItems: SidebarLinkProps[] = [
    {
      label: 'home',
      icon: home,
    },
    {
      label: 'history',
      icon: history,
    },
    {
      label: 'favourites',
      icon: favorite_outlined,
    },
  ]

  return (
    <Container>
      <SideBar {...args}>
        <SideBar.Content>
          <SideBar.Toggle />
          {menuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
      </SideBar>
    </Container>
  )
}

const LogoContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  height: 36px;
  display: grid;
  place-items: center;
`

const LogoOpen = () => (
  <svg
    width="96"
    height="36"
    viewBox="0 0 75 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M55.485 5.72v6.653c0 .197.099.38.27.478l5.764 3.32a.372.372 0 0 0 .557-.317V9.2a.55.55 0 0 0-.276-.477l-5.764-3.321a.367.367 0 0 0-.551.318ZM73.24.527l-8.299 4.781a.792.792 0 0 0-.397.688v9.577c0 .407.45.66.801.458l8.3-4.781a.784.784 0 0 0 .387-.688V.984c0-.407-.44-.66-.792-.458Zm-11.384 20.37-2.307 1.329a.22.22 0 0 0-.11.191v2.662c0 .113.125.183.223.127l2.306-1.329a.217.217 0 0 0 .108-.19v-2.663a.147.147 0 0 0-.22-.127ZM60.51 18.44l-3.453-1.998a.331.331 0 0 0-.331 0l-3.454 1.998a.22.22 0 0 0 0 .381l3.454 1.999a.33.33 0 0 0 .33 0l3.454-1.998a.22.22 0 0 0 0-.382Zm5.561.36 1.535.889c.09.052.203.052.294 0l1.534-.888a.196.196 0 0 0 0-.34l-1.534-.887a.293.293 0 0 0-.294 0l-1.535.888a.196.196 0 0 0 0 .339Zm-1.234 2.138 1.536.885c.09.052.147.15.147.254l-.002 1.773c0 .15-.163.245-.293.17l-1.537-.885a.293.293 0 0 1-.145-.255v-1.773c0-.15.163-.245.294-.17Zm-15.626-1.752c-.061-.153-.19-.208-.336-.122l-2.868 1.709v-1.496c0-.168-.107-.229-.26-.168l-.885.321c-.122.046-.168.137-.168.26v6.575c0 .137.092.229.23.229h.854c.137 0 .229-.092.229-.23v-4.027s3.211-1.982 3.341-2.06c.13-.078.197-.144.138-.29-.065-.16-.275-.701-.275-.701ZM1.904 21.96c.29-1.052 1.114-1.693 2.274-1.693 1.266 0 1.937.747 1.998 1.693H1.904Zm5.661.397c0-1.831-1.251-3.372-3.342-3.372-2.06 0-3.769 1.48-3.769 3.891 0 2.198 1.434 3.8 3.846 3.8 1.098 0 2.197-.382 3.021-1.114.107-.092.107-.214.03-.32L6.94 24.6c-.077-.122-.199-.137-.32-.045-.749.549-1.512.824-2.32.824-1.542 0-2.381-1.008-2.488-2.274H7.34a.216.216 0 0 0 .226-.226v-.522Zm4.814 3.022c-1.297 0-2.411-.885-2.411-2.564s1.114-2.548 2.411-2.548c1.358 0 2.411.87 2.411 2.548 0 1.694-1.053 2.564-2.411 2.564Zm2.625 4.166h.854c.137 0 .229-.092.229-.23v-10.04c0-.168-.107-.23-.275-.168l-.87.32c-.121.046-.167.138-.167.26v.32c-.473-.64-1.404-1.022-2.411-1.022-2 0-3.739 1.495-3.739 3.845 0 2.076 1.343 3.846 3.662 3.846 1.053 0 2.06-.473 2.488-1.007v3.647c0 .137.091.229.229.229Zm5.43-2.87c.793 0 1.663-.259 2.228-1.083v.672c0 .137.091.229.229.229h.854c.138 0 .23-.092.23-.23v-6.973c0-.183-.108-.244-.26-.183l-.885.32c-.122.046-.168.138-.168.26v3.662c0 1.297-.84 2.03-1.984 2.03-1.129 0-1.892-.717-1.892-2.03v-4.074c0-.168-.107-.23-.26-.168l-.884.32c-.123.046-.168.138-.168.26v3.708c0 2.167 1.312 3.28 2.96 3.28Zm5.325-8.346.931-.306c.153-.046.214-.122.214-.274v-1.114c0-.137-.107-.244-.275-.183l-.915.335c-.138.046-.214.107-.214.26v1.068c0 .168.092.275.26.214Zm.016 8.164h.854c.138 0 .23-.092.23-.23v-6.988c0-.168-.108-.23-.26-.168l-.885.32c-.122.046-.168.138-.168.26v6.577c0 .137.091.229.229.229Zm2.884 0h.854c.137 0 .229-.092.229-.23v-3.952c0-1.297.84-2.03 1.984-2.03 1.129 0 1.892.718 1.892 2.03v3.953c0 .137.091.229.229.229h.855c.137 0 .228-.092.228-.23v-3.997c0-2.167-1.312-3.281-2.96-3.281-.793 0-1.663.26-2.228 1.083v-.793c0-.168-.107-.23-.26-.168l-.885.32c-.122.046-.167.138-.167.26v6.577c0 .137.091.229.229.229Zm11.161-1.1c-1.51 0-2.426-1.128-2.426-2.563 0-1.434.916-2.563 2.426-2.563 1.496 0 2.411 1.129 2.411 2.563 0 1.435-.915 2.564-2.41 2.564Zm0-6.408c-2.197 0-3.769 1.633-3.769 3.845 0 2.213 1.572 3.846 3.77 3.846 2.197 0 3.753-1.633 3.753-3.846 0-2.212-1.556-3.845-3.754-3.845Z"
      fill="#eb0037"
    />
  </svg>
)

const LogoClosed = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 42 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.333 10.204v12.892c0 .382.192.735.523.926l11.17 6.435c.474.273 1.079-.069 1.079-.616V16.95c0-.382-.204-.735-.535-.926L6.4 9.589a.712.712 0 0 0-1.067.615ZM39.74.138 23.657 9.403c-.476.275-.77.783-.769 1.333v18.56c0 .787.87 1.279 1.553.886l16.082-9.264a1.52 1.52 0 0 0 .751-1.333V1.025c0-.788-.852-1.28-1.535-.887ZM17.68 39.612l-4.47 2.575a.428.428 0 0 0-.214.37v5.158c0 .22.242.356.432.247l4.469-2.575a.422.422 0 0 0 .209-.37v-5.158a.285.285 0 0 0-.427-.247Zm-2.605-4.759L8.38 30.98a.642.642 0 0 0-.64 0l-6.694 3.873a.427.427 0 0 0 0 .739l6.693 3.872a.638.638 0 0 0 .641 0l6.694-3.872a.427.427 0 0 0 0-.739Zm10.775.698 2.974 1.72a.568.568 0 0 0 .57 0l2.973-1.72a.38.38 0 0 0 0-.657l-2.974-1.72a.568.568 0 0 0-.57 0l-2.973 1.72a.38.38 0 0 0 0 .657Zm-2.392 4.141 2.977 1.715a.57.57 0 0 1 .285.494l-.004 3.435a.38.38 0 0 1-.569.329L23.17 43.95a.567.567 0 0 1-.28-.494l-.001-3.435a.38.38 0 0 1 .569-.329Z"
      fill="#eb0037"
    />
  </svg>
)

export const CustomContent: StoryFn<SidebarType> = () => {
  const menuItems: SidebarLinkProps[] = [
    {
      label: 'Dashboard',
      icon: dashboard,
    },
    {
      label: 'history',
      icon: history,
    },
    {
      label: 'favourites',
      icon: favorite_outlined,
    },
  ]
  const Logo = () => {
    const { isOpen } = useSideBar()
    return (
      <LogoContainer>{isOpen ? <LogoOpen /> : <LogoClosed />}</LogoContainer>
    )
  }

  return (
    <SidebarContainer>
      <SideBar onToggle={(toggle) => console.log('SideBar expanded ', toggle)}>
        <SideBar.Content>
          {menuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
        <SideBar.Footer>
          <SideBar.Toggle />
          <Divider size="2" color="light" style={{ marginBlock: 0 }} />
          <Logo />
        </SideBar.Footer>
      </SideBar>
    </SidebarContainer>
  )
}

export const WithButton: StoryFn<SidebarType> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }
  const menuItems: SidebarLinkProps[] = [
    {
      label: 'Dashboard',
      icon: dashboard,
    },
    {
      label: 'history',
      icon: history,
    },
    {
      label: 'favourites',
      icon: favorite_outlined,
    },
  ]

  return (
    <SidebarContainer>
      <SideBar>
        <SideBar.Content>
          <SideBar.Button
            label="Add story"
            icon={add}
            onClick={() => (isOpen ? closeMenu() : openMenu())}
            ref={setAnchorEl}
          />
          <Divider size="2" color="light" style={{ marginBlockEnd: 0 }} />
          {menuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
        <SideBar.Footer>
          <SideBar.Toggle />
        </SideBar.Footer>
      </SideBar>
      <Menu
        open={isOpen}
        onClose={closeMenu}
        anchorEl={anchorEl}
        placement="right-start"
      >
        <Menu.Section title="Add story">
          <Menu.Item onClick={closeMenu}>Featured story</Menu.Item>
          <Menu.Item onClick={closeMenu}>News article</Menu.Item>
          <Menu.Item onClick={closeMenu}>Blog post</Menu.Item>
        </Menu.Section>
      </Menu>
    </SidebarContainer>
  )
}

export const ActivePath: StoryFn<SidebarType> = () => {
  type LinkProps = SidebarLinkProps & {
    href: string
  }
  const menuItems: LinkProps[] = [
    {
      label: 'Dashboard',
      icon: dashboard,
      href: '#',
      active: true,
    },
    {
      label: 'history',
      icon: history,
      href: '#',
      active: false,
    },
    {
      label: 'favourites',
      icon: favorite_outlined,
      href: '#',
      active: false,
    },
  ]

  return (
    <SidebarContainer>
      <SideBar>
        <SideBar.Content>
          {menuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
        <SideBar.Footer>
          <SideBar.Toggle />
        </SideBar.Footer>
      </SideBar>
    </SidebarContainer>
  )
}
const SidebarContainerWithTopbar = styled(SidebarContainer)`
  display: grid;
  grid-template-rows: auto 1fr;
`

export const WithTopbar: StoryFn<SidebarType> = () => {
  const menuItems: SidebarLinkProps[] = [
    {
      label: 'Dashboard',
      icon: dashboard,
    },
    {
      label: 'history',
      icon: history,
    },
    {
      label: 'favourites',
      icon: favorite_outlined,
    },
  ]

  return (
    <SidebarContainerWithTopbar>
      <TopBar sticky={false}>
        <TopBar.Header>
          <LogoClosed /> Application label - subtitle
        </TopBar.Header>
      </TopBar>
      <SideBar>
        <SideBar.Content>
          <SideBar.Button
            label="Create story"
            icon={add}
            onClick={() => console.log('clicked')}
          />
          <Divider size="2" color="light" style={{ marginBlockEnd: 0 }} />
          {menuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
        <SideBar.Footer>
          <Divider size="2" color="light" style={{ marginBlockEnd: 0 }} />
          <SideBar.Toggle />
        </SideBar.Footer>
      </SideBar>
    </SidebarContainerWithTopbar>
  )
}

const Container = styled.div`
  height: 60vh;
  margin: -30px -20px;
  display: flex;
  flex-direction: row;
`

export const WithAccordion: StoryFn<SidebarType> = () => {
  return (
    <Container>
      <SideBar>
        <SideBar.Content>
          <SideBar.Toggle />
          <SideBar.Link label="Home" icon={home} />
          <SideBar.Link label="Getting started" icon={business} />
          <SideBar.Accordion label="Un-controlled" icon={gas}>
            <SideBar.AccordionItem label={'Tools'} />
            <SideBar.AccordionItem label={'Fields'} />
            <SideBar.AccordionItem label={'Reports'} />
            <SideBar.AccordionItem label={'Archived'} />
          </SideBar.Accordion>
          <SideBar.Accordion
            label="Controlled"
            icon={favorite_outlined}
            isExpanded={true}
          >
            <SideBar.AccordionItem label={'Saved Items'} />
            <SideBar.AccordionItem label={'Work in progress'} />
            <SideBar.AccordionItem label={'Reports'} />
          </SideBar.Accordion>
          <SideBar.Accordion
            label="Disabled"
            icon={lock}
            disabled
          ></SideBar.Accordion>
        </SideBar.Content>
      </SideBar>
    </Container>
  )
}

const Content = styled.div`
  padding: 2rem;
`
const Headline = styled.h1``

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquam magna et mi pellentesque mattis. Etiam tempus tortor eget tellus dictum, eget ultrices tortor aliquet. Nullam a tincidunt lectus, sit amet finibus orci. Ut ac egestas mauris, at iaculis odio. Proin a risus at ligula volutpat rutrum ac sodales mauris. Etiam scelerisque, nunc ut ornare tristique, nisl velit dignissim neque, ac ultricies nibh lorem nec ipsum. In pellentesque diam sit amet turpis pellentesque malesuada. Ut lacus tortor, rutrum ac diam in, tempus tempus nisl. Cras tincidunt orci a neque molestie, ut lobortis quam varius. Fusce posuere, libero eu dictum malesuada, arcu nisl scelerisque metus, a mollis enim urna vel neque. Maecenas tincidunt odio at turpis elementum, vel finibus sem mattis. Suspendisse volutpat maximus diam, eget auctor urna ultrices ac. Donec finibus purus sem, vitae interdum nulla volutpat ut.'
const ipsum =
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam maximus blandit leo ac accumsan. Integer facilisis porta elit, vel dictum lacus viverra et. Nullam ultricies tempor tincidunt. Vestibulum venenatis vulputate augue quis iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas luctus dignissim velit a volutpat.'

const homePage = (
  <Content>
    <Headline>Home</Headline>
    <Typography>{lorem}</Typography>
    <Typography>{ipsum}</Typography>
  </Content>
)

const gettingStartedPage = (
  <Content>
    <Headline>Getting started</Headline>
    <Typography>{ipsum}</Typography>
  </Content>
)

const toolsPage = (
  <Content>
    <Headline>Tools</Headline>
    <Typography>{ipsum}</Typography>
    <Typography>{lorem}</Typography>
  </Content>
)

const fieldsPage = (
  <Content>
    <Headline>Fields</Headline>
    <Typography>{lorem}</Typography>
  </Content>
)

const reportsPage = (
  <Content>
    <Headline>Reports</Headline>
    <Typography>{lorem}</Typography>
    <Typography>{ipsum}</Typography>
  </Content>
)

const archivedPage = (
  <Content>
    <Headline>Archived</Headline>
    <Typography>{ipsum}</Typography>
  </Content>
)

const savedItemsPage = (
  <Content>
    <Headline>Saved Items</Headline>
    <Typography>{lorem}</Typography>
  </Content>
)

const workInProgressPage = (
  <Content>
    <Headline>Work In Progress</Headline>
    <Typography>{lorem}</Typography>
    <Typography>{ipsum}</Typography>
  </Content>
)

export const WithRouting: StoryFn<SidebarType> = () => {
  const [selected, setSelected] = useState<string>('')

  const sidebarLinks = [
    { label: 'Home', icon: home, name: 'home' },
    { label: 'Getting started', icon: business, name: 'gettingStarted' },
  ]

  const sidebarAccordions = [
    {
      label: 'Gas',
      icon: gas,
      children: [
        { label: 'Tools', name: 'tools' },
        { label: 'Fields', name: 'fields' },
        { label: 'Reports', name: 'reports' },
        { label: 'Archived', name: 'archived' },
      ],
    },
    {
      label: 'Favorites',
      icon: favorite_outlined,
      children: [
        { label: 'Saved Items', name: 'savedItems' },
        { label: 'Work in progress', name: 'workInProgress' },
      ],
    },
  ]

  const selectPage = (selected: string) => {
    switch (selected) {
      case 'home':
        return homePage
      case 'gettingStarted':
        return gettingStartedPage
      case 'tools':
        return toolsPage
      case 'fields':
        return fieldsPage
      case 'reports':
        return reportsPage
      case 'archived':
        return archivedPage
      case 'savedItems':
        return savedItemsPage
      case 'workInProgress':
        return workInProgressPage
      default:
        return homePage
    }
  }

  return (
    <Container>
      <SideBar>
        <SideBar.Content>
          <SideBar.Toggle />
          {sidebarLinks.map((linkItem) => (
            <SideBar.Link
              key={linkItem.name}
              label={linkItem.label}
              icon={linkItem.icon}
              active={selected === linkItem.name}
              onClick={() => {
                setSelected(linkItem.name)
              }}
            />
          ))}
          {sidebarAccordions.map((accordionItem) => (
            <SideBar.Accordion
              key={accordionItem.label}
              label={accordionItem.label}
              icon={accordionItem.icon}
            >
              {accordionItem.children.map((accordionItemChild) => (
                <SideBar.AccordionItem
                  key={accordionItemChild.name}
                  label={accordionItemChild.label}
                  active={selected === accordionItemChild.name}
                  onClick={() => {
                    setSelected(accordionItemChild.name)
                  }}
                />
              ))}
            </SideBar.Accordion>
          ))}
        </SideBar.Content>
      </SideBar>
      {selectPage(selected)}
    </Container>
  )
}

const sidebarLinks = [
  { label: 'Home', icon: home, name: 'home' },
  { label: 'Getting started', icon: business, name: 'gettingStarted' },
]

const sidebarAccordions = [
  {
    label: 'Gas',
    icon: gas,
    children: [
      { label: 'Tools', name: 'tools' },
      { label: 'Fields', name: 'fields' },
      { label: 'Reports', name: 'reports' },
      { label: 'Archived', name: 'archived' },
    ],
  },
  {
    label: 'Favorites',
    icon: favorite_outlined,
    children: [
      { label: 'Saved Items', name: 'savedItems' },
      { label: 'Work in progress', name: 'workInProgress' },
    ],
  },
]

const selectPage = (selected: string) => {
  switch (selected) {
    case 'home':
      return homePage
    case 'gettingStarted':
      return gettingStartedPage
    case 'tools':
      return toolsPage
    case 'fields':
      return fieldsPage
    case 'reports':
      return reportsPage
    case 'archived':
      return archivedPage
    case 'savedItems':
      return savedItemsPage
    case 'workInProgress':
      return workInProgressPage
    default:
      return homePage
  }
}

export const ControlledActiveState: StoryFn<SidebarType> = () => {
  const [selected, setSelected] = useState<string>('')

  const hasActiveItem = (subItems: { label: string; name: string }[]) => {
    for (const item of subItems) {
      if (selected === item.name) {
        return true
      }
    }
    return false
  }

  return (
    <Container>
      <SideBar>
        <SideBar.Content>
          <SideBar.Toggle />
          {sidebarLinks.map((linkItem) => (
            <SideBar.Link
              key={linkItem.name}
              label={linkItem.label}
              icon={linkItem.icon}
              active={selected === linkItem.name}
              onClick={() => {
                setSelected(linkItem.name)
              }}
            />
          ))}
          {sidebarAccordions.map((accordionItem) => (
            <SideBar.Accordion
              key={accordionItem.label}
              label={accordionItem.label}
              icon={accordionItem.icon}
              active={hasActiveItem(accordionItem.children)}
            >
              {accordionItem.children.map((accordionItemChild) => (
                <SideBar.AccordionItem
                  key={accordionItemChild.name}
                  label={accordionItemChild.label}
                  active={selected === accordionItemChild.name}
                  onClick={() => {
                    setSelected(accordionItemChild.name)
                  }}
                />
              ))}
            </SideBar.Accordion>
          ))}
        </SideBar.Content>
      </SideBar>
      {selectPage(selected)}
    </Container>
  )
}
