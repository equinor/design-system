import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type SyntheticEvent,
} from 'react'
import { chevron_down } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import type {
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
} from './Accordion.types'

const GroupContext = createContext<string | undefined>(undefined)

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion({ exclusive, className, children, ...rest }, ref) {
    const generatedName = useId()
    const groupName = exclusive ? generatedName : undefined

    return (
      <div
        ref={ref}
        className={['eds-accordion', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <GroupContext.Provider value={groupName}>
          {children}
        </GroupContext.Provider>
      </div>
    )
  },
)
AccordionRoot.displayName = 'Accordion'

const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  function AccordionItem(
    {
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const groupName = useContext(GroupContext)
    const isControlled = controlledOpen !== undefined
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
      const next = event.currentTarget.open
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    }

    return (
      <details
        ref={ref}
        className={['eds-accordion__item', className].filter(Boolean).join(' ')}
        name={groupName}
        open={open}
        onToggle={handleToggle}
        {...rest}
      >
        {children}
      </details>
    )
  },
)
AccordionItem.displayName = 'Accordion.Item'

const AccordionHeader = forwardRef<HTMLElement, AccordionHeaderProps>(
  function AccordionHeader({ className, children, ...rest }, ref) {
    return (
      <summary
        ref={ref}
        className={['eds-accordion__header', className]
          .filter(Boolean)
          .join(' ')}
        data-selectable-space="md"
        data-font-size="md"
        {...rest}
      >
        <span
          className="eds-accordion__chevron"
          aria-hidden="true"
          data-color-appearance="accent"
        >
          <Icon data={chevron_down} />
        </span>
        <span
          className="eds-accordion__title"
          data-font-family="ui"
          data-font-size="md"
          data-line-height="squished"
          data-baseline="center"
        >
          {children}
        </span>
      </summary>
    )
  },
)
AccordionHeader.displayName = 'Accordion.Header'

const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel({ className, children, ...rest }, ref) {
    return (
      <div
        className={['eds-accordion__panel', className]
          .filter(Boolean)
          .join(' ')}
        ref={ref}
        data-selectable-space="md"
        {...rest}
      >
        <div
          className="eds-accordion__panel-content"
          data-font-family="ui"
          data-font-size="md"
          data-line-height="default"
        >
          {children}
        </div>
      </div>
    )
  },
)
AccordionPanel.displayName = 'Accordion.Panel'

type CompoundAccordion = typeof AccordionRoot & {
  Item: typeof AccordionItem
  Header: typeof AccordionHeader
  Panel: typeof AccordionPanel
}

export const Accordion = AccordionRoot as CompoundAccordion
Accordion.Item = AccordionItem
Accordion.Header = AccordionHeader
Accordion.Panel = AccordionPanel
