import { Card as CardWrapper, CardProps } from './Card'
import { CardActions } from './CardActions'
import { CardMedia } from './CardMedia'
import { CardHeader } from './CardHeader'
import { CardHeaderTitle } from './CardHeaderTitle'

type CardCompoundProps = typeof CardWrapper & {
  // Deprecated
  CardActions: typeof CardActions
  CardHeader: typeof CardHeader
  CardMedia: typeof CardMedia
  CardHeaderTitle: typeof CardHeaderTitle
  // New way
  Actions: typeof CardActions
  Header: typeof CardHeader
  Media: typeof CardMedia
  HeaderTitle: typeof CardHeaderTitle
}

const Card = CardWrapper as CardCompoundProps
// Deprecated
Card.CardActions = CardActions
Card.CardHeader = CardHeader
Card.CardMedia = CardMedia
Card.CardHeaderTitle = CardHeaderTitle
// New
Card.Actions = CardActions
Card.Header = CardHeader
Card.Media = CardMedia
Card.HeaderTitle = CardHeaderTitle

export { Card }
export type { CardProps }
