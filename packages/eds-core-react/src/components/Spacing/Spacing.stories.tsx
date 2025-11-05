import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Typography/Heading'
import { Paragraph } from '../Typography/Paragraph'
import './Spacing.stories.css'
import { TypographyNext as Typography } from '../Typography/Typography.new'

const meta: Meta = {
  title: 'Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component: `

The Equinor Design System provides a simplified spacing utility system focused on practical use cases.

## Utility Classes

### Selectable Padding

Padding utilities for interactive elements like buttons, cards, and other selectable items:

* **\`.selectable-p\`** or **\`[data-selectable-padding]\`**: Applies both horizontal and vertical padding
* **\`.selectable-px\`**: Horizontal padding only
* **\`.selectable-py\`**: Vertical padding only

These padding utilities respond to:
- Density mode (\`data-density\`: spacious/comfortable)
- Selectable space size (\`data-selectable-space\`: xs/sm/md/lg/xl)
- Space proportions (\`data-space-proportions\`: squished/squared/stretched)

### Container Padding

Padding utilities for container elements:

* **\`.container-p\`**: Applies both horizontal and vertical padding
* **\`.container-px\`**: Horizontal padding only
* **\`.container-py\`**: Vertical padding only

These padding utilities respond to:
- Space proportions (\`data-space-proportions\`: squished/squared/stretched)

### Page Padding

Padding utilities for page-level elements:

* **\`.page-p\`**: Applies both horizontal and vertical padding
* **\`.page-px\`**: Horizontal padding only
* **\`.page-py\`**: Vertical padding only

These padding utilities respond to:
- Space proportions (\`data-space-proportions\`: squished/squared/stretched)

### Gap Utilities

Gap spacing for layout containers:

* **\`.selectable-gap\`**: For groups of selectable items (uses xs spacing)
* **\`.container-gap\`**: For general container layouts (uses md spacing)
* **\`.page-gap\`**: For page-level layouts (uses xl spacing)

Each gap utility also has directional variants:
- \`*-x\`: Horizontal gap only
- \`*-y\`: Vertical gap only    
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

/* Internal story components */

type DemoBoxProps = React.ComponentPropsWithoutRef<'div'>

const DemoBox = ({ className = '', ...props }: DemoBoxProps) => (
  <div className={`spacing-demo-box ${className}`.trim()} {...props} />
)

type DemoCardProps = {
  title: string
  text: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  proportions?: 'squished' | 'squared' | 'stretched'
  className?: string
  children?: React.ReactNode
}

const DemoCard = ({
  title,
  text,
  size = 'md',
  proportions = 'squared',
  className = '',
  children,
}: DemoCardProps) => (
  <div
    className={`spacing-demo-card flex flex-col selectable-p container-gap ${className}`.trim()}
    data-selectable-space={size}
    data-space-proportions={proportions}
  >
    <div className="flex flex-col selectable-gap">
      <Heading as="h4">{title}</Heading>
      <Paragraph>{text}</Paragraph>
    </div>
    {children}
  </div>
)

type DemoButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  proportions?: 'squished' | 'squared' | 'stretched'
}

const DemoButton = ({
  children,
  variant = 'primary',
  size = 'md',
  proportions = 'squished',
}: DemoButtonProps) => (
  <button
    className={`selectable-p spacing-demo-button-${variant}`}
    data-selectable-space={size}
    data-space-proportions={proportions}
  >
    <Typography
      family="ui"
      size="md"
      baseline="center"
      lineHeight="squished"
      weight="normal"
      tracking="normal"
    >
      {children}
    </Typography>
  </button>
)

type DemoSectionProps = {
  title: string
  description?: string
  children: React.ReactNode
}

const DemoSection = ({ title, description, children }: DemoSectionProps) => (
  <div className="flex flex-col page-gap-y">
    <Heading as="h3" className="mb-4">
      {title}
    </Heading>
    {description && <Paragraph className="mb-4">{description}</Paragraph>}
    {children}
  </div>
)

export const SelectablePadding: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <DemoSection
        title="Selectable Padding"
        description="The .selectable-p utility provides padding that responds to density, selectable space size, and space proportions. Requires both data-selectable-space and data-space-proportions attributes."
      >
        {sizes.map((size) => (
          <div key={size} className="flex flex-col container-gap-y">
            <Heading as="h4" className="mb-3">
              Space: <strong>{size.toUpperCase()}</strong>
            </Heading>
            <div className="flex flex-row flex-wrap items-start container-gap-x">
              {proportions.map((proportion) => (
                <div
                  key={`${size}-${proportion}`}
                  className="flex flex-col items-start selectable-gap-x"
                >
                  <Paragraph className="mb-2">
                    <strong>
                      {proportion.charAt(0).toUpperCase() + proportion.slice(1)}
                    </strong>
                    <br />
                    <code>
                      data-selectable-space=&quot;{size}&quot;
                      <br />
                      data-space-proportions=&quot;{proportion}&quot;
                    </code>
                  </Paragraph>
                  <div
                    data-selectable-space={size}
                    data-space-proportions={proportion}
                    className="selectable-p spacing-demo-box"
                  >
                    <Typography
                      family="ui"
                      size="md"
                      baseline="grid"
                      lineHeight="default"
                      weight="normal"
                      tracking="normal"
                    >
                      {size}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </DemoSection>
    )
  },
}

export const DensityModes: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const
    const densities = ['spacious', 'comfortable'] as const

    return (
      <DemoSection
        title="Density Modes"
        description="Selectable padding adapts to density modes (spacious/comfortable) set via the data-density attribute on a parent element."
      >
        {densities.map((density) => (
          <div key={density} className="flex flex-col page-gap-y">
            <Heading as="h3" className="mb-4">
              {density.charAt(0).toUpperCase() + density.slice(1)} Mode
            </Heading>
            <div
              className="flex flex-col container-gap-y"
              data-density={density}
            >
              {sizes.map((size) => (
                <div key={size} className="flex flex-col container-gap-y">
                  <Heading as="h4" className="mb-3">
                    Space: <strong>{size.toUpperCase()}</strong>
                  </Heading>
                  <div className="flex flex-row flex-wrap items-start container-gap-x">
                    {proportions.map((proportion) => (
                      <div
                        key={`${density}-${size}-${proportion}`}
                        className="flex flex-col items-start selectable-gap-x"
                      >
                        <Paragraph className="mb-2">
                          <strong>
                            {proportion.charAt(0).toUpperCase() +
                              proportion.slice(1)}
                          </strong>
                        </Paragraph>
                        <div
                          data-selectable-space={size}
                          data-space-proportions={proportion}
                          className="selectable-p spacing-demo-box"
                        >
                          <Typography
                            family="ui"
                            size="md"
                            baseline="grid"
                            lineHeight="default"
                            weight="normal"
                            tracking="normal"
                          >
                            {size}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </DemoSection>
    )
  },
}

export const GapUtilities: Story = {
  render: () => (
    <div className="flex flex-col page-gap-y">
      <DemoSection
        title="Selectable Gap"
        description="Use .selectable-gap for groups of selectable items like buttons. Uses xs spacing."
      >
        <div className="flex flex-wrap selectable-gap">
          <DemoButton>Button 1</DemoButton>
          <DemoButton>Button 2</DemoButton>
          <DemoButton>Button 3</DemoButton>
        </div>
      </DemoSection>

      <DemoSection
        title="Container Gap"
        description="Use .container-gap for general container layouts. Uses md spacing."
      >
        <div className="flex flex-col container-gap">
          <DemoCard title="Card 1" text="Container content" />
          <DemoCard title="Card 2" text="Container content" />
        </div>
      </DemoSection>

      <DemoSection
        title="Page Gap"
        description="Use .page-gap for page-level layouts. Uses xl spacing."
      >
        <div className="flex flex-col page-gap">
          <DemoCard title="Section 1" text="Page-level content" size="lg" />
          <DemoCard title="Section 2" text="Page-level content" size="lg" />
        </div>
      </DemoSection>
    </div>
  ),
}

export const DirectionalGaps: Story = {
  render: () => (
    <div className="flex flex-col page-gap-y">
      <DemoSection
        title="Horizontal Gap Only"
        description="Use the -x suffix for horizontal gap only."
      >
        <div className="flex flex-wrap selectable-gap-x">
          <DemoBox className="size-32" />
          <DemoBox className="size-32" />
          <DemoBox className="size-32" />
        </div>
      </DemoSection>

      <DemoSection
        title="Vertical Gap Only"
        description="Use the -y suffix for vertical gap only."
      >
        <div className="flex flex-col container-gap-y">
          <DemoBox className="size-32" />
          <DemoBox className="size-32" />
          <DemoBox className="size-32" />
        </div>
      </DemoSection>
    </div>
  ),
}

export const DirectionalPadding: Story = {
  render: () => (
    <div className="flex flex-col page-gap-y">
      <DemoSection
        title="Horizontal Padding Only"
        description="Use .selectable-px for horizontal padding only."
      >
        <div
          className="selectable-px spacing-demo-box"
          data-selectable-space="lg"
          data-space-proportions="squared"
        >
          Horizontal padding only
        </div>
      </DemoSection>

      <DemoSection
        title="Vertical Padding Only"
        description="Use .selectable-py for vertical padding only."
      >
        <div
          className="selectable-py spacing-demo-box"
          data-selectable-space="lg"
          data-space-proportions="squared"
        >
          <Typography
            family="ui"
            size="md"
            baseline="grid"
            lineHeight="default"
            weight="normal"
            tracking="normal"
          >
            Vertical padding only
          </Typography>
        </div>
      </DemoSection>
    </div>
  ),
}

export const ContainerPadding: Story = {
  render: () => {
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <DemoSection
        title="Container Padding"
        description="The .container-p utility provides padding for container elements that responds to space proportions. Requires the data-space-proportions attribute."
      >
        <div className="flex flex-row flex-wrap items-start container-gap-x">
          {proportions.map((proportion) => (
            <div
              key={proportion}
              className="flex flex-col items-start selectable-gap-x"
            >
              <Paragraph className="mb-2">
                <strong>
                  {proportion.charAt(0).toUpperCase() + proportion.slice(1)}
                </strong>
                <br />
                <code>data-space-proportions=&quot;{proportion}&quot;</code>
              </Paragraph>
              <div
                data-space-proportions={proportion}
                className="container-p spacing-demo-box"
              >
                <Typography
                  family="ui"
                  size="md"
                  baseline="grid"
                  lineHeight="default"
                  weight="normal"
                  tracking="normal"
                >
                  Container
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </DemoSection>
    )
  },
}

export const PagePadding: Story = {
  render: () => {
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <DemoSection
        title="Page Padding"
        description="The .page-p utility provides padding for page-level elements that responds to space proportions. Requires the data-space-proportions attribute."
      >
        <div className="flex flex-row flex-wrap items-start container-gap-x">
          {proportions.map((proportion) => (
            <div
              key={proportion}
              className="flex flex-col items-start selectable-gap-x"
            >
              <Paragraph className="mb-2">
                <strong>
                  {proportion.charAt(0).toUpperCase() + proportion.slice(1)}
                </strong>
                <br />
                <code>data-space-proportions=&quot;{proportion}&quot;</code>
              </Paragraph>
              <div
                data-space-proportions={proportion}
                className="page-p spacing-demo-box"
              >
                <Typography
                  family="ui"
                  size="md"
                  baseline="grid"
                  lineHeight="default"
                  weight="normal"
                  tracking="normal"
                >
                  Page
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </DemoSection>
    )
  },
}

export const PracticalExamples: Story = {
  render: () => (
    <div className="flex flex-col page-gap-y">
      <DemoSection title="Button Group">
        <div className="flex flex-wrap selectable-gap">
          <DemoButton>Save</DemoButton>
          <DemoButton variant="secondary">Cancel</DemoButton>
        </div>
      </DemoSection>

      <DemoSection title="Card with Actions">
        <div className="flex flex-col container-gap">
          <DemoCard
            title="Card Title"
            text="This card demonstrates the new spacing utilities with selectable padding and gap utilities."
            size="lg"
          >
            <div className="flex selectable-gap">
              <DemoButton>Action</DemoButton>
              <DemoButton variant="secondary">Cancel</DemoButton>
            </div>
          </DemoCard>
        </div>
      </DemoSection>
    </div>
  ),
}
