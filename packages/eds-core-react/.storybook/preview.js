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
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewMode: 'docs',
  options: {
    storySort: {
      method: '',
      order: [
        'Introduction',
        'Data Display',
        'Feedback',
        'Inputs',
        'Navigation',
        'Surfaces',
        'Typography',
        'Icons',
        ['Introduction', 'Preview', 'Icon'],
        '*',
        'Playground',
      ],
    },
  },
}
