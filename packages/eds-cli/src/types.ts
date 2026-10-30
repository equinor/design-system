/**
 * The shape of `build/agent/components.json` in `@equinor/eds-core-react`,
 * written by scripts/generate-agent-data.js in the design-system repository.
 */

export type Prop = {
  name: string
  optional: boolean
  type: string
  default?: string
  description: string
}

/** A React DOM type the props build on, minus the keys an Omit removes */
export type BaseType = {
  name: string
  omitted: string[]
}

export type Example = {
  title: string
  caption?: string
  code: string
}

export type Guidance = {
  features?: string
  usage?: string
  accessibility?: string
  related?: string
}

/** The props of a component or of one part of a compound component */
export type PropList = {
  props: Prop[]
  baseTypes: BaseType[]
}

/** A part of a compound component, such as Field.Label */
export type SubComponent = PropList & {
  name: string
}

export type Component = {
  name: string
  description: string | null
  status: 'active' | 'deprecated'
  importLine: string
  hasAsChild: boolean
  props: Prop[]
  baseTypes: BaseType[]
  subComponents: SubComponent[]
  examples: Example[]
  guidance: Guidance
  links: {
    docs?: string
    figma?: string
    aria?: string
    source?: string
  }
}

export type ComponentData = {
  schemaVersion: number
  package: string
  installLine: string
  components: Component[]
}
