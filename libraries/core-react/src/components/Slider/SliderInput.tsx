import { forwardRef, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'
import { bordersTemplate, outlineTemplate } from '../../utils'

const {
  entities: { handle },
  states: { disabled: _disabled },
} = tokens

const track = css`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: none;
`

const thumb = css`
  ${bordersTemplate(handle.border)}
  height: ${handle.height};
  width: ${handle.width};
  background: ${handle.background};
  cursor: pointer;
  position: relative;
  z-index: 1;
`

const thumbHover = css`
  box-shadow: 0px 0px 0px 6px ${handle.states.hover.background};
  border-color: ${handle.states.hover.border.type === 'border' &&
  handle.states.hover.border.color};
`

const thumbHoverAndDisabled = css`
  cursor: not-allowed;
  box-shadow: none;
`

const thumbDisabled = css`
  background-color: ${_disabled.background};
  border-color: ${_disabled.border.type === 'border' && _disabled.border.color};
`

type SliderInput = {
  type: string
}

const StyledSliderInput = styled.input.attrs<SliderInput>(() => ({
  type: 'range',
}))`
  &::-webkit-slider-runnable-track,
  &::-webkit-slider-thumb,
  & {
    -webkit-appearance: none;
  }
  ::-moz-focus-outer {
    border: 0;
  }

  width: 100%;
  background: transparent;
  background: none;
  grid-column: 1 / -1;
  grid-row: 2;
  font: inherit;
  margin: 0;
  z-index: 2;
  outline: none;
  &[data-focus-visible-added]:focus {
    z-index: 2;
    &::-webkit-slider-thumb {
      ${outlineTemplate(handle.states.focus.outline)};
    }
    &::-moz-range-thumb {
      ${outlineTemplate(handle.states.focus.outline)};
    }
  }
  &:hover,
  &:active {
    &::-webkit-slider-thumb {
      ${thumbHover}
    }
    &::-moz-range-thumb {
      ${thumbHover}
    }
  }
  &:disabled {
    &::-webkit-slider-thumb {
      ${thumbDisabled}
    }
    &::-moz-range-thumb {
      ${thumbDisabled}
    }
  }
  &:disabled:hover,
  &:disabled:active {
    &::-webkit-slider-thumb {
      ${thumbHoverAndDisabled}
    }
    &::-moz-range-thumb {
      ${thumbHoverAndDisabled}
    }
    &::-webkit-slider-runnable-track {
      cursor: not-allowed;
    }
    &::-moz-range-track {
      cursor: not-allowed;
    }
  }

  &:before,
  &:after {
  }
  &:after {
    right: 0;
  }

  /* Must be seperated code blocks for webkit and moz otherwise nothing will be applied */
  &::-webkit-slider-thumb {
    ${thumb}
    margin-top: 6px;
  }
  &::-moz-range-thumb {
    ${thumb}
    /* Avoid too small circles, dunno why this is happening :/  */
    height: 8px;
    width: 8px;
  }
  &::-webkit-slider-runnable-track {
    ${track}
  }
  &::-moz-range-track {
    ${track}
  }
`

type SliderInputProps = {
  /** Slider value */
  value: number
  /** Change function , this is a controlled component */
  onChange: (event: MouseEvent | KeyboardEvent) => void
  /**  Mouse up handler */
  onMouseUp: (event: MouseEvent) => void
  /** Key up handler */
  onKeyUp: (event: KeyboardEvent) => void
  /** Min value */
  min: number
  /** Max value */
  max: number
  /** Id for the input element */
  id: string
  /** Step value */
  step: number
  /** Disabled */
  disabled: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const SliderInput = forwardRef<HTMLInputElement, SliderInputProps>(
  function SliderInput(
    {
      value,
      min,
      max,
      id,
      step,
      onChange,
      onMouseUp,
      onKeyUp,
      disabled,
      ...restProps
    },
    ref,
  ) {
    return (
      <StyledSliderInput
        {...restProps}
        value={value}
        ref={ref}
        min={min}
        max={max}
        id={id}
        step={step}
        onChange={(event) => {
          onChange(event)
        }}
        onMouseUp={(event) => {
          onMouseUp(event)
        }}
        onKeyUp={(event) => {
          onKeyUp(event)
        }}
        disabled={disabled}
      />
    )
  },
)

SliderInput.displayName = 'SliderInput'
