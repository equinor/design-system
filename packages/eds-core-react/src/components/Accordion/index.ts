'use client'
import { Accordion as BaseAccordion } from './Accordion'
import { AccordionItem, AccordionItemProps } from './AccordionItem'
import { AccordionHeader, AccordionHeaderProps } from './AccordionHeader'
import {
  AccordionHeaderTitle,
  AccordionHeaderTitleProps,
} from './AccordionHeaderTitle'
import {
  AccordionHeaderActions,
  AccordionHeaderActionsProps,
} from './AccordionHeaderActions'
import { AccordionPanel, AccordionPanelProps } from './AccordionPanel'
import type { AccordionProps } from './Accordion.types'

type AccordionCompoundProps = typeof BaseAccordion & {
  Item: typeof AccordionItem
  Header: typeof AccordionHeader
  HeaderTitle: typeof AccordionHeaderTitle
  HeaderActions: typeof AccordionHeaderActions
  Panel: typeof AccordionPanel
}

const Accordion = BaseAccordion as AccordionCompoundProps
Accordion.Item = AccordionItem
Accordion.Header = AccordionHeader
Accordion.HeaderTitle = AccordionHeaderTitle
Accordion.HeaderActions = AccordionHeaderActions
Accordion.Panel = AccordionPanel

Accordion.Item.displayName = 'Accordion.Item'
Accordion.Header.displayName = 'Accordion.Header'
Accordion.HeaderTitle.displayName = 'Accordion.HeaderTitle'
Accordion.HeaderActions.displayName = 'Accordion.HeaderActions'
Accordion.Panel.displayName = 'Accordion.Panel'

export { Accordion }
export type {
  AccordionProps,
  AccordionPanelProps,
  AccordionHeaderProps,
  AccordionHeaderTitleProps,
  AccordionHeaderActionsProps,
  AccordionItemProps,
}
