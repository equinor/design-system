import type { IconData, IconName } from '@equinor/eds-icons'
import type { SVGProps, Ref } from 'react'

export type IconSize =
  'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

export type IconProps = {
  /** Icon data from @equinor/eds-icons */
  data: IconData
  /** Title for accessibility - when provided, icon becomes semantic with role="img" */
  title?: string
  /**
   * Color of the icon. Pass a semantic token such as `var(--eds-icon-secondary)`.
   * @default 'currentColor'
   */
  color?: string
  /**
   * Explicit size, from the spacing token of the same name (`md` is `--eds-spacing-md`).
   * When not set, the icon is `--eds-spacing-xl`, the same as `size="xl"`.
   */
  size?: IconSize
  /** Ref to the rendered `svg` element */
  ref?: Ref<SVGSVGElement>
} & Omit<SVGProps<SVGSVGElement>, 'color'>

export type { IconData, IconName }
