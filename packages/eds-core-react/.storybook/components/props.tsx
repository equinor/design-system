import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs'

export const Props = ({ story = PRIMARY_STORY, ...props }) => (
  <ArgsTable story={story} {...props} />
)
