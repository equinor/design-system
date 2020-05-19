import { Card as CardComponent } from './Card'
import { CardActions } from './CardActions'
import { CardMedia } from './CardMedia'
import { CardHeader } from './CardHeader'
import { CardHeaderTitle } from './CardHeaderTitle'

/** @type {typeof import('./types').Card} */
// @ts-ignore
const Card = CardComponent

Card.CardActions = CardActions
Card.CardHeader = CardHeader
Card.CardMedia = CardMedia
Card.CardHeaderTitle = CardHeaderTitle

export { Card }
