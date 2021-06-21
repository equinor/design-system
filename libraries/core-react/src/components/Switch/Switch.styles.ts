import styled, { css } from 'styled-components'
import { outlineTemplate } from '../../utils'

export const BaseInputWrapper = styled.span(
  ({ theme: { clickbound, width, height } }) => css`
    width: ${width};
    height: ${height};
    border-radius: 50%;
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: auto;
      min-height: auto;
      content: '';
    }
    &::after {
      position: absolute;
      top: -${clickbound?.offset?.top};
      left: -${clickbound?.offset?.left};
      width: ${clickbound?.width};
      height: ${clickbound?.height};
      content: '';
    }
  `,
)

export const BaseInput = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))(
  ({ theme }) => css`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    &:focus {
      outline: none;
    }
    &[data-focus-visible-added]:focus + span {
      ${outlineTemplate(theme.states.focus.outline)}
    }
  `,
)
