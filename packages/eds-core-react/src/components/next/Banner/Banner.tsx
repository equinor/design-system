import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type {
  BannerProps,
  BannerIconProps,
  BannerMessageProps,
  BannerActionsProps,
} from './Banner.types'
import './banner.css'

const BannerIcon = forwardRef<HTMLSpanElement, BannerIconProps>(
  function BannerIcon({ className, children, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={['eds-banner__icon', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

const BannerMessage = forwardRef<HTMLParagraphElement, BannerMessageProps>(
  function BannerMessage({ className, children, ...rest }, ref) {
    return (
      <TypographyNext
        ref={ref}
        as="p"
        family="ui"
        size="md"
        baseline="center"
        lineHeight="default"
        tracking="normal"
        className={['eds-banner__message', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </TypographyNext>
    )
  },
)

const BannerActions = forwardRef<HTMLDivElement, BannerActionsProps>(
  function BannerActions(
    { placement = 'left', className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={['eds-banner__actions', className].filter(Boolean).join(' ')}
        data-placement={placement}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

const BannerComponent = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { tone = 'info', role = 'status', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['eds-banner', className].filter(Boolean).join(' ')}
      data-color-appearance={tone}
      role={role}
      {...rest}
    >
      {children}
    </div>
  )
})

BannerIcon.displayName = 'Banner.Icon'
BannerMessage.displayName = 'Banner.Message'
BannerActions.displayName = 'Banner.Actions'
BannerComponent.displayName = 'Banner'

type CompoundBanner = typeof BannerComponent & {
  Icon: typeof BannerIcon
  Message: typeof BannerMessage
  Actions: typeof BannerActions
}

export const Banner = BannerComponent as CompoundBanner

Banner.Icon = BannerIcon
Banner.Message = BannerMessage
Banner.Actions = BannerActions
