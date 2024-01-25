import { list, IconData } from '@equinor/eds-icons'

import { SvgIcon, BlockEditorSvgIcon } from './SvgIcon'

export const EdsList = (): JSX.Element => {
  return <SvgIcon icon={list} />
}

export const EdsIcon = (icon: IconData): JSX.Element => {
  return <SvgIcon icon={icon} />
}

export const EdsBlockEditorIcon = (icon: IconData): JSX.Element => {
  return <BlockEditorSvgIcon icon={icon} />
}
