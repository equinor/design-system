import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import {
  Accordion,
  Button,
  Icon,
  AccordionProps,
  Density,
  EdsProvider,
} from '../..'
import { useState, useEffect } from 'react'
import { ComponentMeta, Story } from '@storybook/react'
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

const Wrapper = styled.div`
  & > *:not(:first-child) {
    margin-top: 16px;
  }
`

export default {
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
    },
  },
} as ComponentMeta<typeof Accordion>

export const Introduction: Story<AccordionProps> = (args) => (
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

export const Header: Story<AccordionProps> = () => {
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
Header.decorators = [
  (Story) => (
    <Wrapper>
      <Story />
    </Wrapper>
  ),
]

export const Compact: Story<AccordionProps> = () => {
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
}
Compact.decorators = [
  (Story) => (
    <Wrapper>
      <Story />
    </Wrapper>
  ),
]
