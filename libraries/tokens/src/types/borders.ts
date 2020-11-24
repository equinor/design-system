export type Border = {
  type?: 'border'
  radius?: string | number
  color?: string
  width?: string | number
  style?: 'solid'
}

export type Outline = {
  type: 'outline'
  color: string
  width: string
  style: 'dashed'
  offset?: string
}

export type Bordergroup = {
  type?: 'bordergroup'
  top?: Omit<Border, 'radius'>
  left?: Border
  right?: Border
  bottom?: Omit<Border, 'radius'>
}

export type Borders = Border | Outline | Bordergroup
