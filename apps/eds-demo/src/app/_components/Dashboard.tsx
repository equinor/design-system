import { PageHeader } from './PageHeader'
import { PeopleTable } from './PeopleTable'
import { SideNav } from './SideNav'
import { Tabs } from './Tabs'
import { TopBar } from './TopBar'

/** The demo screen, rendered in the preview frame. The markup is the same
 * for the exercise and the solution; only the CSS from the editor differs. */
export function Dashboard() {
  return (
    <div className="app">
      <TopBar />
      <div className="body">
        <SideNav />
        <main className="main">
          <Tabs />
          <PageHeader />
          <PeopleTable />
        </main>
      </div>
    </div>
  )
}
