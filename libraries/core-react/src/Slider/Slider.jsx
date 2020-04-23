import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(2, max-content) 12px 16px;
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
    #fff 20px,
    #f7f7f7 20px,
    #f7f7f7 24px,
    transparent 0
  );
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
    margin-left: calc(
      6px + (var(--a) - var(--min)) / var(--dif) * calc(100% - 12px)
    );
    width: calc((var(--b) - var(--a)) / var(--dif) * calc(100% - 12px));
  }

  &::after {
    margin-left: calc(
      6px + (var(--b) - var(--min)) / var(--dif) * calc(100% - 12px)
    );
    width: calc((var(--a) - var(--b)) / var(--dif) * calc(100% - 12px));
  }
`
const Output = styled.output`
  /*  position: absolute;
  top: 20px; */
  width: fit-content;
  background: white;
  position: relative;
  z-index: 1;

  --val: ${(props) => props.value};
  color: #6f6f6f;
  font-size: 10px;
  margin-top: 6px;
  /* Idea: Transform negative ((width of outline elem - handle width) / 2 (half of width for centering)) */
  transform: translate(calc(-1 * calc((100% - 12px) / 2)));
  grid-row: 4;
  grid-column: 1 / 3;
  margin-left: calc((var(--val) - var(--min)) / var(--dif) * calc(100% - 12px));
`
const MinMaxValue = styled.span`
  grid-row: 4;
  font-size: 10px;
  color: #6f6f6f;
  position: absolute;
  left: 0;
  text-align: left;
  margin-top: 6px;
  &:last-child {
    left: auto;
    right: 0;
  }
`

const WrapperLabel = styled.div`
  grid-row: 1;
  padding: 1rem 0;
`

const StyledSlider = styled.input`
  &::-webkit-slider-runnable-track,
  &::-webkit-slider-thumb,
  & {
    -webkit-appearance: none;
  }
  /* Hides the slider so that custom slider can be made */
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
    }
    & + output {
      /* color: darkorange; */
    }
  }
  &:hover,
  &:active {
    &::-webkit-slider-thumb {
      box-shadow: 0px 0px 0px 6px #deedee;
      /*  background: darkorange; */
    }
  }
  &:before,
  &:after {
    content: ' ';
    display: block;
    width: 6px;
    height: 6px;
    background: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 100%;
    margin-top: 2px;
    position: absolute;
    z-index: 0;
  }
  &:after {
    right: 0;
  }

  /* Must be seperated code blocks for webkit and moz otherwise nothing will be applied */
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid #007079;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    position: relative;
    margin-top: 0;
    z-index: 1;
    pointer-events: auto;
  }
  &::-moz-range-thumb {
    -webkit-appearance: none;
    border: 2px solid #007079;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    position: relative;
    margin-top: 0;
    z-index: 1;
    pointer-events: auto;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: none;
  }
  &::-moz-range-track {
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
    onChange,
    step = 1,
    ...rest
  },
  ref,
) {
  // @TODO: Some counter prefix id to avoid duplicate id's

  // At least some internal state for now to avoid both handles on top of each other at init

  // Let's just assume a two numbers array for now
  /*  console.log('Test output', valueB, outputFunction(valueB)) */

  // @TODO single state and onChange function
  const [valueA, setValueA] = useState(value[0])
  const [valueB, setValueB] = useState(value[1])

  const onChangeA = (event) => {
    const newVal = event.target.value
    setValueA(newVal)
    if (onChange) {
      // Callback for provided onChange func
      onChange(event, [newVal, valueB])
    }
  }
  const onChangeB = (event) => {
    const newVal = event.target.value
    setValueB(newVal)
    if (onChange) {
      // Callback for provided onChange func
      onChange(event, [valueA, newVal])
    }
  }

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
          onChangeA(event)
        }}
      />
      <Output htmlFor="a" value={valueA} min={min}>
        {outputFunction ? outputFunction(valueA) : valueA}
      </Output>
      <MinMaxValue>{outputFunction ? outputFunction(min) : min}</MinMaxValue>
      <SrOnlyLabel htmlFor="b">Value B</SrOnlyLabel>
      <StyledSlider
        type="range"
        value={valueB}
        min={min}
        max={max}
        id="b"
        step={step}
        onChange={(event) => {
          onChangeB(event)
        }}
      />
      <Output htmlFor="b" value={valueB} min={min}>
        {outputFunction ? outputFunction(valueB) : valueB}
      </Output>
      <MinMaxValue>{outputFunction ? outputFunction(max) : max}</MinMaxValue>
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
  /** Components value, string for slider, array for range */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func,
}

Slider.defaultProps = {
  className: '',
}
