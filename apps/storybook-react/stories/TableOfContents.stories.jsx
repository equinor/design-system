import React from 'react'
import styled from 'styled-components'
import { List, TableOfContents, Typography } from '@equinor/eds-core-react'

const { ListItem } = List
const { LinkItem } = TableOfContents

export default {
  title: 'Components|TableOfContents',
  component: TableOfContents,
}

const Wrapper = styled.div`
  margin: 16px;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto 8rem;
`

export const Page = () => (
  <Wrapper>
    <main>
      <article>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="body_long">
          Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
          amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
          lot.{' '}
        </Typography>
      </article>
    </main>
    <aside>
      <TableOfContents>
        <LinkItem>
          <Typography variant="body_short" link>
            Anchor 1
          </Typography>
        </LinkItem>
        <LinkItem>
          <Typography variant="body_short" link>
            Anchor 2
          </Typography>
        </LinkItem>
      </TableOfContents>
    </aside>
  </Wrapper>
)
