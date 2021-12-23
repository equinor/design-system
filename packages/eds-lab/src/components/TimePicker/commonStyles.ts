import { HTMLAttributes } from 'react'
import { Button, List, Input } from '@equinor/eds-core-react'
import styled, { css } from 'styled-components'
import { timePicker as timePickerToken } from './TimePicker.tokens'
import { typographyTemplate, bordersTemplate } from '../../utils'

const {
  entities: { button: buttonToken },
} = timePickerToken

type ContainerProps = HTMLAttributes<HTMLDivElement>

type StyledListItemType = {
  highlighted: string
  active?: string
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  width: 100%;
  max-width: 102px;
  display: flex;
  flex-direction: column;
  position: relative;
`

export const PaddedInput = styled(Input)``

export const StyledList = styled(List)`
  background-color: ${timePickerToken.background};
  box-shadow: ${timePickerToken.boxShadow};
  overflow-y: scroll;
  max-height: 300px;
  padding: 0;
  ${bordersTemplate(timePickerToken.border)}
  margin-top: 4px;
  position: absolute;
  top: 54px;
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
      max-width: 90px;
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
    `
  },
)

export const StyledInputWrapper = styled.div`
  position: relative;
`
