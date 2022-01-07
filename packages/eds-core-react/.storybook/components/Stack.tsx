import styled from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  @media screen and (min-width: 600px) {
    flex-direction: row;
  }
`
