import { Tabs as BaseComponent, TabsProps } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanels } from './TabPanels'
import { TabPanel } from './TabPanel'

type TabsCompoundProps = typeof BaseComponent & {
  Tab: typeof Tab
  // Deprecated
  TabList: typeof TabList
  TabPanels: typeof TabPanels
  TabPanel: typeof TabPanel
  // New
  Panels: typeof TabPanels
  Panel: typeof TabPanel
  List: typeof TabList
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
Tabs.List = TabList

Tabs.Tab.displayName = 'Tabs.Tab'
Tabs.Panels.displayName = 'Tabs.Panels'
Tabs.Panel.displayName = 'Tabs.Panel'
Tabs.List.displayName = 'Tabs.List'

export { Tabs }
export type { TabsProps }
