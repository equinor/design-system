/* import { GlobalStyleDark } from '../stories/testing/GlobalStyles'
 */

/* export const decorators = [
  (Story) => (
    <>
      <GlobalStyleDark />
      <Story />
    </>
  ),
]
 */
import { withTests } from '@storybook/addon-jest'

import results from '../.jest-test-results.json'

export const decorators = [
  withTests({
    results,
    filesExt: '.test.tsx',
  }),
]
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewMode: 'docs',
}
