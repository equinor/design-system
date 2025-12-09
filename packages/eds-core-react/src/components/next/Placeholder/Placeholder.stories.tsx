import { Placeholder, PlaceholderProps } from './Placeholder'
import { StoryFn, Meta } from '@storybook/react-vite'

const meta: Meta<typeof Placeholder> = {
  title: 'EDS 2.0 (beta)/Placeholder',
  component: Placeholder,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Placeholder } from '@equinor/eds-core-react/next'
\`\`\`

This is a placeholder component for testing the \`/next\` entry point.
It will be removed once real EDS 2.0 components are added.
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<PlaceholderProps> = (args) => {
  return <Placeholder {...args} />
}
Introduction.args = {
  text: 'Hello from EDS 2.0!',
}
