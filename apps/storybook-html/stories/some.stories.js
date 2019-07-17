import { storiesOf } from '@storybook/html'
import { css } from 'emotion'

const container = css`
  display: grid;
  align-items: center;
  justify-items: center;
  width: 100vw;
  height: 100vh;
  font-size: xx-large;
`

storiesOf('Some component', module).add(
  'Some story',
  () => `<div class="${container}">Some element</div>`,
)
