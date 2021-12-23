import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: { paragraph },
} = tokens

type ListToken = ComponentToken

export const list: ListToken = {
  typography: paragraph.body_short,
}
