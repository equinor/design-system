import { OtherComponent } from './OtherComponent'
import { Component as BaseComponent } from './Component'

type ComponentTypes = typeof BaseComponent & {
  OtherComponent: typeof OtherComponent
}

const Component = BaseComponent as ComponentTypes
Component.OtherComponent = OtherComponent

export { Component }
