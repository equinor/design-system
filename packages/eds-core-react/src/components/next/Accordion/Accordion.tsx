import { forwardRef, HTMLAttributes, ReactNode, useRef, useEffect } from 'react'
import { AccordionHeader } from './AccordionHeader'
import { AccordionContent } from './AccordionContent'
import './accordion.css'

export type AccordionProps = {
  /**
   * Controls open state (controlled mode).
   * When provided, you must also handle onToggle to update state.
   */
  open?: boolean
  /**
   * Initial open state (uncontrolled mode).
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Callback when accordion toggles.
   */
  onToggle?: (open: boolean) => void
  /**
   * Disables the accordion - prevents interaction and applies muted styling.
   * @default false
   */
  disabled?: boolean
  /**
   * Accordion content - should include Accordion.Header and Accordion.Content
   */
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDetailsElement>, 'onToggle'>

type AccordionComponent = typeof AccordionBase & {
  /** Header section with toggle button */
  Header: typeof AccordionHeader
  /** Content section that expands/collapses */
  Content: typeof AccordionContent
}

/**
 * Accordion component using native <details> element.
 *
 * @example
 * <Accordion>
 *   <Accordion.Header>Title</Accordion.Header>
 *   <Accordion.Content>Content here</Accordion.Content>
 * </Accordion>
 */
const AccordionBase = forwardRef<HTMLDetailsElement, AccordionProps>(
  function Accordion(
    {
      open,
      defaultOpen = false,
      onToggle,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const detailsRef = useRef<HTMLDetailsElement>(null)
    const wasOpenRef = useRef(defaultOpen)
    const isControlled = open !== undefined

    // Sync controlled state with DOM
    useEffect(() => {
      if (isControlled && detailsRef.current) {
        detailsRef.current.open = open
        wasOpenRef.current = open
      }
    }, [open, isControlled])

    const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
      const newOpen = event.currentTarget.open

      // Prevent toggle when disabled - revert to previous state
      if (disabled && detailsRef.current) {
        detailsRef.current.open = wasOpenRef.current
        return
      }

      // Update the tracked state
      wasOpenRef.current = newOpen

      if (isControlled && detailsRef.current) {
        // Prevent native toggle in controlled mode
        detailsRef.current.open = open
        wasOpenRef.current = !!open
      }

      onToggle?.(newOpen)
    }

    const classNames = [
      'accordion',
      disabled && 'accordion--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <details
        ref={(node) => {
          // Handle both refs
          ;(
            detailsRef as React.MutableRefObject<HTMLDetailsElement | null>
          ).current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={classNames}
        open={isControlled ? open : defaultOpen || undefined}
        onToggle={handleToggle}
        data-disabled={disabled || undefined}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </details>
    )
  },
)

export const Accordion = Object.assign(AccordionBase, {
  Header: AccordionHeader,
  Content: AccordionContent,
}) as AccordionComponent

Accordion.Header.displayName = 'Accordion.Header'
Accordion.Content.displayName = 'Accordion.Content'
