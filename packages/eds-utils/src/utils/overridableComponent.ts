import {
  RefAttributes,
  FC,
  ElementType,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
} from 'react'

// Helper type to extract intrinsic element type from HTML element class
type IntrinsicElementFromHTMLElement<T> = T extends HTMLInputElement
  ? 'input'
  : T extends HTMLTextAreaElement
    ? 'textarea'
    : T extends HTMLButtonElement
      ? 'button'
      : T extends HTMLSelectElement
        ? 'select'
        : T extends HTMLAnchorElement
          ? 'a'
          : T extends HTMLDivElement
            ? 'div'
            : T extends HTMLSpanElement
              ? 'span'
              : T extends HTMLParagraphElement
                ? 'p'
                : never

export type OverridableComponent<
  Component,
  Element extends HTMLElement,
> = {
  (
    props: Component &
      Omit<
        ComponentPropsWithoutRef<IntrinsicElementFromHTMLElement<Element>>,
        keyof Component
      > &
      RefAttributes<Element>,
  ): ReturnType<FC>

  <As extends ElementType>(
    props: {
      as?: As
    } & Component &
      Omit<ComponentPropsWithRef<As>, keyof Component>,
  ): ReturnType<FC>
}
