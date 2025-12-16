import type { IconData, IconName } from '@equinor/eds-icons'
import type { SVGProps, Ref } from 'react'

export type IconSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'

export type IconProps = {
  /** Icon data from @equinor/eds-icons */
  data: IconData
  /** Title for accessibility - when provided, icon becomes semantic with role="img" */
  title?: string
  /** Color of the icon. Defaults to currentColor for inheritance */
  color?: string
  /**
   * Explicit size. Overrides automatic sizing from parent's data-font-size.
   * When not set, icon inherits size from --eds-typography-icon-size or scales dynamically (1.5em).
   */
  size?: IconSize
  /** @ignore */
  ref?: Ref<SVGSVGElement>
} & Omit<SVGProps<SVGSVGElement>, 'color'>

export type { IconData, IconName }
