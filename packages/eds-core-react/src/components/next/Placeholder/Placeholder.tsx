/**
 * Placeholder component for testing the /next entry point.
 * This component should be removed once real EDS 2.0 components are added.
 */
export type PlaceholderProps = {
  /** Text to display */
  text?: string
}

export const Placeholder = ({
  text = 'EDS 2.0 Placeholder',
}: PlaceholderProps) => {
  return <div data-testid="eds-placeholder">{text}</div>
}
