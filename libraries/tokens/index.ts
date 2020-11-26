import { tokens as baseTokens } from './base'
import { primary } from './components/button/primary'
import { secondary } from './components/button/secondary'
import { danger } from './components/button/danger'
import { disabled } from './components/button/disabled'

const tokens = {
  ...baseTokens,
  components: {
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
