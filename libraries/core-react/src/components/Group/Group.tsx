import { forwardRef } from 'react'
import styled from 'styled-components'

const GroupBase = styled.div``

export type GroupProps = React.HTMLAttributes<HTMLDivElement>

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { children },
  ref,
) {
  return <GroupBase ref={ref}>{children}</GroupBase>
})
