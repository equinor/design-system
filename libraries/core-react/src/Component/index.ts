import { OtherComponent, OtherComponentProps } from './OtherComponent'
import { Component as BaseComponent } from './Component'

type ComponentProps = typeof BaseComponent & {
  OtherComponent: typeof OtherComponent
}

const Component = BaseComponent as ComponentProps
Component.OtherComponent = OtherComponent

export { Component, ComponentProps }
