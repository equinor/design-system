import { classNames, type Styles } from './classNames'
import { PageHeader } from './PageHeader'
import { PeopleTable } from './PeopleTable'
import { SideNav } from './SideNav'
import { Tabs } from './Tabs'
import { TopBar } from './TopBar'

/** The demo screen. The markup is the same on every page; the page passes
 * the tokens.module.css that styles it. */
export function Dashboard({ styles }: { styles: Styles }) {
  const c = classNames(styles)

  return (
    <div className={c('app')}>
      <TopBar styles={styles} />
      <div className={c('body')}>
        <SideNav styles={styles} />
        <main className={c('main')}>
          <Tabs styles={styles} />
          <PageHeader styles={styles} />
          <PeopleTable styles={styles} />
        </main>
      </div>
    </div>
  )
}
