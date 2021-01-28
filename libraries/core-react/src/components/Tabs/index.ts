import { Tabs as BaseComponent, TabsProps } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanels } from './TabPanels'
import { TabPanel } from './TabPanel'

type TabsCompoundProps = typeof BaseComponent & {
  Tab: typeof Tab
  TabList: typeof TabList
  // Deprecated
  TabPanels: typeof TabPanels
  TabPanel: typeof TabPanel
  // New
  Panels: typeof TabPanels
  Panel: typeof TabPanel
}

const Tabs = BaseComponent as TabsCompoundProps

Tabs.Tab = Tab
// Deprecated
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels
Tabs.TabPanel = TabPanel
// New
Tabs.Panels = TabPanels
Tabs.Panel = TabPanel

export { Tabs }
export type { TabsProps }
