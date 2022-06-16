import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styled from 'styled-components'
import {
  Tabs,
  Button,
  Icon,
  TabsProps,
  Typography,
  Search,
  EdsProvider,
  Density,
} from '../..'
import { ComponentMeta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Stack } from './../../../.storybook/components'
import page from './Tabs.docs.mdx'

export default {
  title: 'Navigation/Tabs',
  component: Tabs,
  subcomponents: {
    List: Tabs.List,
    Tab: Tabs.Tab,
    Panels: Tabs.Panels,
    Panel: Tabs.Panel,
  },
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Tabs>

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const TabsRow = styled.div`
  display: flex;
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

export const Introduction: Story<TabsProps> = (args) => (
  <Stack>
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
  </Stack>
)

export const States: Story<TabsProps> = () => {
  const focusedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    focusedRef.current?.focus()
  }, [])

  return (
    <Stack>
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
    </Stack>
  )
}

export const Widths: Story<TabsProps> = () => {
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

export const WithPanels: Story<TabsProps> = () => {
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
      <Tabs.Panels>
        <Tabs.Panel>Panel one</Tabs.Panel>
        <Tabs.Panel>Panel two</Tabs.Panel>
        <Tabs.Panel>Panel three</Tabs.Panel>
        <Tabs.Panel>Panel four</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}
WithPanels.storyName = 'With panels'

export const WithSearch: Story<TabsProps> = () => {
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

export const WithInputInPanel: Story<TabsProps> = () => {
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

export const WithStyledComponent: Story<TabsProps> = () => {
  const StyledTab = styled(Tabs.Tab)`
    background: pink;
  `

  const StyledTabPanel = styled(Tabs.Panel)`
    padding: 32px;
    background: peachpuff;
  `
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

export const Overflow: Story<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState(0)
  const list = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)

  const handleChange = (index: number) => {
    setActiveTab(index)
  }

  useLayoutEffect(() => {
    const cachedList = list.current
    let delayToScrollEnd: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      if (delayToScrollEnd) clearTimeout(delayToScrollEnd)
      delayToScrollEnd = setTimeout(() => {
        cachedList?.scrollLeft === 0
          ? setPrevDisabled(true)
          : setPrevDisabled(false)
        if (cachedList !== null) {
          containerWidth + Math.ceil(cachedList.scrollLeft) === totalWidth
            ? setNextDisabled(true)
            : setNextDisabled(false)
        }
      }, 20)
    }

    if (cachedList) {
      setContainerWidth(cachedList.clientWidth)
      setTotalWidth(cachedList.scrollWidth)
      cachedList.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (delayToScrollEnd) clearTimeout(delayToScrollEnd)
      cachedList?.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth, list, totalWidth])

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
        <Tabs.List ref={list}>
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

export const OverflowScroll: Story<TabsProps> = () => {
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

export const OverflowScrollStyled: Story<TabsProps> = () => {
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

export const Compact: Story<TabsProps> = () => {
  const focusedRef = useRef<HTMLButtonElement>(null)
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    focusedRef.current?.focus()
    setDensity('compact')
  }, [density])

  return (
    <Stack>
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
    </Stack>
  )
}
