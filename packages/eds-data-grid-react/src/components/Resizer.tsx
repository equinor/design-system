import { ColumnResizeMode } from '@tanstack/react-table'
import styled from 'styled-components'

type ResizeProps = {
  $columnResizeMode: ColumnResizeMode | null | undefined
  $isResizing: boolean
}

export const ResizeInner = styled.div`
  width: 2px;
  opacity: 0;
  height: 100%;
`

export const Resizer = styled.div<ResizeProps>`
  transform: ${(props) =>
    props.$columnResizeMode === 'onEnd' ? 'translateX(0px)' : 'none'};

  ${ResizeInner} {
    opacity: ${(props) => (props.$isResizing ? 1 : 0)};
  }

  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 5px;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  display: flex;
  justify-content: flex-end;

  /* Make resizer handle have higher specificity to ensure events don't reach the header cell */
  z-index: 1;
`
