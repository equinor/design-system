import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Tabs, Button, Icon, TabsProps, Typography, Search } from '../..'
import { chevron_left, chevron_right } from '@equinor/eds-icons'
import { mergeRefs } from '@equinor/eds-utils'
import { Meta, StoryFn } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { Stack } from './../../../.storybook/components'
import page from './Tabs.docs.mdx'
import {
  MemoryRouter,
  Route,
  Routes,
  Link,
  matchPath,
  useLocation,
} from 'react-router-dom'

const icons = {
  chevron_left,
  chevron_right,
}

Icon.add(icons)

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  subcomponents: {
    List: Tabs.List,
    Tab: Tabs.Tab,
    Panels: Tabs.Panels,
    Panel: Tabs.Panel,
  },
  argTypes: {
    activeTab: {
      options: [0, 1],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
}

export default meta

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const TabsRow = styled.div`
  display: flex;
`
const StyledTab = styled(Tabs.Tab)`
  background: pink;
`

const StyledTabPanel = styled(Tabs.Panel)`
  padding: 32px;
  background: peachpuff;
`

const NavButton = styled(Button)`
  flex-shrink: 0;
`
const StyledTabList = styled(Tabs.List)`
  --track-color: #ffffff;
  --thumb-color: #dcdcdc;
  scrollbar-color: var(--track-color) var(--thumb-color);
  scrollbar-width: thin;
  padding-bottom: 8px;

  // For Google Chrome/webkit
  & ::-webkit-scrollbar {
    height: 8px;
  }

  & ::-webkit-scrollbar-thumb {
    background: var(--thumb-color);
    border-radius: 8px;
  }

  & ::-webkit-scrollbar-track {
    background: var(--track-color);
  }
`

export const Introduction: StoryFn<TabsProps> = (args) => {
  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab>One</Tabs.Tab>
        <Tabs.Tab>Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel>Panel one</Tabs.Panel>
        <Tabs.Panel>Panel two</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}
Introduction.decorators = [
  (Story) => {
    return (
      <Stack>
        <Story />
      </Stack>
    )
  },
]

export const States: StoryFn<TabsProps> = () => {
  const focusedRef = useRef<HTMLButtonElement>(null)

  return (
    <Tabs activeTab={2} onChange={noop}>
      <Tabs.List>
        <Tabs.Tab>Enabled</Tabs.Tab>
        <Tabs.Tab disabled>Disabled</Tabs.Tab>
        <Tabs.Tab>Active</Tabs.Tab>
        <Tabs.Tab data-hover>Hover</Tabs.Tab>
        <Tabs.Tab data-focus ref={focusedRef}>
          Focus
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}
States.decorators = [
  (Story) => {
    return (
      <Stack>
        <Story />
      </Stack>
    )
  },
]

export const Widths: StoryFn<TabsProps> = () => {
  return (
    <>
      <Typography variant="h4">minWidth</Typography>
      <Tabs activeTab={1} onChange={noop} variant="minWidth">
        <Tabs.List>
          <Tabs.Tab>Text</Tabs.Tab>
          <Tabs.Tab>More text</Tabs.Tab>
          <Tabs.Tab>A really long line of text</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Typography variant="h4" style={{ marginTop: '1rem' }}>
        fullWidth
      </Typography>
      <Tabs activeTab={1} onChange={noop} variant="fullWidth">
        <Tabs.List>
          <Tabs.Tab>Text</Tabs.Tab>
          <Tabs.Tab>More text</Tabs.Tab>
          <Tabs.Tab>A really long line of text</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  )
}

export const WithPanels: StoryFn<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState(1)

  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  return (
    <Tabs activeTab={activeTab} onChange={handleChange}>
      <Tabs.List>
        <Tabs.Tab>Tab one</Tabs.Tab>
        <Tabs.Tab>Tab two</Tabs.Tab>
        <Tabs.Tab disabled>Tab three</Tabs.Tab>
        <Tabs.Tab>Tab four</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels conditionalRender>
        <Tabs.Panel>Panel one</Tabs.Panel>
        <Tabs.Panel>Panel two</Tabs.Panel>
        <Tabs.Panel>Panel three</Tabs.Panel>
        <Tabs.Panel>Panel four</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}
WithPanels.storyName = 'With panels'
WithPanels.decorators = [
  (Story) => {
    return (
      <Stack>
        <Story />
      </Stack>
    )
  },
]

export const Router: StoryFn<TabsProps> = () => {
  /*import {MemoryRouter, Route, Routes, Link, matchPath, useLocation} from 'react-router-dom' */
  function CurrentRoute() {
    const location = useLocation()
    return <Typography>Current route: {location.pathname}</Typography>
  }
  function useRouteMatch(patterns: readonly string[]) {
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i]
      const possibleMatch = matchPath(pattern, location.pathname)
      if (possibleMatch !== null) {
        return possibleMatch
      }
    }

    return null
  }
  function RouterTabs() {
    const routeMatch = useRouteMatch(['/wells/:id', '/home', '/settings'])
    const currentPath = routeMatch?.pattern?.path

    return (
      <Tabs activeTab={currentPath}>
        <Tabs.List>
          <Tabs.Tab value="/home" to="/home" as={Link}>
            Home
          </Tabs.Tab>
          <Tabs.Tab value="/wells/:id" to="/wells/1" as={Link}>
            Wells
          </Tabs.Tab>
          <Tabs.Tab value="/settings" to="/settings" as={Link}>
            Settings
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    )
  }

  return (
    <MemoryRouter initialEntries={['/home']} initialIndex={0}>
      <RouterTabs />
      <Routes>
        <Route path="*" element={<CurrentRoute />} />
      </Routes>
    </MemoryRouter>
  )
}
Router.decorators = [
  (Story) => {
    return (
      <Stack direction="column">
        <Story />
      </Stack>
    )
  },
]

export const WithSearch: StoryFn<TabsProps> = () => {
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const handleOnTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchText(value)
  }
  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    action('handleFocus')(e.target.textContent)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    action('handleBlur')(e.target.textContent)
  }

  return (
    <>
      <Search
        value={searchText}
        placeholder={'Search '}
        onChange={handleOnTextChange}
      />
      <Tabs
        style={{ marginTop: '2rem' }}
        activeTab={activeTab}
        onChange={handleChange}
        variant="fullWidth"
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <Tabs.List>
          <Tabs.Tab>Tags (5+)</Tabs.Tab>
          <Tabs.Tab> Docs (5+)</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel one</Tabs.Panel>
          <Tabs.Panel>Panel two</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </>
  )
}
WithSearch.storyName = 'With search'

export const WithInputInPanel: StoryFn<TabsProps> = () => {
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const handleOnTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchText(value)
  }
  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    action('handleFocus')(e.target.textContent)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    action('handleBlur')(e.target.textContent)
  }

  return (
    <Tabs
      style={{ marginTop: '2rem' }}
      activeTab={activeTab}
      onChange={handleChange}
      variant="fullWidth"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Tabs.List>
        <Tabs.Tab>Tab with textfield</Tabs.Tab>
        <Tabs.Tab>Other tab</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel style={{ maxWidth: '20em' }}>
          <Typography variant="body_short" style={{ marginBottom: '1rem' }}>
            Panel one
          </Typography>
          <Search
            value={searchText}
            placeholder={'Search '}
            onChange={handleOnTextChange}
          />
        </Tabs.Panel>
        <Tabs.Panel>
          <Typography variant="body_short">Panel two</Typography>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}
WithInputInPanel.storyName = 'With input in panel'

export const WithStyledComponent: StoryFn<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState(1)

  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  const items = [
    { name: 'Tab 1', value: 'Tab 1 body as PLAIN TEXT' },
    { name: 'Tab 2', value: <Typography>Tab 2 body as TYPOGRAPHY</Typography> },
    { name: 'Tab 3', value: <div>Tab 3 as DIV</div> },
  ]

  return (
    <Tabs activeTab={activeTab} onChange={handleChange}>
      <Tabs.List>
        {items.map(({ name }) => (
          <StyledTab key={name}>{name}</StyledTab>
        ))}
      </Tabs.List>
      <Tabs.Panels>
        {items.map(({ name, value }) => (
          <StyledTabPanel key={name}>{value}</StyledTabPanel>
        ))}
      </Tabs.Panels>
    </Tabs>
  )
}
WithStyledComponent.storyName = 'With styled component'

export const Overflow: StoryFn<TabsProps> = () => {
  const list = useRef<HTMLDivElement>(null)
  const debounceScroll = useRef<ReturnType<typeof setTimeout>>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)

  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  const handleScroll = useCallback(() => {
    if (debounceScroll.current) clearTimeout(debounceScroll.current)
    debounceScroll.current = setTimeout(() => {
      if (!list.current) return
      list.current.scrollLeft === 0
        ? setPrevDisabled(true)
        : setPrevDisabled(false)

      const atEndIsh =
        Math.abs(
          containerWidth + Math.round(list.current.scrollLeft) - totalWidth,
        ) <= 5

      atEndIsh ? setNextDisabled(true) : setNextDisabled(false)
    }, 20)
  }, [containerWidth, totalWidth])

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setContainerWidth(Math.round(entry.borderBoxSize[0].inlineSize))
          handleScroll()
        })
      }),
    [handleScroll],
  )

  const listCallback = useCallback(
    (node: HTMLDivElement) => {
      if (!node) return
      setTotalWidth(node.scrollWidth)
      setContainerWidth(node.clientWidth)
      resizeObserver.observe(node)
      node.addEventListener('scroll', handleScroll, { passive: true })
    },
    [handleScroll, resizeObserver],
  )

  useEffect(() => {
    const cachedList = list.current
    return () => {
      if (debounceScroll.current) clearTimeout(debounceScroll.current)
      cachedList?.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [handleScroll, resizeObserver])

  const scroll = (direction: string) => {
    //Tabs have "scroll-snap-align: end" so we need to scroll less than
    //the full row to avoid skipping past tabs. Here we set it to 80%
    const SCROLL_AMOUNT = 0.8
    let target = 0
    const signifier = direction === 'left' ? -1 : 1
    if (list.current !== null) {
      target =
        list.current.scrollLeft + signifier * containerWidth * SCROLL_AMOUNT
    }
    list.current?.scrollTo(target, 0)
  }

  return (
    <Tabs activeTab={activeTab} onChange={handleChange}>
      <TabsRow>
        <NavButton
          variant="ghost_icon"
          onClick={() => scroll('left')}
          aria-hidden="true"
          tabIndex={-1}
          disabled={prevDisabled}
        >
          <Icon name="chevron_left" />
        </NavButton>
        <Tabs.List ref={mergeRefs<HTMLDivElement>(list, listCallback)}>
          {Array.from({ length: 20 }, (_, i) => (
            <Tabs.Tab key={i}>Tab Title {i + 1}</Tabs.Tab>
          ))}
        </Tabs.List>
        <NavButton
          variant="ghost_icon"
          onClick={() => scroll('right')}
          aria-hidden="true"
          tabIndex={-1}
          disabled={nextDisabled}
        >
          <Icon name="chevron_right" />
        </NavButton>
      </TabsRow>
      <Tabs.Panels>
        {Array.from({ length: 20 }, (_, i) => (
          <Tabs.Panel key={i}>Panel {i + 1}</Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs>
  )
}
Overflow.storyName = 'Overflow with next/previous buttons'

export const OverflowScroll: StoryFn<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  return (
    <Tabs activeTab={activeTab} onChange={handleChange} scrollable>
      <Tabs.List>
        {Array.from({ length: 20 }, (_, i) => (
          <Tabs.Tab key={i}>Tab Title {i + 1}</Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panels>
        {Array.from({ length: 20 }, (_, i) => (
          <Tabs.Panel key={i}>Panel {i + 1}</Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs>
  )
}
OverflowScroll.storyName = 'Overflow with default scrollbar'

export const OverflowScrollStyled: StoryFn<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  /*
  //An example of how to make custom styled scrollbar for the Tabs.List
   const StyledTabList = styled(Tabs.List)`
    --track-color: #ffffff;
    --thumb-color: #dcdcdc;
    scrollbar-color: var(--track-color) var(--thumb-color);

    //For firefox
    scrollbar-width: thin;
    padding-bottom: 8px;

    // For Google Chrome/Safari/Edge
    & ::-webkit-scrollbar {
      height: 8px;
    }

    & ::-webkit-scrollbar-thumb {
      background: var(--thumb-color);
      border-radius: 8px;
    }

    & ::-webkit-scrollbar-track {
      background: var(--track-color);
    }
  ` */

  return (
    <Tabs activeTab={activeTab} onChange={handleChange} scrollable>
      <StyledTabList>
        {Array.from({ length: 15 }, (_, i) => (
          <Tabs.Tab key={i}>Tab Title {i + 1}</Tabs.Tab>
        ))}
      </StyledTabList>
      <Tabs.Panels>
        {Array.from({ length: 15 }, (_, i) => (
          <Tabs.Panel key={i}>Panel {i + 1}</Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs>
  )
}
OverflowScrollStyled.storyName = 'Overflow with customized scrollbar'

/* export const Compact: Story<TabsProps> = () => {
  const focusedRef = useRef<HTMLButtonElement>(null)
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Tabs activeTab={2} onChange={noop}>
        <Tabs.List>
          <Tabs.Tab>Enabled</Tabs.Tab>
          <Tabs.Tab disabled>Disabled</Tabs.Tab>
          <Tabs.Tab active>Active</Tabs.Tab>
          <Tabs.Tab data-hover>Hover</Tabs.Tab>
          <Tabs.Tab data-focus ref={focusedRef}>
            Focus
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </EdsProvider>
  )
}
Compact.decorators = [
  (Story) => {
    return (
      <Stack>
        <Story />
      </Stack>
    )
  },
] */
