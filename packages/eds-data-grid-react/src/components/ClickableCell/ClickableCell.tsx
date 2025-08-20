import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { outlineTemplate } from '@equinor/eds-utils'
import { clickableCell, type ClickableCellToken } from './ClickableCell.tokens'

export type ClickableCellProps = {
  /** Cell content */
  children: React.ReactNode
  /** Click handler */
  onClick: () => void
  /** Accessible label for screen readers */
  ariaLabel?: string
  /** Indicates if the cell is selected */
  isSelected?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>

interface StyledButtonProps {
  $isSelected?: boolean
  $token: ClickableCellToken
}

const StyledButton = styled.button<StyledButtonProps>(
  ({ $token, $isSelected }) => {
    const { states } = $token
    const { focus, hover, active } = states

    return css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;

      background: transparent;
      border: none;
      padding: var(--eds_table__cell__padding_x, 16px);
      margin: 0;
      cursor: pointer;
      outline: none;
      z-index: 1;

      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      text-align: inherit;

      display: flex;
      align-items: center;
      justify-content: flex-start;

      &:hover {
        background: ${hover?.background};
      }

      &:focus {
        outline: none;
      }

      &:focus-visible {
        background: ${focus?.background};
        ${outlineTemplate(focus?.outline)}
        z-index: 2; // Avoids outline overlap when hovering adjacent cell
      }

      ${$isSelected &&
      css`
        background: ${active?.background};
        ${outlineTemplate(active?.outline)}
        z-index: 3; // Avoids outline overlap when hovering adjacent cell
      `}
    `
  },
)

const CellWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
`

export function ClickableCell({
  children,
  onClick,
  ariaLabel,
  isSelected = false,
  ...rest
}: ClickableCellProps) {
  return (
    <CellWrapper>
      <StyledButton
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        type="button"
        $token={clickableCell}
        $isSelected={isSelected}
        {...rest}
      >
        {children}
      </StyledButton>
    </CellWrapper>
  )
}
