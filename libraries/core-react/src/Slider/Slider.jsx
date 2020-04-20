import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(2, max-content) 12px;
  grid-template-columns: 1fr 1fr;
  margin: 1em auto;
  width: auto;
  overflow: hidden;
  position: relative;
  --a: ${(props) => props.valA}%;
  --b: ${(props) => props.valB}%;
  --min: ${(props) => props.min};
  --max: ${(props) => props.max};
  --range-color: #a8739d;
  background: linear-gradient(0deg, #f7f7f7 4px, transparent 0);
  --track-background: linear-gradient(
      to right,
      #f7f7f7 var(--a),
      var(--range-color) 0,
      var(--range-color) var(--b),
      #f7f7f7 0
    )
    no-repeat 0 100% / 100% 100%;
  background: var(--track-background);
  border-radius: 4px;
`
const Output = styled.output`
 /*  position: absolute;
  top: 20px; */
  &:last-child { text-align: right; }
  grid-row: 2;
 /*  left: ${(props) => props.left}px; */
`
const WrapperLabel = styled.div`
  grid-row: 1;
  padding: 1rem 0;
`

const StyledSlider = styled.input`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent;
  grid-column: 1 / 3;
  grid-row: 3;
  background: none; /* get rid of white Chrome background */
  color: #000;
  font: inherit; /* fix too small font-size in both Chrome & Firefox */
  margin: 0;
  pointer-events: none;
  :focus {
    /* outline: none; */
  }
  &:focus {
    z-index: 2;
    outline: none;
    &::-webkit-slider-thumb {
      outline: dotted 1px currentcolor;
      /*  background: darkorange; */
    }
    & + output {
      color: darkorange;
    }
  }

  /* Otherwise white in Chrome */
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid #007079;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: 0;

    pointer-events: auto;
    &:focus {
      border-color: darkorange;
    }
  }

  ::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: none;
  }
`
const SrOnlyLabel = styled.label`
  position: absolute;
  clip-path: inset(50%);
`

export const Slider = forwardRef(function EdsSlider({ ...rest }, ref) {
  // @TODO: Some counter prefix id to avoid duplicate id's

  // At least some internal state for now to avoid both handles on top of each other at init
  // @TODO refactor to value hook
  const [valueA, setValueA] = useState('40')
  const [valueB, setValueB] = useState('60')
  const min = '0'
  const max = '100'

  return (
    <Wrapper
      {...rest}
      ref={ref}
      role="group"
      aria-labelledby="wrapperLabel"
      valA={valueA}
      valB={valueB}
      max={max}
      min={min}
    >
      <WrapperLabel id="wrapperLabel">Range slider label</WrapperLabel>
      <SrOnlyLabel htmlFor="a">Value A</SrOnlyLabel>
      <StyledSlider
        type="range"
        value={valueA}
        max={max}
        min={min}
        id="a"
        onChange={(event) => {
          setValueA(event.target.value)
        }}
      />
      <Output for="a" left="5">
        {valueA}
      </Output>
      <SrOnlyLabel htmlFor="b">Value B</SrOnlyLabel>
      <StyledSlider
        type="range"
        value={valueB}
        min={min}
        max={max}
        id="b"
        onChange={(event) => {
          setValueB(event.target.value)
        }}
      />
      <Output for="a" left="45">
        {valueB}
      </Output>
    </Wrapper>
  )
})

Slider.displayName = 'eds-Slider'

Slider.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Function to handle closing scrim */
  onClose: PropTypes.func,
  /** Whether scrim can be dismissed with esc key */
  isDismissable: PropTypes.bool,
}

Slider.defaultProps = {
  className: '',
}
