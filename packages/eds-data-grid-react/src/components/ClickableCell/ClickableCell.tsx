import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'
import { clickableCell, type ClickableCellToken } from './ClickableCell.tokens'

export type ClickableCellProps = {
  /** Cell content */
  children: React.ReactNode
  /** Click handler */
  onClick: () => void
  /** Accessible label for screen readers */
  ariaLabel?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>

const StyledButton = styled.button<{ $token: ClickableCellToken }>`
  /* Fill entire cell completely */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  background: transparent;
  border: none;
  padding: 8px; /* Add back the cell padding inside the button */
  margin: 0;
  cursor: pointer;
  outline: none;

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
    background: ${({ $token }) => $token.states?.hover?.background};
  }

  &:focus-visible {
    background: ${({ $token }) => $token.states?.hover?.background};
    outline: ${({ $token }) =>
      `${$token.states?.focus?.outline?.width} ${$token.states?.focus?.outline?.style} ${$token.states?.focus?.outline?.color}`};
    outline-offset: ${({ $token }) =>
      $token.states?.focus?.outline?.offset || 0};
  }

  &:active {
    background: ${({ $token }) => $token.states?.active?.background};
  }
`

const CellWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0; /* Remove padding from wrapper */
`

export function ClickableCell({
  children,
  onClick,
  ariaLabel,
  ...rest
}: ClickableCellProps) {
  return (
    <CellWrapper>
      <StyledButton
        onClick={onClick}
        aria-label={ariaLabel}
        type="button"
        $token={clickableCell}
        {...rest}
      >
        {children}
      </StyledButton>
    </CellWrapper>
  )
}
