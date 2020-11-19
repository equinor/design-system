import { tokens } from '@equinor/eds-tokens'
import type { Typography } from '@equinor/eds-tokens'

const {
  typography: { paragraph },
} = tokens

type ListToken = {
  typography: Typography
}

export const list: ListToken = {
  typography: paragraph.body_short,
}
