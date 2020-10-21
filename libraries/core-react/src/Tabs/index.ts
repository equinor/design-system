import { Tabs as BaseComponent } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanels } from './TabPanels'
import { TabPanel } from './TabPanel'

type TabsType = typeof BaseComponent & {
  Tab: typeof Tab
  TabList: typeof TabList
  TabPanels: typeof TabPanels
  TabPanel: typeof TabPanel
}

const Tabs = BaseComponent as TabsType

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels
Tabs.TabPanel = TabPanel

export { Tabs }
