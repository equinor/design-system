import { Banner as BaseBanner, BannerProps } from './Banner'
import { BannerIcon } from './BannerIcon'
import { BannerMessage } from './BannerMessage'
import { BannerActions } from './BannerActions'

type BannerCompoundProps = typeof BaseBanner & {
  // Deprecated
  BannerIcon: typeof BannerIcon
  BannerMessage: typeof BannerMessage
  BannerActions: typeof BannerActions
  // New
  Icon: typeof BannerIcon
  Message: typeof BannerMessage
  Actions: typeof BannerActions
}

const Banner = BaseBanner as BannerCompoundProps
// Deprecated
Banner.BannerIcon = BannerIcon
Banner.BannerMessage = BannerMessage
Banner.BannerActions = BannerActions
// New
Banner.Icon = BannerIcon
Banner.Message = BannerMessage
Banner.Actions = BannerActions

export { Banner }
export type { BannerProps }
