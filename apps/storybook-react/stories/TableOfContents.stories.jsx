import React from 'react'
import styled from 'styled-components'
import {
  Icon,
  List,
  TableOfContents,
  Typography,
} from '@equinor/eds-core-react'

import { subdirectory_arrow_right } from '@equinor/eds-icons'

const icons = {
  subdirectory_arrow_right,
}

Icon.add(icons)

const { LinkItem } = TableOfContents

export default {
  title: 'Components|TableOfContents',
  component: TableOfContents,
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto 14rem;
`

export const Example = () => (
  <Wrapper>
    <main>
      <article>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h2" id="sub-section-one">
          Heading 2-1
        </Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h2" id="sub-section-two">
          Heading 2-2
        </Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h2" id="sub-section-three">
          Heading 2-3
        </Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
      </article>
    </main>
    <aside>
      <TableOfContents>
        <List>
          <LinkItem>
            <Typography variant="body_short" link href="#sub-section-one">
              <Icon name="subdirectory_arrow_right" size={16} />
              Anchor 1
            </Typography>
          </LinkItem>
          <LinkItem>
            <Typography variant="body_short" link href="#sub-section-two">
              <Icon name="subdirectory_arrow_right" size={16} />
              Anchor 2
            </Typography>
          </LinkItem>
        </List>
      </TableOfContents>
    </aside>
  </Wrapper>
)
