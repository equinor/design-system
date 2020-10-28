import { Accordion as BaseAccordion } from './Accordion'
import { AccordionItem } from './AccordionItem'
import { AccordionHeader } from './AccordionHeader'
import { AccordionHeaderTitle } from './AccordionHeaderTitle'
import { AccordionPanel } from './AccordionPanel'
import type { AccordionProps as Props } from './Accordion.types'

type AllAccordionProps = typeof BaseAccordion & {
  AccordionItem: typeof AccordionItem
  AccordionHeader: typeof AccordionHeader
  AccordionHeaderTitle: typeof AccordionHeaderTitle
  AccordionPanel: typeof AccordionPanel
}

const Accordion = BaseAccordion as AllAccordionProps

Accordion.AccordionItem = AccordionItem
Accordion.AccordionHeader = AccordionHeader
Accordion.AccordionHeaderTitle = AccordionHeaderTitle
Accordion.AccordionPanel = AccordionPanel

export { Accordion }
export type AccordionProps = Props
