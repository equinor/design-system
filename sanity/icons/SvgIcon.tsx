import type { IconData } from '@equinor/eds-icons'

type IconProps = {
  icon: IconData
  width?: string
  height?: string
}

export const SvgIcon = ({ icon, width = '24', height = '24' }: IconProps): JSX.Element => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
      <path d={icon.svgPathData} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

export const BlockEditorSvgIcon = ({ icon, width = '1em', height = '1em' }: IconProps): JSX.Element => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 25 25">
      <path d={icon.svgPathData} fillRule="evenodd" clipRule="evenodd" fill="currentColor" />
    </svg>
  )
}
