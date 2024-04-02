// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'

const List = styled.ul`
  font-size: 0.875rem;

  li ~ li {
    margin-top: 4px;
  }
`

export function PropertyDocumentation(props: {
  fontSize: string
  lineHeight: string
  fontFamily: string
  color: string
  trimValues?: { capHeightTrim: string; baselineTrim: string }
}) {
  const { fontSize, lineHeight, fontFamily, color, trimValues } = props
  return (
    <List>
      <li>font-size: {`${fontSize}`}</li>
      <li>line-height: {`${lineHeight}`}</li>
      <li>font-family: {fontFamily}</li>
      <li>color: {color}</li>
      <li>capHeightTrim: {trimValues?.capHeightTrim}</li>
      <li>baselineTrim: {trimValues?.baselineTrim}</li>
    </List>
  )
}
