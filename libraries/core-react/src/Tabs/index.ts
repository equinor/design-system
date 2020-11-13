import { Tabs as BaseComponent, TabsProps } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanels } from './TabPanels'
import { TabPanel } from './TabPanel'

type TabsCompoundProps = typeof BaseComponent & {
  Tab: typeof Tab
  TabList: typeof TabList
  TabPanels: typeof TabPanels
  TabPanel: typeof TabPanel
}

const Tabs = BaseComponent as TabsCompoundProps

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels
Tabs.TabPanel = TabPanel

export { Tabs }
export type { TabsProps }
