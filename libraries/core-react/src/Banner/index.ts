import { Banner as BaseBanner } from './Banner'
import { BannerIcon } from './BannerIcon'
import { BannerMessage } from './BannerMessage'
import { BannerActions } from './BannerActions'

type BannerProps = typeof BaseBanner & {
  BannerIcon: typeof BannerIcon
  BannerMessage: typeof BannerMessage
  BannerActions: typeof BannerActions
}

const Banner = BaseBanner as BannerProps

Banner.BannerIcon = BannerIcon
Banner.BannerMessage = BannerMessage
Banner.BannerActions = BannerActions

export { Banner }
