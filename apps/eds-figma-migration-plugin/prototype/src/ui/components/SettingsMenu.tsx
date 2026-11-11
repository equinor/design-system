import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Button, Icon, Menu, MenuItem } from '@equinor/eds-core-react/next'
import { check, tune } from '@equinor/eds-icons'

export type Setting = {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

type SettingsMenuProps = {
  settings: Setting[]
  actions: { id: string; label: string; onSelect: () => void }[]
}

/**
 * The settings behind the sliders button in the header, as in Figma's Check
 * designs: what the lists show, and the report. The Beta Menu is a styled
 * list without opening, closing or keyboard handling, so that is done here
 * (BETA-GAPS.md).
 */
export function SettingsMenu({ settings, actions }: SettingsMenuProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const button = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLUListElement>(null)

  const items = () => [
    ...(menu.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ??
      []),
  ]

  useEffect(() => {
    if (!open) return
    items()[0]?.focus()
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !menu.current?.contains(target) &&
        !button.current?.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  const close = () => {
    setOpen(false)
    button.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const list = items()
    const index = list.indexOf(document.activeElement as HTMLElement)
    const move = (to: number) => {
      event.preventDefault()
      list[(to + list.length) % list.length]?.focus()
    }
    if (event.key === 'ArrowDown') move(index + 1)
    else if (event.key === 'ArrowUp') move(index - 1)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ;(document.activeElement as HTMLElement | null)?.click()
    }
  }

  return (
    <div className="settings-menu">
      <Button
        ref={button}
        variant="ghost"
        size="small"
        icon
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((previous) => !previous)}
      >
        <Icon data={tune} size="md" />
      </Button>
      {open && (
        <Menu
          ref={menu}
          id={id}
          role="menu"
          aria-label="Settings"
          className="settings-popover"
          onKeyDown={onKeyDown}
        >
          <li role="presentation" className="settings-heading">
            Show
          </li>
          {settings.map((setting) => (
            <MenuItem
              key={setting.id}
              role="menuitemcheckbox"
              aria-checked={setting.checked}
              tabIndex={-1}
              onClick={() => setting.onChange(!setting.checked)}
            >
              <span className="settings-check" aria-hidden="true">
                {setting.checked && <Icon data={check} size="sm" />}
              </span>
              {setting.label}
            </MenuItem>
          ))}
          <li role="separator" className="settings-separator" />
          {actions.map((action) => (
            <MenuItem
              key={action.id}
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                setOpen(false)
                action.onSelect()
              }}
            >
              <span className="settings-check" aria-hidden="true" />
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}
