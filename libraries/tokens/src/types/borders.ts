export type Border = {
  type?: 'border'
  radius?: string | number
  color: string
  width: string | number
  style: 'solid'
}

export type Bordergroup = {
  type?: 'bordergroup'
  top?: Omit<Border, 'radius | type'>
  left?: Omit<Border, 'type'>
  right?: Omit<Border, 'type'>
  bottom?: Omit<Border, 'radius | type'>
}

export type Borders = Border | Bordergroup
