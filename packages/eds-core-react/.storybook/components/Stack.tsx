import styled, { CSSProperties } from 'styled-components'

type StackProps = {
  direction?: CSSProperties['flexDirection']
  align?: CSSProperties['alignItems']
  display?: CSSProperties['display']
  content?: CSSProperties['justifyContent']
}

export const Stack = styled.div<StackProps>`
  display: ${({ display }) => display || 'flex'};
  flex-direction: column;
  justify-content: ${({ content }) => content || 'center'};
  align-items: ${({ align }) => align || 'center'};
  gap: 1rem;
  flex-wrap: wrap;
  @media screen and (min-width: 600px) {
    flex-direction: ${({ direction }) => direction || 'row'};
  }
`
