import { forwardRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { BlockEditor } from 'sanity'
import styled from 'styled-components'

// How future proof will this be?
// - not so far #753
const Wrapper = styled.div`
  div[data-wrapper] > div {
    height: unset;
  }
`

const SingleLineEditor = forwardRef((props: any, ref) => {
  return (
    <Wrapper>
      <BlockEditor ref={ref} {...props} />
    </Wrapper>
  )
})
export default SingleLineEditor
