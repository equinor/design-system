// import original module declarations
import 'styled-components'
import { ComponentToken } from '@equinor/eds-tokens'
// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ComponentToken {}
}
