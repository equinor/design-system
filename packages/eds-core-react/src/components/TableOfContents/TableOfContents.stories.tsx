import { Icon, TableOfContents, Typography, TableOfContentsProps } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import { subdirectory_arrow_right } from '@equinor/eds-icons'
import page from './TableOfContents.docs.mdx'

const icons = {
  subdirectory_arrow_right,
}

Icon.add(icons)

const meta: Meta<typeof TableOfContents> = {
  title: 'Navigation/TableOfContents',
  component: TableOfContents,
  subcomponents: {
    LinkItem: TableOfContents.LinkItem,
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            margin: '32px',
            display: 'grid',
            gridGap: '2rem',
            gridTemplateColumns: 'auto 14rem',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<TableOfContentsProps> = (args) => {
  return (
    <>
      <main>
        <article>
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h2" id="sub-section-one">
            Topic 1
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h2" id="sub-section-two">
            A very long topic to test implementation details
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h2" id="sub-section-three">
            Topic 3
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
        </article>
      </main>
      <aside>
        <TableOfContents {...args}>
          <TableOfContents.LinkItem>
            <Typography variant="body_short" link href="#sub-section-one">
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>Topic 1</span>
            </Typography>
          </TableOfContents.LinkItem>
          <TableOfContents.LinkItem title="A very long topic to test proper implementation">
            <Typography variant="body_short" link href="#sub-section-two">
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>A very long topic to test proper implementation</span>
            </Typography>
          </TableOfContents.LinkItem>
          <TableOfContents.LinkItem>
            <Typography variant="body_short" link href="#sub-section-three">
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>Topic 3</span>
            </Typography>
          </TableOfContents.LinkItem>
        </TableOfContents>
      </aside>
    </>
  )
}

/* export const Compact: Story<TableOfContentsProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <main>
        <article>
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h2" id="sub-section-compact-one">
            Topic 1
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h2" id="sub-section-compact-two">
            A very long topic to test implementation details
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h2" id="sub-section-compact-three">
            Topic 3
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
        </article>
      </main>
      <aside>
        <TableOfContents>
          <TableOfContents.LinkItem>
            <Typography
              variant="body_short"
              link
              href="#sub-section-compact-one"
            >
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>Topic 1</span>
            </Typography>
          </TableOfContents.LinkItem>
          <TableOfContents.LinkItem title="A very long topic to test proper implementation">
            <Typography
              variant="body_short"
              link
              href="#sub-section-compact-two"
            >
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>A very long topic to test proper implementation</span>
            </Typography>
          </TableOfContents.LinkItem>
          <TableOfContents.LinkItem>
            <Typography
              variant="body_short"
              link
              href="#sub-section-compact-three"
            >
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>Topic 3</span>
            </Typography>
          </TableOfContents.LinkItem>
        </TableOfContents>
      </aside>
    </EdsProvider>
  )
} */
