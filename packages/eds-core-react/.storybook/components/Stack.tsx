import { styled, StyledObject } from 'styled-components'

type StackProps = {
  direction?: StyledObject<any>['flexDirection']
  align?: StyledObject<any>['alignItems']
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ align }) => align || 'center'};
  gap: 1rem;
  flex-wrap: wrap;
  @media screen and (min-width: 600px) {
    flex-direction: ${({ direction }) => direction || 'row'};
  }
`
