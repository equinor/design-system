import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from '.'

const meta: Meta<typeof Divider> = {
  title: 'EDS 2.0 (beta)/Divider',
  component: Divider,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { Divider } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Divider>

export const Introduction: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <p>Above the divider</p>
      <Divider />
      <p>Below the divider</p>
    </div>
  ),
}
