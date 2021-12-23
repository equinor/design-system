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

export type AccordionItemProps = {
  index?: number
  accordionId?: string
  /** Is AccordionItem expanded */
  isExpanded?: boolean
  /** accordion item is disabled */
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
      isExpanded,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    const [expanded, setExpanded] = useState(isExpanded)

    const toggleExpanded = () => {
      setExpanded(!expanded)
    }

    const Children = ReactChildren.map(children, (child, childIndex) => {
      const headerId = `${accordionId}-header-${index + 1}`
      const panelId = `${accordionId}-panel-${index + 1}`

      return childIndex === 0
        ? cloneElement(child as ReactElement, {
            isExpanded: expanded,
            toggleExpanded,
            id: headerId,
            panelId,
            headerLevel,
            chevronPosition,
            parentIndex: index,
            disabled,
          })
        : cloneElement(child as ReactElement, {
            hidden: !expanded,
            id: panelId,
            headerId,
          })
    })

    useEffect(() => {
      setExpanded(isExpanded)
    }, [isExpanded])

    return (
      <div {...props} ref={ref}>
        {Children}
      </div>
    )
  },
)

// AccordionItem.displayName = 'AccordionItem'

export { AccordionItem }
