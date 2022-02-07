import { Story as SBStory, StoryProps, Canvas } from '@storybook/addon-docs'

export const Story = (props: StoryProps) => (
  <Canvas>
    <SBStory {...props}></SBStory>
  </Canvas>
)
