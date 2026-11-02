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
import { Icon } from './Icon'

export function TopBar({ styles }: { styles: Styles }) {
  const c = classNames(styles)

  return (
    <header className={c('top-bar')}>
      <div className={c('brand')}>
        <button type="button" className={c('icon-button')} aria-label="Apps">
          <Icon data={apps} />
        </button>
        <div className={c('brand-text')}>
          <span className={c('app-title')}>Field access</span>
          <span className={c('app-subtitle')}>Johan Sverdrup</span>
        </div>
      </div>

      <div className={c('top-bar-actions')}>
        <div className={c('search')}>
          <Icon data={search} className={c('search-icon')} />
          <input
            type="search"
            className={c('search-input')}
            placeholder="Search people"
            aria-label="Search people"
          />
        </div>
        <button
          type="button"
          className={c('icon-button')}
          aria-label="Notifications"
        >
          <Icon data={notifications} />
        </button>
        <button type="button" className={c('icon-button')} aria-label="Help">
          <Icon data={help_outline} />
        </button>
        <button
          type="button"
          className={`${c('icon-button')} ${c('account-button')}`}
          aria-label="Account"
          popoverTarget="account-menu"
        >
          <Icon data={account_circle} />
        </button>
        <div id="account-menu" popover="auto" className={c('menu')}>
          <button type="button" className={c('menu-item')}>
            <Icon data={person} />
            Profile
          </button>
          <button type="button" className={c('menu-item')}>
            <Icon data={settings} />
            Settings
          </button>
          <hr className={c('menu-divider')} />
          <button type="button" className={c('menu-item')}>
            <Icon data={log_out} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
