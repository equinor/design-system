import { useState } from 'react'
import { action } from 'storybook/actions'
import { Accordion, Button, Icon, AccordionProps } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import {
  attach_file,
  notifications,
  edit,
  delete_to_trash,
  warning_outlined,
  error_outlined,
} from '@equinor/eds-icons'
import page from './Accordion.docs.mdx'

Icon.add({
  attach_file,
  notifications,
  edit,
  delete_to_trash,
  warning_outlined,
  error_outlined,
})

const meta: Meta<typeof Accordion> = {
  title: 'Surfaces/Accordion',
  component: Accordion,
  subcomponents: {
    Item: Accordion.Item,
    Header: Accordion.Header,
    HeaderTitle: Accordion.HeaderTitle,
    HeaderActions: Accordion.HeaderActions,
    Panel: Accordion.Panel,
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
    (Story) => (
      <div style={{ display: 'grid', gap: '16px' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Introduction: StoryFn<AccordionProps> = (args) => {
  return (
    <Accordion {...args}>
      <Accordion.Item isExpanded>
        <Accordion.Header>Header 1</Accordion.Header>
        <Accordion.Panel>Content 1</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Header 2</Accordion.Header>
        <Accordion.Panel>Content 2</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Header 3</Accordion.Header>
        <Accordion.Panel>Content 3</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

export const Header: StoryFn<AccordionProps> = () => {
  return (
    <>
      <Accordion headerLevel="h3" chevronPosition="left">
        <Accordion.Item>
          <Accordion.Header>Chevron left</Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="right">
        <Accordion.Item>
          <Accordion.Header>Chevron right</Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <Accordion.Item isExpanded>
          <Accordion.Header>Chevron left expanded</Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="right">
        <Accordion.Item disabled>
          <Accordion.Header>Disabled</Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="right">
        <Accordion.Item disabled isExpanded>
          <Accordion.Header>Disabled expanded</Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.HeaderTitle>
              Chevron left – custom icons right
            </Accordion.HeaderTitle>
            <Accordion.HeaderActions>
              <Icon
                name="warning_outlined"
                title="Warning"
                size={16}
                color="currentColor"
                style={{ marginRight: '16px' }}
              />
              <Icon
                name="error_outlined"
                title="Error"
                size={16}
                color="currentColor"
              />
            </Accordion.HeaderActions>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.HeaderTitle>
              Chevron left – interactive options right
            </Accordion.HeaderTitle>
            <Accordion.HeaderActions>
              <Button
                variant="ghost_icon"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  action('clicked edit button')(event)
                  event.stopPropagation()
                }}
              >
                <Icon name="edit" title="Edit" />
              </Button>
              <Button
                variant="ghost_icon"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  action('clicked delete button')(event)
                  event.stopPropagation()
                }}
              >
                <Icon name="delete_to_trash" title="Delete" />
              </Button>
            </Accordion.HeaderActions>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.HeaderTitle>
              Very long summary that will get truncated if the width of the
              header is narrower than the length of the text
            </Accordion.HeaderTitle>
            <Accordion.HeaderActions>
              <Button
                variant="ghost_icon"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  action('clicked edit button')(event)
                  event.stopPropagation()
                }}
              >
                <Icon name="edit" title="Edit" />
              </Button>
              <Button
                variant="ghost_icon"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  action('clicked delete button')(event)
                  event.stopPropagation()
                }}
              >
                <Icon name="delete_to_trash" title="Delete" />
              </Button>
              <Button
                variant="ghost_icon"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  action('clicked attach button')(event)
                  event.stopPropagation()
                }}
              >
                <Icon name="attach_file" title="attach file" />
              </Button>
            </Accordion.HeaderActions>
          </Accordion.Header>
          <Accordion.Panel>Content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export const Controlled: StoryFn<AccordionProps> = () => {
  const [expanded, setExpanded] = useState(false)
  const toggleAccordion = (state: boolean) => {
    console.log(state)
    setExpanded(state)
  }

  return (
    <>
      <Button
        onClick={() => toggleAccordion(!expanded)}
        style={{ width: 'fit-content' }}
      >
        {expanded ? 'Collapse ' : 'Expand '} accordion
      </Button>
      <Accordion>
        <Accordion.Item
          isExpanded={expanded}
          onExpandedChange={toggleAccordion}
        >
          <Accordion.Header>Controlled Accordion</Accordion.Header>
          <Accordion.Panel>Content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

/* export const Compact: Story<AccordionProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <>
      <EdsProvider density={density}>
        <Accordion>
          <Accordion.Item isExpanded>
            <Accordion.Header>Header 1</Accordion.Header>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Header 2</Accordion.Header>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Header 3</Accordion.Header>
            <Accordion.Panel>Content 3</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </EdsProvider>
    </>
  )
} */
