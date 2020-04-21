import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(2, max-content) 12px;
  grid-template-columns: 1fr 1fr;
  margin: 1em auto;
  width: 100%;
  /* overflow: hidden; */
  position: relative;
  --a: ${(props) => props.valA};
  --b: ${(props) => props.valB};
  --min: ${(props) => props.min};
  --max: ${(props) => props.max};
  --range-color: #a8739d;
  --dif: calc(var(--max) - var(--min));
  background: linear-gradient(
    0deg,
    #fff,
    #fff 4px,
    #f7f7f7 4px,
    #f7f7f7 8px,
    transparent 0
  );
  /* --track-background: linear-gradient(
      to right,
      #f7f7f7 var(--a),
      var(--range-color) 0,
      var(--range-color) var(--b),
      #f7f7f7 0
    )
    no-repeat 0 100% / 100% 100%;
  background: var(--track-background); */
  border-radius: 4px;
  &::before,
  &::after {
    grid-column: 1 / span 2;
    grid-row: 3;
    height: 4px;
    margin-bottom: 4px;
    background: #007079;
    align-self: end;
    content: '';
  }
  &::before {
    /*  margin-left: calc((var(--a) - var(--min)) / var(--dif) * 100%);
    width: calc((var(--b) - var(--a)) / var(--dif) * 100%); */
    margin-left: calc(
      6px + (var(--a) - var(--min)) / var(--dif) * calc(100% - 12px)
    );
    width: calc((var(--b) - var(--a)) / var(--dif) * calc(100% - 12px));
  }

  &::after {
    /*  margin-left: calc((var(--b) - var(--min)) / var(--dif) * 100%);
    width: calc((var(--a) - var(--b)) / var(--dif) * 100%); */
    margin-left: calc(
      6px + (var(--b) - var(--min)) / var(--dif) * calc(100% - 12px)
    );
    width: calc((var(--a) - var(--b)) / var(--dif) * calc(100% - 12px));
  }
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
      outline-offset: 2px;
      /*  background: darkorange; */
    }
    & + output {
      color: darkorange;
    }
  }
  &:hover,
  &:active {
    &::-webkit-slider-thumb {
      box-shadow: 0px 0px 0px 6px #deedee;
      /*  background: darkorange; */
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

export const Slider = forwardRef(function EdsSlider(
  {
    label = '',
    min = 0,
    max = 100,
    value = [40, 60],
    outputFunction,
    step = 1,
    ...rest
  },
  ref,
) {
  // @TODO: Some counter prefix id to avoid duplicate id's

  // At least some internal state for now to avoid both handles on top of each other at init

  // Let's just assume a two numbers array for now
  /*  console.log('Test output', valueB, outputFunction(valueB)) */
  const [valueA, setValueA] = useState(value[0])
  const [valueB, setValueB] = useState(value[1])

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
      <WrapperLabel id="wrapperLabel">{label}</WrapperLabel>
      <SrOnlyLabel htmlFor="a">Value A</SrOnlyLabel>
      <StyledSlider
        type="range"
        value={valueA}
        max={max}
        min={min}
        id="a"
        step={step}
        onChange={(event) => {
          setValueA(event.target.value)
        }}
      />
      <Output for="a" left="5">
        {outputFunction ? outputFunction(valueA) : valueA}
      </Output>
      <SrOnlyLabel htmlFor="b">Value B</SrOnlyLabel>
      <StyledSlider
        type="range"
        value={valueB}
        min={min}
        max={max}
        id="b"
        step={step}
        onChange={(event) => {
          setValueB(event.target.value)
        }}
      />
      <Output for="b" left="45">
        {outputFunction ? outputFunction(valueB) : valueB}
      </Output>
    </Wrapper>
  )
})

Slider.displayName = 'eds-Slider'

Slider.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Label for the slider group */
  label: PropTypes.string.isRequired,
  /** Stepping interval */
  step: PropTypes.number,
}

Slider.defaultProps = {
  className: '',
}
