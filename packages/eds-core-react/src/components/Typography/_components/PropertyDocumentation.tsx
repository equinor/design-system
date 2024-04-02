// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'
import { TypographySize, TypographyTokenCollection } from '../typography.types'
import { getTypographyProperties } from '../typography.utils'

const List = styled.ul`
  font-size: 0.875rem;

  li ~ li {
    margin-top: 4px;
  }
`

type PropertyDocumentationProps = {
  size: TypographySize
  tokens: TypographyTokenCollection
}

export function PropertyDocumentation({
  size,
  tokens,
}: PropertyDocumentationProps) {
  const properties = getTypographyProperties({
    size,
    tokens,
  })

  {
    Object.entries(properties).map(([key, value]) => (
      <li key={key}>
        {key}: {value ?? 'N/A'}
      </li>
    ))
  }
  return (
    <List>
      {Object.entries(properties).map(([key, value]) => (
        <li key={key}>
          {key}: {value ?? 'N/A'}
        </li>
      ))}
    </List>
  )
}
