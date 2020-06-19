import React, { Fragment, useState } from 'react'
import {
  withKnobs,
  select,
  text,
  boolean,
  number,
} from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Breadcrumbs, Typography } from '@equinor/eds-core-react'

const { Breadcrumb } = Breadcrumbs

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
  grid-gap: 8px;
`

const TextWrapper = styled.div`
  margin: 18px 0;
`

const WrapContainer = styled.div`
  width: 100px;
`

export default {
  title: 'Components|Breadcrumbs',
  component: Breadcrumbs,
  decorators: [withKnobs],
}

function handleClick(event) {
  event.preventDefault()
  console.info('Breadcrumb got clicked')
}

export const Variations = () => {
  return (
    <Body>
      <TextWrapper>
        <Typography variant="h4">Normal</Typography>
      </TextWrapper>
      <Breadcrumbs>
        <Breadcrumb href="#" onClick={handleClick}>
          Store
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick}>
          Fruits
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick} aria-current="page">
          Apple
        </Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h4">Collapsed</Typography>
        <Typography variant="body_long">
          Choose collapse prop to use ellipses to indicate the middle pages.
          Click ellipses (...) to expand.
        </Typography>
      </TextWrapper>
      <Breadcrumbs collapse>
        <Breadcrumb href="#" onClick={handleClick}>
          Store
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick}>
          Fruits
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick}>
          Apple
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick} aria-current="page">
          Apple Juice
        </Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h4">Truncated labels</Typography>
        <Typography variant="body_long">
          Choose maxWidth in pixels to truncate labels. Hover on label to see
          full text.
        </Typography>
      </TextWrapper>
      <Breadcrumbs>
        <Breadcrumb maxWidth={30} href="#" onClick={handleClick}>
          Store
        </Breadcrumb>
        <Breadcrumb maxWidth={30} href="#" onClick={handleClick}>
          Fruits
        </Breadcrumb>
        <Breadcrumb
          maxWidth={30}
          href="#"
          onClick={handleClick}
          aria-current="page"
        >
          Apple
        </Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h4">Wrapped</Typography>
        <Typography variant="body_long">
          Wraps over two or more lines. Controlled by parent width.
        </Typography>
      </TextWrapper>
      <WrapContainer>
        <Breadcrumbs>
          <Breadcrumb href="#" onClick={handleClick}>
            Store
          </Breadcrumb>
          <Breadcrumb href="#" onClick={handleClick}>
            Fruits
          </Breadcrumb>
          <Breadcrumb href="#" onClick={handleClick} aria-current="page">
            Apple
          </Breadcrumb>
        </Breadcrumbs>
      </WrapContainer>
    </Body>
  )
}

export const WithKnobs = () => {
  const collapse = boolean('Collapse', false)
  const maxWidth = number('Max Width', null)
  return (
    <Body>
      <Breadcrumbs collapse={collapse}>
        <Breadcrumb maxWidth={maxWidth}>Label One</Breadcrumb>
        <Breadcrumb maxWidth={maxWidth}>Label Two</Breadcrumb>
        <Breadcrumb maxWidth={maxWidth}>Label Three</Breadcrumb>
        <Breadcrumb maxWidth={maxWidth}>Label Four</Breadcrumb>
        <Breadcrumb maxWidth={maxWidth} aria-current="page">
          Label Five
        </Breadcrumb>
      </Breadcrumbs>
    </Body>
  )
}
