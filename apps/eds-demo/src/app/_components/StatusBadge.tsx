import {
  check_circle_outlined,
  error_outlined,
  info_circle,
  warning_outlined,
} from '@equinor/eds-icons'
import { classNames, type Styles } from './classNames'
import { Icon } from './Icon'
import type { Status } from './people'

const icons = {
  info: info_circle,
  success: check_circle_outlined,
  warning: warning_outlined,
  danger: error_outlined,
}

type StatusBadgeProps = {
  styles: Styles
  tone: Status
  children: React.ReactNode
}

/** A status label, drawn as the EDS Badge in Figma (Solid, Low emphasis,
 * leading icon). It is not interactive, so it uses the non-interactive
 * colour tokens. The tone is set with data-tone, and the CSS maps each tone
 * to its tokens. */
export function StatusBadge({ styles, tone, children }: StatusBadgeProps) {
  const c = classNames(styles)

  return (
    <span className={c('badge')} data-tone={tone}>
      <Icon data={icons[tone]} />
      {children}
    </span>
  )
}
