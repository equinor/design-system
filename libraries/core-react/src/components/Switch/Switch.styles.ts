import styled from 'styled-components'
import { outlineTemplate } from '../../utils'
import { comfortable as tokens } from './Switch.tokens'

const { clickbound } = tokens

export const BaseInputWrapper = styled.span`
  width: ${tokens.width};
  height: ${tokens.height};
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
`

export const BaseInput = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))`
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
    ${outlineTemplate(tokens.states.focus.outline)}
  }
`
