import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'
import { MinMax } from './MinMax'
import { Output } from './Output'
import { SliderInput } from './SliderInput'

const { enabled } = tokens

/** The two first gradients are hacks to avoid 2px too long slider track on both edges. Better solution? */
/* 20 px = Height from output + (height of handle (12px) - (track height (4px)) / 2) */
const fakeTrackBg = css`
  background: linear-gradient(
      90deg,
      ${enabled.background},
      ${enabled.background} 3px,
      transparent 0
    ),
    linear-gradient(
      -90deg,
      ${enabled.background},
      ${enabled.background} 3px,
      transparent 0
    ),
    linear-gradient(
      0deg,
      transparent,
      transparent calc(${enabled.output.height} + ${enabled.track.bottomOffset}),
      ${enabled.track.background}
        calc(${enabled.output.height} + ${enabled.track.bottomOffset}),
      ${enabled.track.background}
        calc(
          calc(${enabled.output.height} + ${enabled.track.bottomOffset}) +
            ${enabled.track.height}
        ),
      transparent 0
    );
`

const trackFill = css`
  grid-column: 1 / span 2;
  grid-row: 2;
  height: ${enabled.track.height};
  margin-bottom: ${enabled.track.bottomOffset}
  background: ${enabled.track.indicator.color};
  align-self: end;
  content: '';
`

const wrapperGrid = css`
  display: grid;
  grid-template-rows: max-content ${enabled.handle.size} ${enabled.output
      .height};
  grid-template-columns: 1fr 1fr;
  width: 100%;
  position: relative;
`
const Wrapper = styled.div`
  --a: ${({ valA }) => valA};
  --b: ${({ valB }) => valB};
  --min: ${({ min }) => min};
  --max: ${({ max }) => max};
  --dif: calc(var(--max) - var(--min));
  --realWidth: calc(100% - 12px);
  ${wrapperGrid}
  ${fakeTrackBg}
  &::before,
  &::after {
    ${trackFill}
  }
  /** Faking the active region of the slider */
  &::before {
    margin-left: calc(
      calc(${enabled.handle.size} / 2) + (var(--a) - var(--min)) / var(--dif) *
        var(--realWidth)
    );
    width: calc((var(--b) - var(--a)) / var(--dif) * var(--realWidth));
  }

  &::after {
    margin-left: calc(
      calc(${enabled.handle.size} / 2) + (var(--b) - var(--min)) / var(--dif) *
        var(--realWidth)
    );
    width: calc((var(--a) - var(--b)) / var(--dif) * var(--realWidth));
  }
`
const WrapperLabel = styled.div`
  --min: ${({ min }) => min};
  --max: ${({ max }) => max};
  --dif: calc(var(--max) - var(--min));
  --value: ${({ value }) => value};
  --realWidth: calc(100% - 12px);
  ${wrapperGrid}
  ${fakeTrackBg}
  &::after {
    ${trackFill}
  }
  &::after {
    margin-right: calc(
      (var(--max) - var(--value)) / var(--dif) * var(--realWidth)
    );
    /* Adjusting for start dot circle */
    margin-left: 3px;
  }
`
const Label = styled.label`
  grid-row: 1;
  grid-column: 1/-1;
`

const WrapperGroupLabel = styled.div`
  grid-row: 1;
  grid-column: 1 / 3;
`
const WrapperGroupLabelDots = styled(WrapperGroupLabel)`
  &:before,
  &:after {
    content: ' ';
    display: block;
    position: absolute;
    z-index: 0;
    width: ${enabled.dot.size};
    height: ${enabled.dot.size};
    background: ${enabled.background};
    border: ${enabled.dot.border.width} ${enabled.dot.border.type}
      ${enabled.dot.border.color};
    border-radius: ${enabled.dot.border.radius};
    bottom: 18px;
    left: 2px;
  }
  &:after {
    right: 2px;
    left: auto;
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
    minMaxDots = true,
    step = 1,
    ...rest
  },
  ref,
) {
  const isRangeSlider = Array.isArray(value)
  // @TODO: Some counter prefix id to avoid duplicate id's

  const [sliderValue, setSliderValue] = useState(value)

  const onValueChange = (event, valueArrIdx) => {
    const changedValue = parseInt(event.target.value, 10)
    if (isRangeSlider) {
      const newValue = sliderValue.slice()
      newValue[valueArrIdx] = changedValue
      setSliderValue(newValue)
      if (onChange) {
        // Callback for provided onChange func
        onChange(event, newValue)
      }
      return
    }
    setSliderValue(changedValue)
    if (onChange) {
      // Callback for provided onChange func
      onChange(event, changedValue)
    }
  }

  return (
    <>
      {isRangeSlider ? (
        <Wrapper
          {...rest}
          ref={ref}
          role="group"
          aria-labelledby="wrapperLabel"
          valA={sliderValue[0]}
          valB={sliderValue[1]}
          max={max}
          min={min}
        >
          {minMaxDots ? (
            <WrapperGroupLabelDots id="wrapperLabel">
              {label}
            </WrapperGroupLabelDots>
          ) : (
            <WrapperGroupLabel id="wrapperLabel">{label}</WrapperGroupLabel>
          )}
          <SrOnlyLabel htmlFor="a">Value A</SrOnlyLabel>
          <SliderInput
            type="range"
            value={sliderValue[0]}
            max={max}
            min={min}
            id="a"
            step={step}
            onChange={(event) => {
              onValueChange(event, 0)
            }}
          />
          <Output htmlFor="a" value={sliderValue[0]}>
            {outputFunction ? outputFunction(sliderValue[0]) : sliderValue[0]}
          </Output>
          <MinMax>{outputFunction ? outputFunction(min) : min}</MinMax>
          <SrOnlyLabel htmlFor="b">Value B</SrOnlyLabel>
          <SliderInput
            type="range"
            value={sliderValue[1]}
            min={min}
            max={max}
            id="b"
            step={step}
            onChange={(event) => {
              onValueChange(event, 1)
            }}
          />
          <Output htmlFor="b" value={sliderValue[1]}>
            {outputFunction ? outputFunction(sliderValue[1]) : sliderValue[1]}
          </Output>
          <MinMax>{outputFunction ? outputFunction(max) : max}</MinMax>
        </Wrapper>
      ) : (
        <WrapperLabel max={max} min={min} value={sliderValue}>
          {/*  Need an element for pseudo elems :/ */}
          {minMaxDots && <WrapperGroupLabelDots />}
          <Label>{label}</Label>
          <SliderInput
            type="range"
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            id="simple"
            onChange={(event) => {
              onValueChange(event)
            }}
          />
          <Output htmlFor="simple" value={sliderValue}>
            {outputFunction ? outputFunction(sliderValue) : sliderValue}
          </Output>
          <MinMax>{outputFunction ? outputFunction(min) : min}</MinMax>
          <MinMax>{outputFunction ? outputFunction(max) : max}</MinMax>
        </WrapperLabel>
      )}
    </>
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
