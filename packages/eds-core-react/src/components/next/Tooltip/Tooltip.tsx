import {
  cloneElement,
  forwardRef,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
} from 'react'
import type { TooltipProps } from './Tooltip.types'

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      title,
      placement = 'top',
      disabled,
      children,
      className,
      onMouseEnter: onMouseEnterProp,
      onMouseLeave: onMouseLeaveProp,
      ...rest
    },
    ref,
  ) {
    const uid = useId()
    const tooltipId = `eds-tooltip-${uid.replace(/:/g, '')}`
    const anchorName = `--${tooltipId}`
    const tooltipRef = useRef<HTMLDivElement>(null)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const active = Boolean(title) && !disabled

    const show = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      if (!tooltipRef.current?.matches(':popover-open')) {
        tooltipRef.current?.showPopover()
      }
    }

    // Short delay so mouse can travel from trigger to tooltip (WCAG 1.4.13 — hoverable)
    const hide = () => {
      hideTimer.current = setTimeout(() => {
        if (tooltipRef.current?.matches(':popover-open')) {
          tooltipRef.current.hidePopover()
        }
      }, 100)
    }

    // Merge forwarded ref with internal ref
    const setRef = (node: HTMLDivElement | null) => {
      tooltipRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    if (!active) return children

    return (
      <span
        className="eds-tooltip-anchor"
        style={{ '--tooltip-anchor-name': anchorName } as CSSProperties}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {cloneElement(children as ReactElement<HTMLAttributes<HTMLElement>>, {
          'aria-describedby': tooltipId,
        })}
        <div
          ref={setRef}
          id={tooltipId}
          role="tooltip"
          // hint: top-layer + Escape/light-dismiss. Safari falls back to manual (no Escape).
          popover="hint"
          className={['eds-tooltip', className].filter(Boolean).join(' ')}
          data-placement={placement}
          data-space-proportions="squished"
          {...rest}
          onMouseEnter={(e) => {
            if (hideTimer.current) clearTimeout(hideTimer.current)
            onMouseEnterProp?.(e)
          }}
          onMouseLeave={(e) => {
            hide()
            onMouseLeaveProp?.(e)
          }}
        >
          <span
            className="label"
            data-font-family="ui"
            data-font-size="sm"
            data-baseline="center"
          >
            {title}
          </span>
        </div>
      </span>
    )
  },
)

Tooltip.displayName = 'Tooltip'
