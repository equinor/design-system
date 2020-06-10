import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Breadcrumbs } from '@equinor/eds-core-react'

const { Breadcrumb } = Breadcrumbs.Breadcrumb

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
      {/* <Breadcrumbs>
        <Breadcrumb href="/" onClick={handleClick}>
          Home
        </Breadcrumb>
        <Breadcrumb href="/parent" onClick={handleClick}>
          Parent
        </Breadcrumb>
        <Breadcrumb href="/parent/child" onClick={handleClick}>
          Child
        </Breadcrumb>
      </Breadcrumbs> */}
    </Body>
  )
}
