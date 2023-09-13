import { forwardRef, ButtonHTMLAttributes, ElementType } from 'react'
import { styled, css } from 'styled-components'
import {
  outlineTemplate,
  spacingsTemplate,
  bordersTemplate,
  typographyTemplate,
  OverridableComponent,
} from '@equinor/eds-utils'

type OverridableSubComponent = OverridableComponent<
  TabProps,
  HTMLButtonElement
> & {
  displayName?: string
}
type StyledTabProps = {
  $active?: boolean
  disabled: boolean
  $value: string | number
}

const StyledTab = styled.button.attrs<StyledTabProps>(
  ({ $active = false, disabled = false, $value }) => ({
    type: 'button',
    role: 'tab',
    'aria-selected': $active,
    'aria-disabled': disabled,
    tabIndex: $value ? 0 : $active ? 0 : -1,
  }),
)<StyledTabProps>(({ theme, $active, disabled }) => {
  const {
    entities: { tab },
  } = theme

  return css`
    appearance: none;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    border: none;
    outline: none;
    height: ${tab.height};
    ${spacingsTemplate(tab.spacings)}
    ${typographyTemplate(tab.typography)}

    color: ${$active
      ? tab.states.active.typography.color
      : tab.typography.color};
    background-color: ${tab.background};
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;
    overflow-x: hidden;

    scroll-snap-align: end;
    scroll-snap-stop: always;

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
        color: ${$active
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
    ${$active && bordersTemplate(tab.states.active.border)}
  `
})

export type TabProps = {
  /** @ignore */
  active?: boolean
  /** Optional to `onChange` on Tabs. A value that when matched with
   * `activeTab` will set tab as active (such as the path when using third party routers) */
  value?: number | string
  /** If `true`, the tab will be disabled. */
  disabled?: boolean
  /** Override element type */
  as?: ElementType
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Tab: OverridableSubComponent = forwardRef<
  HTMLButtonElement,
  TabProps
>(function Tab({ active, value, ...rest }, ref) {
  return <StyledTab ref={ref} $active={active} $value={value} {...rest} />
})
