import type { SVGProps } from 'react'
import type { IconData } from '@equinor/eds-icons'

export type IconProps = {
  /** Icon data from `@equinor/eds-icons`. */
  data: IconData
  /**
   * Accessible title. When set, the icon becomes semantic (`role="img"`);
   * when omitted, the icon is decorative (`aria-hidden`).
   */
  title?: string
} & Omit<SVGProps<SVGSVGElement>, 'color'>
