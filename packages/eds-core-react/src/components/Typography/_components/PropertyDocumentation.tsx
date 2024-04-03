// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'
import { TypographySize, TypographyTokenCollection } from '../typography.types'
import { getTypographyProperties } from '../typography.utils'

const List = styled.ul`
  font-family: 'Inter', Arial, sans-serif;
  font-size: 0.875rem;
  background: #f9f9f9;
  padding: 1rem;
  list-style-position: inside;

  li ~ li {
    margin-top: 4px;
  }
`

const Key = styled.span`
  font-weight: 500;
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

  return (
    <List>
      {Object.entries(properties).map(([key, value]) => (
        <li key={key}>
          <Key>{key}</Key>: {value ?? 'N/A'}
        </li>
      ))}
    </List>
  )
}
