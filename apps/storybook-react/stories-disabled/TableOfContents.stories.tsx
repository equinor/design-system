import React from 'react'
import styled from 'styled-components'
import {
  Icon,
  TableOfContents,
  Typography,
  TableOfContentsProps,
} from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

import { subdirectory_arrow_right } from '@equinor/eds-icons'

const icons = {
  subdirectory_arrow_right,
}

Icon.add(icons)

const { LinkItem } = TableOfContents

export default {
  title: 'Components/TableOfContents',
  component: TableOfContents,
} as Meta

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto 14rem;
`

export const Example: Story<TableOfContentsProps> = (args) => {
  return (
    <Wrapper>
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
          <LinkItem>
            <Typography variant="body_short" link href="#sub-section-one">
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>Topic 1</span>
            </Typography>
          </LinkItem>
          <LinkItem title="A very long topic to test proper implementation">
            <Typography variant="body_short" link href="#sub-section-two">
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>A very long topic to test proper implementation</span>
            </Typography>
          </LinkItem>
          <LinkItem>
            <Typography variant="body_short" link href="#sub-section-three">
              <Icon name="subdirectory_arrow_right" size={16} />
              <span>Topic 3</span>
            </Typography>
          </LinkItem>
        </TableOfContents>
      </aside>
    </Wrapper>
  )
}
