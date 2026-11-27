import { Button, Dialog, Switch } from '@equinor/eds-core-react/next'
import type { DisplaySettings } from '../../shared/window'

type SettingsDialogProps = {
  open: boolean
  onClose: () => void
  settings: DisplaySettings
  /** The theme the window shows now, Figma's or the chosen one */
  windowScheme: 'light' | 'dark'
  onChange: (settings: DisplaySettings) => void
  /** False until there is a scan to report on */
  canReport: boolean
  onReport: () => void
  onIntroduction: () => void
  onResetWindow: () => void
}

/**
 * Settings in a dialog: switches for what the lists show, which take effect
 * and are kept at once, and buttons for the report, the introduction and
 * the window size.
 */
export function SettingsDialog({
  open,
  onClose,
  settings,
  windowScheme,
  onChange,
  canReport,
  onReport,
  onIntroduction,
  onResetWindow,
}: SettingsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      className="settings-dialog"
    >
      <Dialog.Header>
        <Dialog.Title>Settings</Dialog.Title>
      </Dialog.Header>
      <Dialog.Content>
        <section
          className="settings-section"
          aria-labelledby="settings-display"
        >
          <h3 id="settings-display" className="group-title">
            Display
          </h3>
          <Switch
            label="Layer counts in Changes"
            checked={settings.showCounts}
            onChange={(event) =>
              onChange({ ...settings, showCounts: event.target.checked })
            }
          />
          <Switch
            label="Frames without EDS variables"
            checked={settings.showEmpty}
            onChange={(event) =>
              onChange({ ...settings, showEmpty: event.target.checked })
            }
          />
          <Switch
            label="Dark mode"
            checked={windowScheme === 'dark'}
            onChange={(event) =>
              onChange({
                ...settings,
                theme: event.target.checked ? 'dark' : 'light',
              })
            }
          />
          {settings.theme === 'figma' ? (
            <p className="muted">
              The window follows Figma&apos;s theme until you change it here.
              The colours shown for layers always follow the layers.
            </p>
          ) : (
            <span className="settings-inline">
              <span className="muted">
                Chosen here, so Figma&apos;s theme no longer decides it.
              </span>
              <Button
                variant="ghost"
                size="small"
                onClick={() => onChange({ ...settings, theme: 'figma' })}
              >
                Follow Figma&apos;s theme
              </Button>
            </span>
          )}
        </section>
        <section className="settings-section" aria-labelledby="settings-report">
          <h3 id="settings-report" className="group-title">
            Report
          </h3>
          <p className="muted">
            {canReport
              ? 'A Markdown report and a CSV of the latest scan.'
              : 'Scan first; the report is made from the latest scan.'}
          </p>
          <span>
            <Button
              variant="secondary"
              size="small"
              disabled={!canReport}
              onClick={onReport}
            >
              Export report…
            </Button>
          </span>
        </section>
        <section className="settings-section" aria-labelledby="settings-help">
          <h3 id="settings-help" className="group-title">
            Help
          </h3>
          <p className="muted">
            What the plugin does, what it does not do, and how to use it.
          </p>
          <span>
            <Button variant="secondary" size="small" onClick={onIntroduction}>
              Show the introduction
            </Button>
          </span>
        </section>
        <section className="settings-section" aria-labelledby="settings-window">
          <h3 id="settings-window" className="group-title">
            Window
          </h3>
          <p className="muted">
            The window keeps the size you drag it to. This puts it back to the
            first size.
          </p>
          <span>
            <Button variant="secondary" size="small" onClick={onResetWindow}>
              Reset window size
            </Button>
          </span>
        </section>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={onClose}>Done</Button>
      </Dialog.Actions>
    </Dialog>
  )
}
