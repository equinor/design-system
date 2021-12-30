import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import {
  Tabs,
  TabsProps,
  Typography,
  Search,
  EdsProvider,
  Density,
} from '../..'
import { Story, Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

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
      description: {
        component: `Tabs organise related content across different views to be quickly navigated.
        `,
      },
    },
  },
} as Meta

export const Default: Story<TabsProps> = (args) => (
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

export const States: Story<TabsProps> = () => {
  const focusedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    focusedRef.current.focus()
  }, [])

  return (
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
    <>
      <Typography variant="body_long">
        To navigate using they keyboard, use tab key to move from tab to tab
        panel, shift + tab to go backwards, use left and right arrow keys to
        move from between tabs (active tab must be focused). Focus outline is
        only visible when navigating using the keyboard.
      </Typography>
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
    </>
  )
}

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
    <>
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
    </>
  )
}

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
    { name: 'Tab 1', value: 'Tab 1 body as plain text' },
    { name: 'Tab 2', value: <Typography>Tab 2 body as typography</Typography> },
    { name: 'Tab 3', value: <div>Tab 3 as div</div> },
  ]

  return (
    <>
      <Typography variant="h1">
        Tab with panels rendered from collection
      </Typography>
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
    </>
  )
}

export const Compact: Story<TabsProps> = () => {
  const focusedRef = useRef<HTMLButtonElement>(null)
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    focusedRef.current.focus()
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

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Tabs` using `EdsProvider` ',
    },
  },
}

WithSearch.storyName = 'With search'
WithInputInPanel.storyName = 'With input in panel'
WithStyledComponent.storyName = 'With styled component'
