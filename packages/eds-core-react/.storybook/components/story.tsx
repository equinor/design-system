import { Story as SBStory, StoryProps, Preview } from '@storybook/addon-docs'

export const Story = (props: StoryProps) => (
  <Preview>
    <SBStory {...props}></SBStory>
  </Preview>
)
