import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Icon,
  TableOfContents,
  Typography,
  Button,
} from '@equinor/eds-core-react'

import { subdirectory_arrow_right } from '@equinor/eds-icons'

const icons = {
  subdirectory_arrow_right,
}

Icon.add(icons)

const { LinkItem } = TableOfContents

export default {
  title: 'Components/TableOfContents',
  component: TableOfContents,
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto 14rem;
`

const Sidebar = styled.aside`
  position: relative;
`

const TempButtonWrapper = styled.div`
  display: grid;
  margin: 16px 0;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
  justify-content: start;
`

export const Example = () => {
  const [stickyState, setStickyState] = useState(false)

  return (
    <Wrapper>
      <main>
        <article>
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <TempButtonWrapper>
            <Button onClick={() => setStickyState(!stickyState)}>
              {stickyState ? 'Unstick ToC' : 'Make ToC sticky'}
            </Button>
          </TempButtonWrapper>
          <Typography variant="h2" id="sub-section-one">
            Topic 1
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
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
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="h2" id="sub-section-two">
            A very long topic to test implementation details
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
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
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
          </Typography>
          <Typography variant="h2" id="sub-section-three">
            Topic 3
          </Typography>
          <Typography variant="body_long">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.{' '}
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
        <TableOfContents sticky={stickyState} label="Important topics">
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
