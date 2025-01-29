import { Tabs as BaseComponent, TabsProps } from './Tabs'
import { TabList, TabListProps } from './TabList'
import { Tab, TabProps } from './Tab'
import { TabPanels, TabPanelsProps } from './TabPanels'
import { TabPanel, TabPanelProps } from './TabPanel'

type TabsCompoundProps = typeof BaseComponent & {
  Tab: typeof Tab
  Panels: typeof TabPanels
  Panel: typeof TabPanel
  List: typeof TabList
}

const Tabs = BaseComponent as TabsCompoundProps

Tabs.Tab = Tab
Tabs.Panels = TabPanels
Tabs.Panel = TabPanel
Tabs.List = TabList

Tabs.Tab.displayName = 'Tabs.Tab'
Tabs.Panels.displayName = 'Tabs.Panels'
Tabs.Panel.displayName = 'Tabs.Panel'
Tabs.List.displayName = 'Tabs.List'

export { Tabs, Tab, TabPanels, TabPanel, TabList }
export type { TabsProps, TabProps, TabListProps, TabPanelProps, TabPanelsProps }
