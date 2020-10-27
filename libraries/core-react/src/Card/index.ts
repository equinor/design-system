import { Card as CardWrapper } from './Card'
import { CardActions } from './CardActions'
import { CardMedia } from './CardMedia'
import { CardHeader } from './CardHeader'
import { CardHeaderTitle } from './CardHeaderTitle'

type CardProps = typeof CardWrapper & {
  CardActions: typeof CardActions
  CardHeader: typeof CardHeader
  CardMedia: typeof CardMedia
  CardHeaderTitle: typeof CardHeaderTitle
}

const Card = CardWrapper as CardProps

Card.CardActions = CardActions
Card.CardHeader = CardHeader
Card.CardMedia = CardMedia
Card.CardHeaderTitle = CardHeaderTitle

export { Card, CardProps }
