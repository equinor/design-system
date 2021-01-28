import React from 'react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { Accordion, Button, Icon, AccordionProps } from '@components'
import { Meta, Story } from '@storybook/react'
import {
  attach_file,
  notifications,
  edit,
  delete_to_trash,
} from '@equinor/eds-icons'

Icon.add({ attach_file, notifications, edit, delete_to_trash })

const Wrapper = styled.div`
  & > *:not(:first-child) {
    margin-top: 16px;
  }
`

export default {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: {
    Item: Accordion.Item,
    Header: Accordion.Header,
    HeaderTitle: Accordion.HeaderTitle,
    Panel: Accordion.Panel,
  },
  parameters: {
    docs: {
      description: {
        component: `An accordion allows users to collapse and expand 
        sections of content.`,
      },
    },
  },
} as Meta

export const simple: Story<AccordionProps> = (args) => (
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

export const header: Story<AccordionProps> = () => {
  return (
    <Wrapper>
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
            <Icon
              name="attach_file"
              title="Attach file"
              size={16}
              color="currentColor"
              style={{ marginRight: '32px' }}
            />
            <Icon
              name="notifications"
              title="Notifications"
              size={16}
              color="currentColor"
            />
          </Accordion.Header>
        </Accordion.Item>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.HeaderTitle>
              Chevron left – interactive options right
            </Accordion.HeaderTitle>
            <Button
              variant="ghost_icon"
              onClick={(event) => {
                action('clicked edit button')(event)
                event.stopPropagation()
              }}
            >
              <Icon name="edit" title="Edit" />
            </Button>
            <Button
              variant="ghost_icon"
              onClick={(event) => {
                action('clicked delete button')(event)
                event.stopPropagation()
              }}
              style={{ marginRight: '-16px' }}
            >
              <Icon name="delete_to_trash" title="Delete" />
            </Button>
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
          </Accordion.Header>
        </Accordion.Item>
      </Accordion>
    </Wrapper>
  )
}
