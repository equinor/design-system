import { tokens as baseTokens } from './base'
import primary from './components/button/buttons-primary.json'
import secondary from './components/button/buttons-secondary.json'
import danger from './components/button/buttons-danger.json'
import disabled from './components/button/buttons-disabled.json'
import table from './components/table/table.json'

const tokens = {
  ...baseTokens,
  components: {
    table,
    button: {
      primary,
      secondary,
      danger,
      disabled,
    },
  },
}

export { tokens }
export * from './src/types'
