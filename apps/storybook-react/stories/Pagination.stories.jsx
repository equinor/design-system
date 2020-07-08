import React, { useState } from 'react'
import { Pagination } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

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
  title: 'Components|Pagination',
  component: Pagination,
  decorators: [withKnobs],
}

const listOfItems = [
  {
    name: 'Frida',
    role: 'Developer',
  },
  {
    name: 'Victor',
    role: 'Developer',
  },
  {
    name: 'Wenche',
    role: 'Developer',
  },
  {
    name: 'Michael',
    role: 'Developer',
  },
]

export const Variants = () => {
  const [items, setItems] = useState(listOfItems)

  const onPageChange = (e) => {
    e.preventDefault()
    // Do stuff
  }
  return (
    <Body>
      <Pagination totalItems={items.length} itemsPerPage={1} />
      <Pagination totalItems={80} total />
      <Pagination totalItems={140} total switcher />
    </Body>
  )
}

export const knobs = () => <Body></Body>
