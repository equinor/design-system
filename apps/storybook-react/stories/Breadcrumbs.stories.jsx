import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Breadcrumbs } from '@equinor/eds-core-react'

const { Breadcrumb } = Breadcrumbs

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
`

export default {
  title: 'Components|Breadcrumbs',
  component: Breadcrumbs,
}

function handleClick(event) {
  event.preventDefault()
  console.info('Breadcrumb got clicked')
}

export const Variations = () => {
  return (
    <Body>
      <Breadcrumbs maxItems={2}>
        <Breadcrumb href="#" onClick={handleClick}>
          Store
        </Breadcrumb>
        <Breadcrumb maxWidth={30} href="#" onClick={handleClick}>
          Fruits
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick}>
          Apple
        </Breadcrumb>
      </Breadcrumbs>
      <Breadcrumbs>
        <Breadcrumb href="#" onClick={handleClick}>
          Store
        </Breadcrumb>
        <Breadcrumb maxWidth={30} href="#" onClick={handleClick}>
          Fruits
        </Breadcrumb>
        <Breadcrumb href="#" onClick={handleClick}>
          Apple
        </Breadcrumb>
      </Breadcrumbs>
    </Body>
  )
}
