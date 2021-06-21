// import original module declarations
import 'styled-components'
import { ComponentToken } from '@equinor/eds-tokens'
// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends ComponentToken
}
