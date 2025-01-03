'use client'
import { Card as CardWrapper, CardProps } from './Card'
import { CardActions, CardActionsProps } from './CardActions'
import { CardContent, CardContentProps } from './CardContent'
import { CardMedia, CardMediaProps } from './CardMedia'
import { CardHeader, CardHeaderProps } from './CardHeader'
import { CardHeaderTitle, CardHeaderTitleProps } from './CardHeaderTitle'

type CardCompoundProps = typeof CardWrapper & {
  Actions: typeof CardActions
  Content: typeof CardContent
  Header: typeof CardHeader
  Media: typeof CardMedia
  HeaderTitle: typeof CardHeaderTitle
}

const Card = CardWrapper as CardCompoundProps
Card.Actions = CardActions
Card.Content = CardContent
Card.Header = CardHeader
Card.Media = CardMedia
Card.HeaderTitle = CardHeaderTitle

Card.Actions.displayName = 'Card.Actions'
Card.Content.displayName = 'Card.Content'
Card.Header.displayName = 'Card.Header'
Card.Media.displayName = 'Card.Media'
Card.HeaderTitle.displayName = 'Card.HeaderTitle'

export { Card }
export type {
  CardProps,
  CardActionsProps,
  CardContentProps,
  CardMediaProps,
  CardHeaderProps,
  CardHeaderTitleProps,
}
