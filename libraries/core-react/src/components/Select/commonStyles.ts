import { HTMLAttributes } from 'react'
import { Input } from '../TextField/Input'
import { List } from '../List'
import { Button } from '../Button'
import styled from 'styled-components'
import { select as tokens } from './Select.tokens'
import { typographyTemplate } from '@utils'

const { ListItem } = List

type ContainerProps = HTMLAttributes<HTMLDivElement>

type StyledListItemType = {
  highlighted: string
}

export const Container = styled.div<ContainerProps>`
  position: relative;
`

export const PaddedInput = styled(Input)`
  /* Hack: Had to add + 0px to satisfy the style lint plugin */
  padding-right: calc(
    ${tokens.button.size} + ${tokens.button.spacings.left} +
      ${tokens.button.spacings.right} + 0px
  );
`

export const StyledList = styled(List)`
  background-color: ${tokens.background};
  box-shadow: ${tokens.boxShadow};
  overflow-y: scroll;
  max-height: 300px;
  padding: 0;
  border-radius: ${tokens.borderRadius};
  margin-top: 4px;
  position: absolute;
  right: 0;
  left: 0;
  z-index: 50;
`
export const StyledListItem = styled(ListItem)<StyledListItemType>`
  list-style: none;
  ${typographyTemplate(tokens.typography)};
  margin: 0;
  background-color: ${({ highlighted }) =>
    highlighted === 'true' ? tokens.hover.background : tokens.background};
  cursor: ${({ highlighted }) =>
    highlighted === 'true' ? 'pointer' : 'default'};
`

export const StyledButton = styled(Button)`
  position: absolute;
  right: ${tokens.button.spacings.right};
  top: ${tokens.button.spacings.top};
  height: ${tokens.button.size};
  width: ${tokens.button.size};
`

export const StyledInputWrapper = styled.div`
  position: relative;
`
