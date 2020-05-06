import React, { forwardRef, useState, useRef /* , useMemo */ } from 'react'
import PropTypes from 'prop-types'
/* import createId from 'lodash.uniqueid' */
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'
import { MinMax } from './MinMax'
import { Output } from './Output'
import { SliderInput } from './SliderInput'

const { enabled, disabled: _disabled } = tokens

/** The two first gradients are hacks to avoid 2px too long slider track on both edges. Better solution? */
/* 20 px = Height from output + (height of handle (12px) - (track height (4px)) / 2) */
const fakeTrackBg = css`
    background-image: url("data:image/svg+xml,<svg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'><rect x='0' y='11' fill='${enabled.track.background}' width='100%' height='4' rx='2' /></svg>");
    background-size: cover;
    background-repeat: no-repeat;   
`
const fakeTrackBgHover = css`
    background-image: url("data:image/svg+xml,<svg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'><rect x='0' y='11' fill='${enabled.track.hover.background}' width='100%' height='4' rx='2' /></svg>");
`

const trackFill = css`
  grid-column: 1 / span 2;
  grid-row: 2;
  height: ${enabled.track.height};
  margin-bottom: ${enabled.track.bottomOffset};
  align-self: end;
  content: '';
`

const wrapperGrid = css`
  display: grid;
  grid-template-rows: max-content 24px;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  position: relative;
`
const RangeWrapper = styled.div`
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
    background: ${({ disabled }) =>
      disabled
        ? _disabled.track.indicator.color
        : enabled.track.indicator.color} ;
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
  &:hover:not([disabled]) {
    ${fakeTrackBgHover}
    &::before,
    &::after {
      background: ${enabled.track.indicator.hover.color}
    }
  }
 
`
const Wrapper = styled.div`
  --min: ${({ min }) => min};
  --max: ${({ max }) => max};
  --dif: calc(var(--max) - var(--min));
  --value: ${({ value }) => value};
  --realWidth: calc(100% - 12px);
  ${wrapperGrid}
  ${fakeTrackBg}
  &::after {
    ${trackFill}
    background: ${({ disabled }) =>
      disabled
        ? _disabled.track.indicator.color
        : enabled.track.indicator.color};
  }
  &::after {
    margin-right: calc(
      (var(--max) - var(--value)) / var(--dif) * var(--realWidth)
    );
    /* Adjusting for start dot circle */
    margin-left: 3px;
  }
  &:hover:not([disabled]) {
    ${fakeTrackBgHover} 
    &::after {
      background: ${enabled.track.indicator.hover.color}
    }
  }
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
    /* z-index: -1; */
    width: ${enabled.dot.size};
    height: ${enabled.dot.size};
    background: ${enabled.background};
    border: ${enabled.dot.border.width} ${enabled.dot.border.type}
      ${enabled.dot.border.color};
    border-radius: ${enabled.dot.border.radius};
    bottom: 8px;
    left: 0;  
  }
  &:after {
    right: 0;
    left: auto;
  }
 
}
`

const SrOnlyLabel = styled.label`
  /* Non-edge version 
  position: absolute;
  clip-path: inset(50%); */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`

export const Slider = forwardRef(function EdsSlider(
  {
    min = 0,
    max = 100,
    value = [40, 60],
    outputFunction,
    onChange,
    minMaxDots = true,
    minMaxValues,
    step = 1,
    disabled,
    ariaLabelledby,
    backgroundColor,
    ...rest
  },
  ref,
) {
  const isRangeSlider = Array.isArray(value)
  // @TODO: Some counter prefix id to avoid duplicate id's
  const [sliderValue, setSliderValue] = useState(value)
  const minRange = useRef()
  const maxRange = useRef()
  const onValueChange = (event, valueArrIdx) => {
    // Get the new value as int
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

  const getFormattedText = (text) => {
    return outputFunction ? outputFunction(text) : text
  }

  const findClosestRange = (event) => {
    // fix annoying flick of hover on the wrong handle due to wrong calculated bounding dimensions from
    // output elem if you move the mouse 1px above the output label
    if (event.target.type === 'output') {
      return
    }
    const bounds = event.target.getBoundingClientRect()
    const x = event.clientX - bounds.left // Get the mouse pointer's x value on the slider
    const inputWidth = minRange.current.offsetWidth // The two sliders are of equal width
    const minValue = minRange.current.value // unix timestamp for minste handle
    const maxValue = maxRange.current.value // unix timestamp for største handle
    const diff = max - min // Diff of the slider range

    const normX = (x / inputWidth) * diff + min // x-akse-verdi i unix timestamp-verden

    const maxX = Math.abs(normX - maxValue)
    const minX = Math.abs(normX - minValue)
    if (minX > maxX) {
      minRange.current.style.zIndex = 10
      maxRange.current.style.zIndex = 20
    } else {
      minRange.current.style.zIndex = 20
      maxRange.current.style.zIndex = 10
    }
  }

  // Let's trust people?
  /*  const inputIdA = useMemo(() => createId(`${ariaLabelledby}-thumb-a-`), [])
  const inputIdB = useMemo(() => createId(`${ariaLabelledby}-thumb-b-`), [])
  const inputId = useMemo(() => createId(`${ariaLabelledby}-thumb`), []) */

  const inputIdA = `${ariaLabelledby}-thumb-a`
  const inputIdB = `${ariaLabelledby}-thumb-b`
  const inputId = `${ariaLabelledby}-thumb`

  return (
    <>
      {isRangeSlider ? (
        <RangeWrapper
          {...rest}
          ref={ref}
          role="group"
          aria-labelledby={ariaLabelledby}
          valA={sliderValue[0]}
          valB={sliderValue[1]}
          max={max}
          min={min}
          disabled={disabled}
          onMouseMove={findClosestRange}
        >
          {/*  Need an element for pseudo elems :/ */}
          {minMaxDots && <WrapperGroupLabelDots />}
          <SrOnlyLabel htmlFor={inputIdA}>Value A</SrOnlyLabel>
          <SliderInput
            type="range"
            ref={minRange}
            value={sliderValue[0]}
            max={max}
            min={min}
            id={inputIdA}
            step={step}
            onChange={(event) => {
              onValueChange(event, 0)
            }}
            disabled={disabled}
          />
          <Output htmlFor={inputIdA} value={sliderValue[0]}>
            {getFormattedText(sliderValue[0])}
          </Output>
          {minMaxValues && <MinMax>{getFormattedText(min)}</MinMax>}
          <SrOnlyLabel htmlFor={inputIdB}>Value B</SrOnlyLabel>
          <SliderInput
            type="range"
            value={sliderValue[1]}
            min={min}
            max={max}
            id={inputIdB}
            step={step}
            ref={maxRange}
            onChange={(event) => {
              onValueChange(event, 1)
            }}
            disabled={disabled}
          />
          <Output htmlFor={inputIdB} value={sliderValue[1]}>
            {getFormattedText(sliderValue[1])}
          </Output>
          {minMaxValues && <MinMax>{getFormattedText(max)}</MinMax>}
        </RangeWrapper>
      ) : (
        <Wrapper
          {...rest}
          ref={ref}
          max={max}
          min={min}
          value={sliderValue}
          disabled={disabled}
        >
          <SliderInput
            type="range"
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            id={inputId}
            onChange={(event) => {
              onValueChange(event)
            }}
            disabled={disabled}
            aria-labelledby={ariaLabelledby}
          />
          <Output htmlFor={inputId} value={sliderValue}>
            {getFormattedText(sliderValue)}
          </Output>
          {/*  Need an element for pseudo elems :/ */}
          {minMaxDots && <WrapperGroupLabelDots />}
          {minMaxValues && (
            <>
              <MinMax>{getFormattedText(min)}</MinMax>
              <MinMax>{getFormattedText(max)}</MinMax>
            </>
          )}
        </Wrapper>
      )}
    </>
  )
})

Slider.displayName = 'eds-Slider'

Slider.propTypes = {
  /** Id for the elements that labels this slider */
  ariaLabelledby: PropTypes.string.isRequired,
  /** Components value, string for slider, array for range */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
  /** Function to be called when value change */
  onChange: PropTypes.func,
  /** Function for formatting the output, e.g. with dates */
  outputFunction: PropTypes.func,
  /** Max value */

  max: PropTypes.number,
  /**  Min value */
  min: PropTypes.number,
  /** Stepping interval */
  step: PropTypes.number,
  /** Show the min and max dots or not */
  minMaxDots: PropTypes.bool,
  /** Show the min and max values or not */
  minMaxValues: PropTypes.bool,
  /** Disabled */
  disabled: PropTypes.bool,
}

Slider.defaultProps = {
  /* Same as spec defaults */
  step: 1,
  min: 0,
  max: 100,
  onChange: undefined,
  outputFunction: undefined,
  minMaxDots: true,
  minMaxValues: true,
  disabled: false,
}
