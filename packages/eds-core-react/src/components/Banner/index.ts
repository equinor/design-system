'use client'
import { Banner as BaseBanner, BannerProps } from './Banner'
import { BannerIcon, BannerIconProps } from './BannerIcon'
import { BannerMessage, BannerMessageProps } from './BannerMessage'
import { BannerActions, BannerActionsProps } from './BannerActions'

type BannerCompoundProps = typeof BaseBanner & {
  Icon: typeof BannerIcon
  Message: typeof BannerMessage
  Actions: typeof BannerActions
}

const Banner = BaseBanner as BannerCompoundProps
Banner.Icon = BannerIcon
Banner.Message = BannerMessage
Banner.Actions = BannerActions

Banner.Icon.displayName = 'Banner.Icon'
Banner.Message.displayName = 'Banner.Message'
Banner.Actions.displayName = 'Banner.Actions'

export { Banner }
export type {
  BannerProps,
  BannerMessageProps,
  BannerIconProps,
  BannerActionsProps,
}
