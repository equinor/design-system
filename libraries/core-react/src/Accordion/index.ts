import { Accordion as BaseAccordion } from './Accordion'
import { AccordionItem } from './AccordionItem'
import { AccordionHeaderTitle, AccordionHeader } from './AccordionHeader'
import { AccordionPanel } from './AccordionPanel'
import type { AccordionProps } from './Accordion.types'

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

export { Accordion, AccordionProps }
