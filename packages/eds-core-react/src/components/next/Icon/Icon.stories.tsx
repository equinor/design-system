import { StoryFn, Meta } from '@storybook/react-vite'
import {
  save,
  add,
  arrow_forward,
  warning_filled,
  delete_forever,
} from '@equinor/eds-icons'
import { Icon, IconProps } from '.'
import { Button } from '../Button'
import { Chip } from '../Chip'
import { Link } from '../Link'
import { CSSProperties, ReactNode } from 'react'
import page from './Icon.docs.mdx'

/* Story helper components - keeps code preview clean */
const Stack = ({
  children,
  direction = 'row',
  gap = 16,
  align,
}: {
  children: ReactNode
  direction?: 'row' | 'column'
  gap?: number
  align?: CSSProperties['alignItems']
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: `${gap}px`,
      alignItems: align,
    }}
  >
    {children}
  </div>
)

type LabelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

const Text = ({
  children,
  size = 'md',
  secondary,
}: {
  children: ReactNode
  size?: LabelSize
  secondary?: boolean
}) => (
  <p
    style={{
      margin: 0,
      fontFamily: 'var(--eds-font-family-ui)',
      fontSize: `var(--eds-typography-label-${size}-font-size)`,
      lineHeight: `var(--eds-typography-label-${size}-line-height)`,
      color: secondary ? 'var(--eds-text-secondary)' : undefined,
    }}
  >
    {children}
  </p>
)

const IconDemo = ({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) => (
  <div style={{ textAlign: 'center' }}>
    <Text size="xs" secondary>
      {label}
    </Text>
    {children}
  </div>
)

const SIZES = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const

const DENSITIES = ['compact', 'comfortable', 'relaxed'] as const

const meta: Meta<typeof Icon> = {
  title: 'Beta/Icon',
  component: Icon,
  tags: ['beta'],
  argTypes: {
    color: {
      control: 'color',
    },
    size: {
      control: 'select',
      options: [undefined, ...SIZES],
    },
  },
  parameters: {
    docs: {
      page,
    },
  },
}

export default meta

export const Introduction: StoryFn<IconProps> = (args) => {
  return <Icon {...args} />
}
Introduction.args = {
  data: save,
  title: 'Save document',
}

export const Overview: StoryFn<IconProps> = () => (
  <Stack gap={16} align="center">
    <Icon data={save} />
    <Icon data={add} size="lg" />
    <Icon data={warning_filled} size="md" />
    <Icon data={delete_forever} color="var(--eds-icon-on-default-danger)" />
  </Stack>
)

export const ExplicitSizes: StoryFn<IconProps> = () => (
  <Stack gap={16} align="flex-end">
    {SIZES.map((size) => (
      <IconDemo key={size} label={size}>
        <Icon data={save} size={size} />
      </IconDemo>
    ))}
  </Stack>
)
ExplicitSizes.parameters = {
  docs: {
    description: {
      story: `
Each size is the spacing token of the same name. Without \`size\`, the icon is \`xl\`. To choose a size, use the spacing variable the icon is bound to in Figma. There is no fixed size per text size: Button pairs label md with \`lg\`, Chip and Link pair it with \`md\`.

| Size  | Token               | Comfortable |
|-------|---------------------|-------------|
| sm    | \`--eds-spacing-sm\`  | 12px        |
| md    | \`--eds-spacing-md\`  | 16px        |
| lg    | \`--eds-spacing-lg\`  | 20px        |
| xl    | \`--eds-spacing-xl\`  | 24px        |
| 2xl   | \`--eds-spacing-2xl\` | 28px        |
| 3xl   | \`--eds-spacing-3xl\` | 32px        |
| 4xl   | \`--eds-spacing-4xl\` | 40px        |
| 5xl   | \`--eds-spacing-5xl\` | 48px        |
| 6xl   | \`--eds-spacing-6xl\` | 64px        |
| 7xl   | \`--eds-spacing-7xl\` | 80px        |
      `,
    },
  },
}

export const InlineWithText: StoryFn<IconProps> = () => (
  <Stack direction="column" gap={16}>
    <Text size="lg">
      <Icon data={warning_filled} /> Label lg with the default icon size
    </Text>
    <Text size="md">
      <Icon data={warning_filled} size="lg" /> Label md with{' '}
      <code>size=&quot;lg&quot;</code>
    </Text>
    <Text size="sm">
      <Icon data={warning_filled} size="md" /> Label sm with{' '}
      <code>size=&quot;md&quot;</code>
    </Text>
  </Stack>
)
InlineWithText.parameters = {
  docs: {
    description: {
      story:
        'The icon size does not follow the text. Next to smaller text, set `size` to the spacing token the design uses. An inline icon is centred on the text.',
    },
  },
}

export const Densities: StoryFn<IconProps> = () => (
  <Stack gap={48}>
    {DENSITIES.map((density) => (
      <div key={density} data-density={density}>
        <Text size="sm" secondary>
          {density}
        </Text>
        <Stack gap={16} align="flex-end">
          {(['md', 'lg', 'xl'] as const).map((size) => (
            <IconDemo key={size} label={size}>
              <Icon data={save} size={size} />
            </IconDemo>
          ))}
          <IconDemo label="default">
            <Icon data={add} />
          </IconDemo>
        </Stack>
      </div>
    ))}
  </Stack>
)
Densities.parameters = {
  docs: {
    description: {
      story:
        'Set `data-density` on an ancestor. Every size, including the default, follows the spacing scale and changes with the density.',
    },
  },
}

export const Color: StoryFn<IconProps> = () => (
  <Stack direction="column" gap={16}>
    <Stack gap={16}>
      <Icon data={save} color="var(--eds-icon-primary)" />
      <Icon data={save} color="var(--eds-icon-secondary)" />
      <Icon data={save} color="var(--eds-icon-on-default-accent)" />
      <Icon data={save} color="var(--eds-icon-on-default-danger)" />
    </Stack>
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--eds-font-family-ui)',
        fontSize: 'var(--eds-typography-label-md-font-size)',
        lineHeight: 'var(--eds-typography-label-md-line-height)',
        color: 'var(--eds-text-on-default-success)',
      }}
    >
      <Icon data={save} size="md" /> Inherits the text colour
    </p>
  </Stack>
)
Color.parameters = {
  docs: {
    description: {
      story:
        'Icons use `currentColor` by default, so they take the colour of the surrounding text. To set a colour, pass a semantic icon token such as `var(--eds-icon-secondary)` to `color`, never a raw colour value.',
    },
  },
}

export const InsideComponents: StoryFn<IconProps> = () => (
  <Stack gap={24} align="center">
    <Button>
      <Icon data={add} size="5xl" aria-hidden />
      Add
    </Button>
    <Chip>
      <Icon data={save} aria-hidden />
      Saved
    </Chip>
    <Link href="#" variant="standalone">
      Next page
      <Icon data={arrow_forward} aria-hidden />
    </Link>
  </Stack>
)
InsideComponents.parameters = {
  docs: {
    description: {
      story:
        'Button, Chip and a standalone Link size the icons you pass them, so leave out `size`. The Button here sets `size="5xl"`, and the icon still follows the button.',
    },
  },
}

const Code = ({ children }: { children: string }) => (
  <pre
    style={{
      margin: 0,
      fontSize: 'var(--eds-typography-label-sm-font-size)',
      lineHeight: 'var(--eds-typography-label-sm-line-height)',
    }}
  >
    {children}
  </pre>
)

export const DecorativeAndSemantic: StoryFn<IconProps> = () => (
  <Stack direction="column" gap={24}>
    <Stack gap={12} align="center">
      <Icon data={save} />
      <Text>Decorative: hidden from screen readers</Text>
    </Stack>
    <Code>{'<Icon data={save} />'}</Code>
    <Stack gap={12} align="center">
      <Icon data={save} title="Saved" />
      <Text>Semantic: announced as an image named Saved</Text>
    </Stack>
    <Code>{'<Icon data={save} title="Saved" />'}</Code>
    <Stack gap={12} align="center">
      <Button icon aria-label="Delete">
        <Icon data={delete_forever} aria-hidden />
      </Button>
      <Text>Icon-only button: the button carries the name</Text>
    </Stack>
    <Code>
      {
        '<Button icon aria-label="Delete">\n  <Icon data={delete_forever} aria-hidden />\n</Button>'
      }
    </Code>
  </Stack>
)
DecorativeAndSemantic.parameters = {
  docs: {
    description: {
      story:
        'Without `title` an icon is decorative and gets `aria-hidden`. With `title` it gets the `img` role and the title as its name. In an icon-only button, put the name on the button with `aria-label` and keep the icon decorative, so it is not read twice.',
    },
  },
}
