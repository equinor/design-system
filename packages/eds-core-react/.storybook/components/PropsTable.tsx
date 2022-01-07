import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs'

export const PropsTable = ({ story = PRIMARY_STORY, ...props }) => (
  <ArgsTable story={story} {...props} />
)
