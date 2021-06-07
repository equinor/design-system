import { HTMLAttributes } from 'react'
import { Input } from '../Input'
import { List } from '../List'
import { Button } from '../Button'
import styled, { css } from 'styled-components'
import { select as selectToken } from './Select.tokens'
import { typographyTemplate, bordersTemplate } from '../../utils'

const {
  entities: { button: buttonToken },
} = selectToken

type ContainerProps = HTMLAttributes<HTMLDivElement>

type StyledListItemType = {
  highlighted: string
  density: string
}

type StyledButtonType = {
  density: string
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
export const StyledListItem = styled(List.Item)<StyledListItemType>`
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

export const StyledButton = styled(Button)<StyledButtonType>`
  position: absolute;
  right: ${buttonToken.spacings.right};
  height: ${buttonToken.height};
  width: ${buttonToken.height};
  ${({ density }) =>
    density === 'compact'
      ? css({ top: selectToken.modes.compact.entities.button.spacings.top })
      : css({ top: buttonToken.spacings.top })}
`

export const StyledInputWrapper = styled.div`
  position: relative;
`
