import { HTMLAttributes } from 'react'
import { Input } from '../Input'
import { List } from '../List'
import { Button } from '../Button'
import styled from 'styled-components'
import { select as selectToken } from './Select.tokens'
import { typographyTemplate, bordersTemplate } from '../../utils'

const { ListItem } = List

const {
  entities: { button: buttonToken },
} = selectToken

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
    ${buttonToken.height} + ${buttonToken.spacings.left} +
      ${buttonToken.spacings.right} + 0px
  );
`

export const StyledList = styled(List)`
  background-color: ${selectToken.background};
  box-shadow: ${selectToken.boxShadow};
  overflow-y: scroll;
  max-height: 300px;
  padding: 0;
  ${bordersTemplate(selectToken.border)}
  margin-top: 4px;
  position: absolute;
  right: 0;
  left: 0;
  z-index: 50;
`
export const StyledListItem = styled(ListItem)<StyledListItemType>`
  list-style: none;
  ${typographyTemplate(selectToken.typography)};
  margin: 0;
  background-color: ${({ highlighted }) =>
    highlighted === 'true'
      ? selectToken.states.hover.background
      : selectToken.background};
  cursor: ${({ highlighted }) =>
    highlighted === 'true' ? 'pointer' : 'default'};
`

export const StyledButton = styled(Button)`
  position: absolute;
  right: ${buttonToken.spacings.right};
  top: ${buttonToken.spacings.top};
  height: ${buttonToken.height};
  width: ${buttonToken.height};
`

export const StyledInputWrapper = styled.div`
  position: relative;
`
