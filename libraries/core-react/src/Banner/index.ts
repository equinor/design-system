import { Banner as BaseBanner, BannerProps } from './Banner'
import { BannerIcon } from './BannerIcon'
import { BannerMessage } from './BannerMessage'
import { BannerActions } from './BannerActions'

type AllBannerProps = typeof BaseBanner & {
  BannerIcon: typeof BannerIcon
  BannerMessage: typeof BannerMessage
  BannerActions: typeof BannerActions
}

const Banner = BaseBanner as AllBannerProps

Banner.BannerIcon = BannerIcon
Banner.BannerMessage = BannerMessage
Banner.BannerActions = BannerActions

export { Banner, BannerProps }
