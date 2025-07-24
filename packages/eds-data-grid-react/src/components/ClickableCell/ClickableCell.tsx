import React, { ButtonHTMLAttributes, useState } from 'react'
import styled, { css } from 'styled-components'
import { bordersTemplate, outlineTemplate } from '@equinor/eds-utils'
import { clickableCell, type ClickableCellToken } from './ClickableCell.tokens'

export type ClickableCellProps = {
  /** Cell content */
  children: React.ReactNode
  /** Click handler */
  onClick: () => void
  /** Accessible label for screen readers */
  ariaLabel?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>

interface StyledButtonProps {
  $token: ClickableCellToken
  $isSelected: boolean
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

      background: ${$isSelected ? active?.background : 'transparent'};
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

      ${bordersTemplate($token.border)}

      &:hover {
        background: ${$isSelected ? active?.background : hover?.background};
      }

      &:focus {
        outline: none;
      }

      &[data-focus-visible-added]:focus {
        ${outlineTemplate(focus?.outline)}
      }

      &:focus-visible {
        background: ${$isSelected ? active?.background : hover?.background};
        ${outlineTemplate(focus?.outline)}
      }

      &:active {
        background: ${active?.background};
        ${outlineTemplate(focus?.outline)}
      }

      &:focus:active {
        background: ${active?.background};
      }

      ${$isSelected &&
      css`
        background: ${active?.background};
        ${outlineTemplate(focus?.outline)}
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
  ...rest
}: ClickableCellProps) {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    setIsSelected(true)
    onClick()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsSelected(true)
      onClick()
    }
  }

  const handleBlur = () => {
    // Reset selection when button loses focus, but keep for a short time to see the effect
    setTimeout(() => setIsSelected(false), 150)
  }

  return (
    <CellWrapper>
      <StyledButton
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-label={ariaLabel}
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
