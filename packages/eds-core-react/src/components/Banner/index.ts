import { Banner as BaseBanner, BannerProps } from './Banner'
import { BannerIcon, BannerIconProps } from './BannerIcon'
import { BannerMessage, BannerMessageProps } from './BannerMessage'
import { BannerActions, BannerActionsProps } from './BannerActions'
import { BannerContent, BannerContentProps } from './BannerContent'

type BannerCompoundProps = typeof BaseBanner & {
  Icon: typeof BannerIcon
  Message: typeof BannerMessage
  Actions: typeof BannerActions
  Content: typeof BannerContent
}

const Banner = BaseBanner as BannerCompoundProps
Banner.Icon = BannerIcon
Banner.Message = BannerMessage
Banner.Actions = BannerActions
Banner.Content = BannerContent

Banner.Icon.displayName = 'Banner.Icon'
Banner.Message.displayName = 'Banner.Message'
Banner.Actions.displayName = 'Banner.Actions'
Banner.Content.displayName = 'Banner.Content'

export { Banner, BannerIcon, BannerMessage, BannerActions, BannerContent }
export type {
  BannerProps,
  BannerMessageProps,
  BannerIconProps,
  BannerActionsProps,
  BannerContentProps,
}
