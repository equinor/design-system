import { forwardRef, ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import {
  outlineTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '@equinor/eds-utils'

const StyledTab = styled.button.attrs<TabProps>(
  ({ active = false, disabled = false }) => ({
    type: 'button',
    role: 'tab',
    'aria-selected': active,
    'aria-disabled': disabled,
    tabIndex: active ? '0' : '-1',
  }),
)<TabProps>(({ theme, active, disabled }) => {
  const {
    entities: { tab },
  } = theme

  return css`
    appearance: none;
    box-sizing: border-box;
    font-family: inherit;
    border: none;
    outline: none;
    font-size: 1rem;
    height: ${tab.height};
    ${spacingsTemplate(tab.spacings)}

    color: ${active
      ? tab.states.active.typography.color
      : tab.typography.color};
    background-color: ${tab.background};
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;

    &:focus {
      outline: none;
    }

    &[data-focus],
    &[data-focus-visible-added]:focus {
      ${outlineTemplate(tab.states.focus.outline)}
    }
    &:focus-visible {
      ${outlineTemplate(tab.states.focus.outline)}
    }
    &::-moz-focus-inner {
      border: 0;
    }
    @media (hover: hover) and (pointer: fine) {
      &[data-hover],
      &:hover {
        color: ${active
          ? tab.states.active.states.hover.typography.color
          : tab.typography.color};
        ${disabled
          ? css`
              background: ${tab.states.disabled.background};
              cursor: not-allowed;
            `
          : css`
              background: ${tab.states.hover.background};
              cursor: pointer;
            `}
      }
    }

    ${disabled
      ? bordersTemplate(tab.states.disabled.border)
      : bordersTemplate(tab.border)}
    ${active && bordersTemplate(tab.states.active.border)}
  `
})

export type TabProps = {
  /** If `true`, the tab will be active. */
  active?: boolean
  /** If `true`, the tab will be disabled. */
  disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  props,
  ref,
) {
  return <StyledTab ref={ref} {...props} />
})
