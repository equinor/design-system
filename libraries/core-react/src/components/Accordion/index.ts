import { Accordion as BaseAccordion } from './Accordion'
import { AccordionItem, AccordionItemProps } from './AccordionItem'
import { AccordionHeader, AccordionHeaderProps } from './AccordionHeader'
import {
  AccordionHeaderTitle,
  AccordionHeaderTitleProps,
} from './AccordionHeaderTitle'
import { AccordionPanel, AccordionPanelProps } from './AccordionPanel'
import type { AccordionProps as Props } from './Accordion.types'

type AccordionCompoundProps = typeof BaseAccordion & {
  // Deprecated
  AccordionItem: typeof AccordionItem
  AccordionHeader: typeof AccordionHeader
  AccordionHeaderTitle: typeof AccordionHeaderTitle
  AccordionPanel: typeof AccordionPanel
  // New
  Item: typeof AccordionItem
  Header: typeof AccordionHeader
  HeaderTitle: typeof AccordionHeaderTitle
  Panel: typeof AccordionPanel
}

const Accordion = BaseAccordion as AccordionCompoundProps
// Deprecated
Accordion.AccordionItem = AccordionItem
Accordion.AccordionHeader = AccordionHeader
Accordion.AccordionHeaderTitle = AccordionHeaderTitle
Accordion.AccordionPanel = AccordionPanel
// New
Accordion.Item = AccordionItem
Accordion.Header = AccordionHeader
Accordion.HeaderTitle = AccordionHeaderTitle
Accordion.Panel = AccordionPanel

Accordion.Item.displayName = 'Accorion.Item'
Accordion.Header.displayName = 'Accorion.Header'
Accordion.HeaderTitle.displayName = 'Accorion.HeaderTitle'
Accordion.Panel.displayName = 'Accorion.Panel'

export {
  Accordion,
  AccordionPanelProps,
  AccordionHeaderProps,
  AccordionHeaderTitleProps,
  AccordionItemProps,
}
export type AccordionProps = Props
