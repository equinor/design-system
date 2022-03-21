import { HTMLAttributes } from 'react'
import { Input } from '../Input'
import { List } from '../List'
import { Button } from '../Button'
import styled, { css } from 'styled-components'
import { select as selectToken } from './Select.tokens'
import { typographyTemplate, bordersTemplate } from '@equinor/eds-utils'

const {
  entities: { button: buttonToken },
} = selectToken

type ContainerProps = HTMLAttributes<HTMLDivElement>

type StyledListItemType = {
  highlighted: string
  active?: string
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

export const StyledListItem = styled(List.Item)<StyledListItemType>(
  ({ theme, highlighted, active }) => {
    const backgroundColor =
      highlighted === 'true'
        ? theme.states.hover.background
        : active === 'true'
        ? theme.states.active.background
        : theme.background

    return css`
      margin: 0;
      list-style: none;
      background-color: ${backgroundColor};
      ${typographyTemplate(theme.typography)};
      cursor: ${highlighted === 'true' ? 'pointer' : 'default'};
    `
  },
)

export const StyledButton = styled(Button)(
  ({
    theme: {
      entities: { button },
    },
  }) => {
    return css`
      position: absolute;
      right: ${button.spacings.right};
      height: ${button.height};
      width: ${button.height};
      top: ${button.spacings.top};
      color: ${button.typography.color};
    `
  },
)

export const StyledInputWrapper = styled.div`
  position: relative;
`
