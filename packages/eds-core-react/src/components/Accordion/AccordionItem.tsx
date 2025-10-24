import {
  forwardRef,
  useState,
  useEffect,
  ReactElement,
  HTMLAttributes,
  Children as ReactChildren,
  cloneElement,
} from 'react'
import type { AccordionProps } from './Accordion.types'
import type { AccordionHeaderProps } from './AccordionHeader'
import type { AccordionPanelProps } from './AccordionPanel'

export type AccordionItemProps = {
  index?: number
  accordionId?: string
  /** Is AccordionItem expanded */
  isExpanded?: boolean
  /**
   * Callback fired with expanded state change.
   * When this prop is present, the accordion is in controlled state
   */
  onExpandedChange?: (isExpanded: boolean) => void
  /** Accordion item is disabled */
  disabled?: boolean
} & HTMLAttributes<HTMLDivElement> &
  AccordionProps

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    {
      headerLevel,
      chevronPosition,
      index = 0,
      accordionId,
      isExpanded = false,
      onExpandedChange,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    const [expanded, setExpanded] = useState(isExpanded)
    const controlled = onExpandedChange !== undefined
    const activeExpandedState = controlled ? isExpanded : expanded

    const toggleExpanded = () => {
      if (disabled) return

      if (controlled) {
        onExpandedChange?.(!isExpanded)
      } else {
        setExpanded(!expanded)
      }
    }

    const processedChildren = ReactChildren.map(
      children,
      (child, childIndex) => {
        const headerId = `${accordionId}-header-${index + 1}`
        const panelId = `${accordionId}-panel-${index + 1}`

        return childIndex === 0
          ? cloneElement(child as ReactElement<AccordionHeaderProps>, {
              isExpanded: activeExpandedState,
              toggleExpanded,
              id: headerId,
              panelId,
              headerLevel,
              chevronPosition,
              parentIndex: index,
              disabled,
            })
          : cloneElement(child as ReactElement<AccordionPanelProps>, {
              hidden: !activeExpandedState,
              id: panelId,
              headerId,
            })
      },
    )

    useEffect(() => {
      if (!controlled) {
        setExpanded(isExpanded)
      }
    }, [isExpanded, controlled])

    return (
      <div {...props} ref={ref}>
        {processedChildren}
      </div>
    )
  },
)

// AccordionItem.displayName = 'AccordionItem'

export { AccordionItem }
