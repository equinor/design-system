import { Accordion as AccordionComponent } from './Accordion'
import { AccordionItem } from './AccordionItem'
import { AccordionHeaderTitle, AccordionHeader } from './AccordionHeader'
import { AccordionPanel } from './AccordionPanel'

/** @type {typeof import('./types').Accordion} */
// @ts-ignore
const Accordion = AccordionComponent

Accordion.AccordionItem = AccordionItem
Accordion.AccordionHeader = AccordionHeader
Accordion.AccordionHeaderTitle = AccordionHeaderTitle
Accordion.AccordionPanel = AccordionPanel

export { Accordion }
