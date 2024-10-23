import styled from 'styled-components'

export const BaselineGrid = styled.div`
  /*TODO: find color that work in dark mode, or use an existing token if possible*/
  --_line: var(--baseline-grid-color, light-dark(#f2f2f2, #f2f2f2));
  background: linear-gradient(
    to bottom,
    var(--_line),
    var(--_line) 50%,
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
