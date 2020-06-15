import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  padding-bottom: 8rem;
  grid-gap: 2rem;
`

export default {
  title: 'Components|Progress Indicators/Circular',
  component: CircularProgress,
}

export const Determinate = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <Wrapper>
      <CircularProgress variant="determinate" value={progress} />
    </Wrapper>
  )
}

export const Indeterminate = () => {
  return (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  )
}

Determinate.story = {
  name: 'Determinate',
}

Indeterminate.story = {
  name: 'Indeterminate',
}
