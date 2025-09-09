import { Story as SBStory, StoryProps, Canvas } from '@storybook/blocks'

export const Story = (props: StoryProps) => (
  <Canvas>
    <SBStory {...props}></SBStory>
  </Canvas>
)
