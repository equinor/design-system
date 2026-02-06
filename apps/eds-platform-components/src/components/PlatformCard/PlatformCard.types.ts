export type PlatformCardProps = {
  /** Platform name */
  title: string
  /** Platform description */
  description: string
  /** Whether the card is selected */
  isActive?: boolean
  /** Click handler */
  onClick?: () => void
}
