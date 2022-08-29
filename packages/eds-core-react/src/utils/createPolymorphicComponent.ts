// Move this util to core-react as there is a bug with infering types in other packages when this was in @equinor/eds-utils
// more info: https://github.com/paynecodes/ts-repro-type-annotation-require-symlinks

import React from 'react'

type ExtendedProps<
  Props = Record<string, unknown>,
  OverrideProps = Record<string, unknown>,
> = OverrideProps & Omit<Props, keyof OverrideProps>

type ElementType =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<unknown>

type PropsOf<C extends ElementType> = JSX.LibraryManagedAttributes<
  C,
  React.ComponentPropsWithoutRef<C>
>

type ComponentProp<C> = {
  as?: C
}

type InheritedProps<
  C extends ElementType,
  Props = Record<string, unknown>,
> = ExtendedProps<PropsOf<C>, Props>

export type PolymorphicRef<C> = C extends React.ElementType
  ? React.ComponentPropsWithRef<C>['ref']
  : never

export type PolymorphicComponentProps<
  C,
  Props = Record<string, unknown>,
> = C extends React.ElementType
  ? InheritedProps<C, Props & ComponentProp<C>> & { ref?: PolymorphicRef<C> }
  : Props & { as: React.ElementType }

export function createPolymorphicComponent<
  ComponentDefaultType,
  Props,
  StaticComponents = Record<string, never>,
>(component: unknown) {
  type ComponentProps<C> = PolymorphicComponentProps<C, Props>

  type _PolymorphicComponent = <C = ComponentDefaultType>(
    props: ComponentProps<C>,
  ) => React.ReactElement

  type ComponentProperties = Omit<
    React.FunctionComponent<ComponentProps<unknown>>,
    never
  >

  type PolymorphicComponent = _PolymorphicComponent &
    ComponentProperties &
    StaticComponents

  return component as PolymorphicComponent
}
