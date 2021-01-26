import { Accordion as BaseAccordion } from './Accordion'
import { AccordionItem } from './AccordionItem'
import { AccordionHeader } from './AccordionHeader'
import { AccordionHeaderTitle } from './AccordionHeaderTitle'
import { AccordionPanel } from './AccordionPanel'
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

export { Accordion }
export type AccordionProps = Props
