import { TypographyNext } from './Typography.new'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import type { TypographyNextProps } from './Typography.new.types'
import { SAMPLE_TEXT, GridBackground } from './Typography.stories.shared'
import { Icon } from '../..'
import * as icons from '@equinor/eds-icons'

Icon.add(icons)

const meta: Meta = {
  title: 'Typography/TypographyNext',
  component: TypographyNext,
  args: {
    family: 'ui',
  },
  parameters: {
    docs: {
      description: {
        component: `

The next generation of the Typography component system. It will replace the existing Typography component in the next major version.

## Features

The new typography system provides baseline grid alignment for consistent vertical rhythm.

## Usage

Import the TypographyNext component with alias for a seamless experience:

\`\`\`tsx
import { TypographyNext as Typography, Heading, Paragraph } from '@equinor/eds-core-react'

<Heading as="h1">Welcome</Heading>
<Paragraph size="lg">This is a paragraph with the new typography system.</Paragraph>
<Typography family="ui" size="md" lineHeight="default" baseline="grid" weight="normal" tracking="normal">
  Flexible inline text
</Typography>
\`\`\`

### Proposed migration timeline

1. **Now**: Use the new components with aliasing (\`TypographyNext as Typography\`)
2. **Parallel support**: 6-12 months of both systems supported

### Key Differences from current typography

* **Component names**: Two opinionated semantic components -  \`Heading\`, and \`Paragraph\`
* **Baseline alignment**: Built-in support for baseline grid alignment
* **Props**: More explicit control over typography properties
* **Semantic HTML**: \`Heading\` renders proper heading tags, \`Paragraph\` renders \`<p>\` tags

        `,
      },
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export default meta

export const Playground: StoryFn<TypographyNextProps> = ({
  debug,
  ...args
}) => {
  const content = (
    <TypographyNext {...args} debug={debug}>
      {SAMPLE_TEXT}
    </TypographyNext>
  )
  return debug ? <GridBackground>{content}</GridBackground> : content
}

Playground.parameters = {
  docs: {
    description: {
      story:
        'The TypographyNext component provides full control over typography properties. Use it for inline text with specific styling needs.',
    },
  },
}

export const AsLink: StoryFn = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TypographyNext
        as="a"
        href="https://eds.equinor.com"
        family="ui"
        size="md"
        baseline="grid"
      >
        Link to EDS documentation
      </TypographyNext>
      <TypographyNext
        as="a"
        href="https://eds.equinor.com"
        family="ui"
        size="lg"
        baseline="grid"
      >
        Large link text
      </TypographyNext>
      <TypographyNext
        as="a"
        href="https://eds.equinor.com"
        family="ui"
        size="sm"
        baseline="grid"
      >
        Small link text
      </TypographyNext>
      <TypographyNext
        as="a"
        href="https://eds.equinor.com"
        target="_blank"
        rel="noopener noreferrer"
        family="ui"
        size="md"
        baseline="grid"
      >
        External link (opens in new tab)
      </TypographyNext>
    </div>
  )
}

AsLink.parameters = {
  docs: {
    description: {
      story:
        'TypographyNext can be used as a link by setting `as="a"` and providing an `href` prop. All standard anchor attributes are supported, such as `target` and `rel` for external links.',
    },
  },
}
