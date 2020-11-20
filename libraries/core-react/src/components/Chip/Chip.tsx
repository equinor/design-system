import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from './Icon'
import { chip as tokens } from './Chip.tokens'
import { borderTemplate, spacingsTemplate, typographyTemplate } from '@utils'

const {
  enabled,
  disabled: disabledToken,
  active: activeToken,
  hover,
  error,
  outline,
  outlineOffset,
} = tokens

type StyleProps = {
  variant: 'active' | 'error' | 'default'
  clickable: boolean
  deletable: boolean
  disabled: boolean
}

const StyledChips = styled.div.attrs<StyleProps>(
  ({ clickable, deletable }) => ({
    tabIndex: clickable || deletable ? 0 : null,
    role: clickable ? 'button' : null,
  }),
)<StyleProps>`
  background: ${enabled.background};
  height: ${enabled.height};
  width: fit-content;
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  z-index: 10;

  svg {
    fill: ${enabled.typography.color};
  }

  &:hover {
    color: ${hover.typography.color};
    svg {
      fill: ${hover.typography.color};
    }
  }

  &:focus {
    outline: none;
  }

  &[data-focus-visible-added]:focus {
    outline: ${outline};
    outline-offset: ${outlineOffset};
  }

  ${borderTemplate(enabled.border)}
  ${spacingsTemplate(enabled.spacings)}
  ${typographyTemplate(enabled.typography)}

  ${({ clickable }) =>
    clickable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

    ${({ variant }) => {
      switch (variant) {
        case 'active':
          return css`
            background: ${activeToken.background};
          `
        case 'error':
          return css`
            background: ${error.background};
            border-color: ${error.border.color};
            border-width: ${error.border.width};
            border-style: ${error.border.type};
            color: ${error.typography.color};
            svg {
              fill: ${error.icon.color};
            }

            &:hover {
              border-color: ${error.hover.color};
              color: ${error.hover.color};
              svg {
                fill: ${error.hover.color};
              }
            }
          `
        default:
          return ''
      }
    }}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      background: ${enabled.background};
      color: ${disabledToken.typography.color};
      svg {
        fill: ${disabledToken.typography.color};
      }
      &:hover {
        color: ${disabledToken.typography.color};
        cursor: not-allowed;
        svg {
          fill: ${disabledToken.typography.color};
        }
      }
    `}

  ${({ deletable }) =>
    deletable &&
    css`
      padding-right: 4px;
    `}

  ${({ children }) =>
    typeof children === 'string' &&
    css`
      padding-left: 8px;
    `}
`
export type ChipProps = {
  /** Disabled */
  disabled?: boolean
  /** Delete callback */
  onDelete?: (Event) => void
  /** Variant */
  variant?: 'active' | 'error' | 'default'
} & HTMLAttributes<HTMLDivElement>

export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    children,
    onDelete,
    disabled = false,
    onClick,
    variant = 'default',
    ...other
  },
  ref,
) {
  const handleDelete = disabled ? undefined : onDelete
  const handleClick = disabled ? undefined : onClick

  const deletable = handleDelete !== undefined
  const clickable = handleClick !== undefined
  const onlyChild = typeof children === 'string'

  const chipProps = {
    ...other,
    ref,
    disabled,
    deletable,
    clickable,
    onlyChild,
    variant,
  }

  const handleKeyPress = (
    event:
      | React.KeyboardEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>,
  ) => {
    const { key } = event as React.KeyboardEvent<HTMLDivElement>
    if (key === 'Enter') {
      if (deletable) {
        handleDelete(event)
      }
      // Delete takes precedence, else click action is activated
      if (clickable && !deletable) {
        handleClick(event as React.MouseEvent<HTMLDivElement>)
      }
    }
  }

  type childPropsType = {
    size: number
    disabled: boolean
  }

  const resizedChildren = React.Children.map(
    children,
    (child: React.ReactElement) => {
      // We force size on Icon & Avatar component
      const childProps = child.props as childPropsType
      if (child.props && childProps.size) {
        return React.cloneElement(child, {
          size: 16,
          disabled,
        })
      }
      return child
    },
  )

  const onDeleteClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    if (deletable) {
      handleDelete(event)
    }
  }

  return (
    <StyledChips
      {...chipProps}
      onClick={(event) => clickable && handleClick(event)}
      onKeyPress={handleKeyPress}
    >
      {resizedChildren}
      {onDelete && (
        <Icon
          name="close"
          title="close"
          disabled={disabled}
          variant={variant}
          onClick={onDeleteClick}
          size={16}
        />
      )}
    </StyledChips>
  )
})

// Chip.displayName = 'eds-chip'
