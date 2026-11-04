import {
  check_circle_outlined,
  error_outlined,
  info_circle,
  warning_outlined,
} from '@equinor/eds-icons'
import { Icon } from '@equinor/eds-core-react/next'
import type { Status } from './people'

const icons = {
  info: info_circle,
  success: check_circle_outlined,
  warning: warning_outlined,
  danger: error_outlined,
}

type StatusBadgeProps = {
  tone: Status
  children: React.ReactNode
}

/** A status label with a leading icon. It is not interactive, so it uses
 * the non-interactive colour tokens. The tone is set with data-tone, and the
 * CSS maps each tone to its tokens. */
export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span className="badge" data-tone={tone}>
      <Icon data={icons[tone]} size="sm" />
      {children}
    </span>
  )
}
