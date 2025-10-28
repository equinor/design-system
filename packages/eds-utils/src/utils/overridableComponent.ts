import {
  RefAttributes,
  FC,
  ElementType,
  ComponentPropsWithRef,
  HTMLAttributes,
} from 'react'

export type OverridableComponent<Component, Element extends HTMLElement> = {
  (
    props: Component & HTMLAttributes<Element> & RefAttributes<Element>,
  ): ReturnType<FC>

  <As extends ElementType>(
    props: {
      as?: As
    } & Component &
      Omit<ComponentPropsWithRef<As>, keyof Component>,
  ): ReturnType<FC>
}
