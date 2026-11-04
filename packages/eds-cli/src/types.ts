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

/** A hook exported with a component, such as useFieldIds with Field */
export type Hook = {
  name: string
  description: string
  importLine: string
  signature: string
  /** The fields of the object the hook returns */
  returns: Prop[]
}

export type Component = {
  name: string
  description: string | null
  /**
   * `utility` for an export that is not a UI component (Slot). Missing in data
   * from before it was added, which means `component`.
   */
  kind?: 'component' | 'utility'
  status: 'active' | 'deprecated'
  importLine: string
  hasAsChild: boolean
  props: Prop[]
  /**
   * Type parameters of a generic component, such as `T = string`. Missing in
   * data from before they were added.
   */
  typeParameters?: string[]
  baseTypes: BaseType[]
  subComponents: SubComponent[]
  /** Missing in data from before hooks were added */
  hooks?: Hook[]
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
