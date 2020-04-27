import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'

const { enabled } = tokens

const track = css`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: none;'
`

const thumb = css`
  border: ${enabled.handle.border.width} ${enabled.handle.border.type}
    ${enabled.handle.border.color};
  height: ${enabled.handle.size};
  width: ${enabled.handle.size};
  border-radius: ${enabled.handle.border.radius};
  background: ${enabled.handle.background};
  cursor: pointer;
  position: relative;
  margin-top: 0;
  z-index: 1;
  pointer-events: auto;
`
const thumbHover = css`
  box-shadow: 0px 0px 0px 6px ${enabled.handle.hover.background};
  border-color: ${enabled.handle.hover.border.color};
`

const StyledSliderInput = styled.input.attrs(() => ({
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

  /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent;
  /* get rid of white Chrome background */
  background: none;
  grid-column: 1 / -1;
  grid-row: 2;
  font: inherit; /* fix too small font-size in both Chrome & Firefox */
  margin: 0;
  z-index: 2;
  pointer-events: none;
  outline: none;
  &[data-focus-visible-added]:focus {
    z-index: 2;
    &::-webkit-slider-thumb {
      outline: ${enabled.handle.outline};
      outline-offset: ${enabled.handle.outlineOffset};
    }
    &::-moz-range-thumb {
      outline: ${enabled.handle.outline};
      outline-offset: ${enabled.handle.outlineOffset};
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
  &:before,
  &:after {
  }
  &:after {
    right: 0;
  }

  /* Must be seperated code blocks for webkit and moz otherwise nothing will be applied */
  ::-webkit-slider-thumb {
    ${thumb}
  }
  &::-moz-range-thumb {
    ${thumb};
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
export const SliderInput = ({ value, min, max, id, step, onChange }) => {
  return (
    <StyledSliderInput
      value={value}
      min={min}
      max={max}
      id={id}
      step={step}
      onChange={(event) => {
        onChange(event)
      }}
    />
  )
}

SliderInput.propTypes = {
  /* Slider value */
  value: PropTypes.number.isRequired,
  /* Change function , this is a controlled component */
  onChange: PropTypes.func.isRequired,
  /* Min value */
  min: PropTypes.number,
  /* Max value */
  max: PropTypes.number,
  /* Id for the input element */
  id: PropTypes.string.isRequired,
  /* Step value */
  step: PropTypes.number,
}

SliderInput.defaultProps = {
  /* Same as spec defaults */
  step: 1,
  min: 0,
  max: 100,
}
