import React, { forwardRef, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'
import { MinMax } from './MinMax'
import { Output } from './Output'
import { SliderInput } from './SliderInput'

const { enabled, disabled: _disabled } = tokens

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
type RangeWrapperProps = {
  valA: number
  valB: number
} & Pick<Props, 'min' | 'max' | 'disabled'>

const RangeWrapper = styled.div<RangeWrapperProps>`
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
      background: ${enabled.track.indicator.hover.color};
    }
  }
`

type WrapperProps = Pick<Props, 'min' | 'max' | 'disabled' | 'value'>

const Wrapper = styled.div<WrapperProps>`
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
    width: ${enabled.dot.size};
    height: ${enabled.dot.size};
    background: ${enabled.background};
    border: (
      ${enabled.dot.border.width} ${enabled.dot.border.type}
        ${enabled.dot.border.color}
    );
    border-radius: ${enabled.dot.border.radius};
    bottom: 8px;
    left: 0;
  }
  &:after {
    right: 0;
    left: auto;
  }
`

const SrOnlyLabel = styled.label`
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
type SliderValueType = number[] | number

type Props = {
  /** Id for the elements that labels this slider */
  ariaLabelledby: string
  /** Components value, range of numbers */
  value: SliderValueType
  /** Function to be called when value change */
  onChange?: (
    event: MouseEvent | KeyboardEvent,
    newValue: SliderValueType,
  ) => void
  /* Function to be called when value is committed by mouseup event */
  onChangeCommitted?: (
    event: MouseEvent | KeyboardEvent,
    newValue: SliderValueType,
  ) => void
  /** Function for formatting the output, e.g. with dates */
  outputFunction?: (text: string) => void
  /** Max value */
  max?: number
  /**  Min value */
  min?: number
  /** Stepping interval */
  step?: number
  /** Show the min and max dots or not */
  minMaxDots?: boolean
  /** Show the min and max values or not */
  minMaxValues?: boolean
  /** Disabled */
  disabled?: boolean
} & JSX.IntrinsicElements['div']

export const Slider = forwardRef<HTMLDivElement, Props>(function EdsSlider(
  {
    min = 0,
    max = 100,
    value = [40, 60],
    outputFunction,
    onChange,
    onChangeCommitted,
    minMaxDots = true,
    minMaxValues = true,
    step = 1,
    disabled,
    ariaLabelledby,
    ...rest
  },
  ref,
) {
  const isRangeSlider = Array.isArray(value)
  const [sliderValue, setSliderValue] = isRangeSlider
    ? useState(value)
    : useState([value])
  const minRange = useRef<HTMLInputElement>(null)
  const maxRange = useRef<HTMLInputElement>(null)
  const onValueChange = (event, valueArrIdx?: number) => {
    const changedValue = parseInt(event.target.value, 10)
    if (isRangeSlider) {
      const newValue = (sliderValue as number[]).slice()
      newValue[valueArrIdx] = changedValue
      setSliderValue(newValue)
      if (onChange) {
        // Callback for provided onChange func
        onChange(event, newValue)
      }
      return
    }

    setSliderValue([changedValue])
    if (onChange) {
      // Callback for provided onChange func
      onChange(event, [changedValue])
    }
  }
  const handleKeyUp = (event) => {
    if (event.keyCode === 37 || event.keyCode === 39) {
      handleCommitedValue(event)
    }
  }

  const handleCommitedValue = (event) => {
    if (onChangeCommitted) {
      onChangeCommitted(event, sliderValue[1])
    }
  }

  const getFormattedText = (text) => {
    return outputFunction ? outputFunction(text) : text
  }

  const findClosestRange = (event) => {
    if (event.target.type === 'output') {
      return
    }
    const bounds = event.target.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const inputWidth = minRange.current.offsetWidth
    const minValue = minRange.current.value
    const maxValue = maxRange.current.value
    const diff = max - min

    const normX = (x / inputWidth) * diff + min

    const maxX = Math.abs(normX - parseInt(maxValue))
    const minX = Math.abs(normX - parseInt(minValue))
    if (minX > maxX) {
      minRange.current.style.zIndex = '10'
      maxRange.current.style.zIndex = '20'
    } else {
      minRange.current.style.zIndex = '20'
      maxRange.current.style.zIndex = '10'
    }
  }

  const inputIdA = `${ariaLabelledby}-thumb-a`
  const inputIdB = `${ariaLabelledby}-thumb-b`
  const inputId = `${ariaLabelledby}-thumb`
  console.log('slidervalue', sliderValue)
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
            onMouseUp={(event) => handleCommitedValue(event)}
            onKeyUp={(event) => handleKeyUp(event)}
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
            onMouseUp={(event) => handleCommitedValue(event)}
            onKeyUp={(event) => handleKeyUp(event)}
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
          value={sliderValue[0]}
          disabled={disabled}
        >
          <SliderInput
            type="range"
            value={sliderValue[0]}
            min={min}
            max={max}
            step={step}
            id={inputId}
            onChange={(event) => {
              onValueChange(event, 1)
            }}
            disabled={disabled}
            aria-labelledby={ariaLabelledby}
            onMouseUp={(event) => handleCommitedValue(event)}
            onKeyUp={(event) => handleKeyUp(event)}
          />
          <Output htmlFor={inputId} value={sliderValue[0]}>
            {getFormattedText(sliderValue[0])}
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

Slider.displayName = 'eds-slider'
