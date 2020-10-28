import React from 'react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import {
  Accordion,
  Button,
  Icon,
  AccordionProps,
} from '@equinor/eds-core-react'
import { Meta, Story } from '@storybook/react'
import {
  attach_file,
  notifications,
  edit,
  delete_to_trash,
} from '@equinor/eds-icons'

const {
  AccordionItem,
  AccordionHeader,
  AccordionHeaderTitle,
  AccordionPanel,
} = Accordion

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
    AccordionItem,
    AccordionHeader,
    AccordionHeaderTitle,
    AccordionPanel,
  },
  argTypes: {
    ref: {
      table: {
        disable: true,
      },
    },
    forwardedAs: {
      table: {
        disable: true,
      },
    },
    as: {
      table: {
        disable: true,
      },
    },
    theme: {
      table: {
        disable: true,
      },
    },
  },
} as Meta

export const simple: Story<AccordionProps> = (args) => (
  <Accordion {...args}>
    <AccordionItem isExpanded>
      <AccordionHeader>Header 1</AccordionHeader>
      <AccordionPanel>Content 1</AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Header 2</AccordionHeader>
      <AccordionPanel>Content 2</AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Header 3</AccordionHeader>
      <AccordionPanel>Content 3</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

export const header: Story<AccordionProps> = () => {
  return (
    <Wrapper>
      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>Chevron left</AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="right">
        <AccordionItem>
          <AccordionHeader>Chevron right</AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem isExpanded>
          <AccordionHeader>Chevron left expanded</AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="right">
        <AccordionItem disabled>
          <AccordionHeader>Disabled</AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="right">
        <AccordionItem disabled isExpanded>
          <AccordionHeader>Disabled expanded</AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionHeaderTitle>
              Chevron left – custom icons right
            </AccordionHeaderTitle>
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
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionHeaderTitle>
              Chevron left – interactive options right
            </AccordionHeaderTitle>
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
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionHeaderTitle>
              Very long summary that will get truncated if the width of the
              header is narrower than the length of the text
            </AccordionHeaderTitle>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>
    </Wrapper>
  )
}
