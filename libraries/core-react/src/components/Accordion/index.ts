import { Accordion as BaseAccordion } from './Accordion'
import { AccordionItem, AccordionItemProps } from './AccordionItem'
import { AccordionHeader, AccordionHeaderProps } from './AccordionHeader'
import {
  AccordionHeaderTitle,
  AccordionHeaderTitleProps,
} from './AccordionHeaderTitle'
import { AccordionPanel, AccordionPanelProps } from './AccordionPanel'
import type { AccordionProps } from './Accordion.types'

type AccordionCompoundProps = typeof BaseAccordion & {
  Item: typeof AccordionItem
  Header: typeof AccordionHeader
  HeaderTitle: typeof AccordionHeaderTitle
  Panel: typeof AccordionPanel
}

const Accordion = BaseAccordion as AccordionCompoundProps
Accordion.Item = AccordionItem
Accordion.Header = AccordionHeader
Accordion.HeaderTitle = AccordionHeaderTitle
Accordion.Panel = AccordionPanel

Accordion.Item.displayName = 'Accorion.Item'
Accordion.Header.displayName = 'Accorion.Header'
Accordion.HeaderTitle.displayName = 'Accorion.HeaderTitle'
Accordion.Panel.displayName = 'Accorion.Panel'

export { Accordion }
export type {
  AccordionProps,
  AccordionPanelProps,
  AccordionHeaderProps,
  AccordionHeaderTitleProps,
  AccordionItemProps,
}
