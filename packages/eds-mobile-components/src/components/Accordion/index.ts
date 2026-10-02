import { Accordion as _Accordion, AccordionProps } from "./Accordion";
import { AccordionItem, AccordionItemProps } from "./AccordionItem";

export type AccordionFamily = typeof _Accordion & {
    /**
     * An item of the accordion container.
     */
    Item: typeof AccordionItem;
};

const Accordion = _Accordion as AccordionFamily;
Accordion.Item = AccordionItem;

export { Accordion };
export type { AccordionProps, AccordionItemProps };
