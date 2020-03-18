import React, { Fragment, useEffect, useCallback, useState } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Scrim, Button } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Body = styled.div`
  height: calc(100vh - 64px);
  background: #ebebeb;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
`

const TestContent = styled.div`
  background: rgba(255, 146, 0, 0.5);
  border: 1px dashed #ff9200;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  height: calc(250px - 16px);
  margin-bottom: 12px;
  width: 350px;
`

export default {
  title: 'Components|Scrim',
  component: Scrim,
}

export const Page = () => {
  const [visibleScrim, setVisibleScrim] = useState(false)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setVisibleScrim(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  return (
    <Body>
      <p>Top of page</p>
      <p>
        Center page. <br />
        <br />
        <Button onClick={() => setVisibleScrim(true)}>Trigger Scrim</Button>
      </p>
      <p>Bottom of page</p>
      <Scrim isVisible={visibleScrim}>
        <TestContent>
          <p>Test content in a scrim.</p>
          <Button onClick={() => setVisibleScrim(false)}>OK</Button>
        </TestContent>
      </Scrim>
    </Body>
  )
}
