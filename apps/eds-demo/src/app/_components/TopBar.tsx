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

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand">
        <Button variant="ghost" tone="neutral" icon aria-label="Apps">
          <Icon data={apps} />
        </Button>
        <div className="brand-text">
          <span className="app-title">Field access</span>
          <span className="app-subtitle">Johan Sverdrup</span>
        </div>
      </div>

      <div className="top-bar-actions">
        <div className="search">
          <Icon data={search} size="md" className="search-icon" />
          <input
            type="search"
            className="search-input"
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
          className="account-button"
          popoverTarget="account-menu"
        >
          <Icon data={account_circle} />
        </Button>
        <div id="account-menu" popover="auto" className="menu">
          <button type="button" className="menu-item">
            <Icon data={person} size="md" />
            Profile
          </button>
          <button type="button" className="menu-item">
            <Icon data={settings} size="md" />
            Settings
          </button>
          <hr className="menu-divider" />
          <button type="button" className="menu-item">
            <Icon data={log_out} size="md" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
