import { Button, Icon } from '@equinor/eds-core-react/next'
import {
  account_circle,
  apps,
  help_outline,
  log_out,
  notifications,
  person,
  search,
  settings,
} from '@equinor/eds-icons'
import { classNames, type Styles } from './classNames'

export function TopBar({ styles }: { styles: Styles }) {
  const c = classNames(styles)

  return (
    <header className={c('top-bar')}>
      <div className={c('brand')}>
        <Button variant="ghost" tone="neutral" icon aria-label="Apps">
          <Icon data={apps} />
        </Button>
        <div className={c('brand-text')}>
          <span className={c('app-title')}>Field access</span>
          <span className={c('app-subtitle')}>Johan Sverdrup</span>
        </div>
      </div>

      <div className={c('top-bar-actions')}>
        <div className={c('search')}>
          <Icon data={search} size="md" className={c('search-icon')} />
          <input
            type="search"
            className={c('search-input')}
            placeholder="Search people"
            aria-label="Search people"
          />
        </div>
        <Button variant="ghost" tone="neutral" icon aria-label="Notifications">
          <Icon data={notifications} />
        </Button>
        <Button variant="ghost" tone="neutral" icon aria-label="Help">
          <Icon data={help_outline} />
        </Button>
        <Button
          variant="ghost"
          tone="neutral"
          icon
          aria-label="Account"
          className={c('account-button')}
          popoverTarget="account-menu"
        >
          <Icon data={account_circle} />
        </Button>
        <div id="account-menu" popover="auto" className={c('menu')}>
          <button type="button" className={c('menu-item')}>
            <Icon data={person} size="md" />
            Profile
          </button>
          <button type="button" className={c('menu-item')}>
            <Icon data={settings} size="md" />
            Settings
          </button>
          <hr className={c('menu-divider')} />
          <button type="button" className={c('menu-item')}>
            <Icon data={log_out} size="md" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
