import * as icons from './data'

export type IconName = keyof typeof icons

export type IconData = {
  name: IconName
  prefix: string
  height: string
  width: string
  svgPathData: string
}
