import { tokens } from '@equinor/eds-tokens'
import type { Typography, ComponentToken } from '@equinor/eds-tokens'

const {
  typography: { paragraph },
} = tokens

type ListToken = ComponentToken & {
  typography: Typography
}

export const list: ListToken = {
  typography: paragraph.body_short,
}
