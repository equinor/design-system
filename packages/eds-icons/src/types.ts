import * as icons from './data'

//@TODO: figure out typescript solution for this (sizes have name with "_small" appended)
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type IconName = keyof typeof icons | string

export type IconData = {
  name: IconName
  prefix: string
  height: string
  width: string
  svgPathData: string | Array<string>
  sizes?: {
    small: Omit<IconData, 'sizes'>
  }
}
