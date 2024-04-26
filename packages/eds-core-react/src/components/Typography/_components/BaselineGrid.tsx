// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'

export const BaselineGrid = styled.div`
  --gray: #f2f2f2;
  background: linear-gradient(
    to bottom,
    var(--gray),
    var(--gray) 50%,
    transparent 50%,
    transparent
  );
  background-size: 100% 8px;
  min-height: 32px;
  padding: 4px;
  display: flex;
  flex-flow: column;
  gap: 16px;
`
