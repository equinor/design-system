import 'styled-components'
import type { ComponentToken } from '@equinor/eds-tokens'

declare module 'styled-components' {
  export interface DefaultTheme extends ComponentToken {
    // You can add any additional theme properties here if needed
  }
}
