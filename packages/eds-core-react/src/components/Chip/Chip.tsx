import {
  cloneElement,
  Children as ReactChildren,
  forwardRef,
  HTMLAttributes,
} from 'react'
import styled, { css } from 'styled-components'
import { Icon } from './Icon'
import * as tokens from './Chip.tokens'
import {
  spacingsTemplate,
  typographyTemplate,
  outlineTemplate,
  bordersTemplate,
} from '@equinor/eds-utils'

const { enabled, error } = tokens

const { background, height, typography, spacings, border, states } = enabled

type StyleProps = {
  $variant: 'active' | 'error' | 'default'
  $clickable: boolean
  $deletable: boolean
  $disabled: boolean
  $onlyChild: boolean
}

const StyledChips = styled.div.attrs<StyleProps>(
  ({ $clickable, $deletable }) => ({
    tabIndex: $clickable || $deletable ? 0 : null,
    role: $clickable ? 'button' : null,
  }),
)<StyleProps>`
  background: ${background};
  height: ${height};
  width: fit-content;
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;

  svg {
    fill: ${typography.color};
  }

  &:focus {
    outline: none;
  }

  &[data-focus-visible-added]:focus {
    ${outlineTemplate(states.focus.outline)}
  }
  &:focus-visible {
    ${outlineTemplate(states.focus.outline)}
  }
  ${bordersTemplate(border)}

  ${spacingsTemplate(spacings)}
  ${typographyTemplate(typography)}

  ${({ $clickable }) =>
    $clickable &&
    css`
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          cursor: pointer;
          color: ${states.hover.typography.color};
          svg {
            fill: ${states.hover.typography.color};
          }
        }
      }
    `}

  ${({ $variant, $clickable }) => {
    switch ($variant) {
      case 'active':
        return css`
          background: ${states.active.background};
        `
      case 'error':
        return css`
          background: ${error.background};
          color: ${error.typography.color};
          svg {
            fill: ${error.entities.icon.typography.color};
          }
          ${bordersTemplate(error.border)};
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              border-color: ${$clickable &&
              error.states.hover.typography.color};
              color: ${$clickable && error.states.hover.typography.color};

              svg {
                fill: ${$clickable && error.states.hover.typography.color};
              }
            }
          }
        `
      default:
        return ''
    }
  }}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      background: ${background};
      color: ${states.disabled.typography.color};
      svg {
        fill: ${states.disabled.typography.color};
      }
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          color: ${states.disabled.typography.color};
          cursor: not-allowed;

          svg {
            fill: ${states.disabled.typography.color};
          }
        }
      }
    `}

  ${({ $deletable }) =>
    $deletable &&
    css`
      padding-right: 4px;
    `}

  ${({ $onlyChild }) =>
    $onlyChild
      ? css`
          padding-left: 8px;
        `
      : ''}
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
    $disabled: disabled,
    $deletable: deletable,
    $clickable: clickable,
    $onlyChild: onlyChild,
    $variant: variant,
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

  const resizedChildren = ReactChildren.map(
    children,
    (child: React.ReactElement<Record<string, unknown>> | null) => {
      // We force size on Icon & Avatar component
      if (child?.props) {
        return cloneElement(child, {
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
      onKeyDown={handleKeyPress}
    >
      {resizedChildren}
      {onDelete && (
        <Icon
          name="close"
          title="close"
          $disabled={disabled}
          $variant={variant}
          onClick={onDeleteClick}
          size={16}
        />
      )}
    </StyledChips>
  )
})

// Chip.displayName = 'eds-chip'
