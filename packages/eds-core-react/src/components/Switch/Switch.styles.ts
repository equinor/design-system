import styled, { css } from 'styled-components'
import { outlineTemplate } from '@equinor/eds-utils'

export const BaseInputWrapper = styled.span(
  ({ theme: { width, height } }) => css`
    width: ${width};
    height: ${height};
    border-radius: 50%;
    position: relative;
    grid-area: input;
  `,
)

export const BaseInput = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))(
  ({ disabled, theme }) => css`
    appearance: none;
    width: 100%;
    height: 100%;
    grid-area: input;
    margin: 0;
    position: relative;
    z-index: 1;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    &:focus {
      outline: none;
    }
    &[data-focus-visible-added]:focus + span {
      ${outlineTemplate(theme.states.focus.outline)}
    }
    &:focus-visible + span {
      ${outlineTemplate(theme.states.focus.outline)}
    }
  `,
)

export const GridWrapper = styled.span`
  display: inline-grid;
  vertical-align: middle;
  grid: [input] 1fr / [input] 1fr;
  place-items: center;
  isolation: isolate;
`
