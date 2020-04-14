import { Tabs as TabsComponent } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanels } from './TabPanels'
import { TabPanel } from './TabPanel'

/**
 * @type {typeof import('./types').Tabs}
 */
// @ts-ignore
const Tabs = TabsComponent

Tabs.Tab = Tab
Tabs.TabList = TabList
Tabs.TabPanels = TabPanels
Tabs.TabPanel = TabPanel

export { Tabs }
