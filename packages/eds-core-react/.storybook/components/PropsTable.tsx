import { Controls, PRIMARY_STORY } from '@storybook/addon-docs'

//@TODO: replace ArgsTable here when storybook adds support for subComponents in <Controls /> or however they'll do it. See https://github.com/storybookjs/storybook/issues/20782
export const PropsTable = ({ story = PRIMARY_STORY, ...props }) => (
  <Controls {...props} />
)
