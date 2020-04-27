import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { slider as tokens } from './Slider.tokens'
import { MinMax } from './MinMax'

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
const WrapperLabel = styled.label`
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
const Label = styled.div`
  grid-row: 1;
  grid-column: 1/-1;
`
const Output = styled.output`
  --val: ${({ value }) => value};
  --realWidth: calc(100% - 12px);
  width: fit-content;
  
  position: relative;
  z-index: 1;
  color: ${enabled.output.text};
  ${typographyTemplate(enabled.output.typography)}
  background: ${enabled.background};
  padding: 0 5px;
  margin-top: 6px;
  /* Calculate the distance on the track*/
  margin-left: calc((var(--val) - var(--min)) / var(--dif) * var(--realWidth));
  /* Idea: Transform negative ((width of outline elem - handle width) / 2 (half of width for centering)) */
  transform: translate(calc(-1 * calc(var(--realWidth) / 2)));
  grid-row: 3;
  grid-column: 1 / 3;
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

const StyledSlider = styled.input`
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
    ${thumb}
  }

  &::-webkit-slider-runnable-track {
    ${track}
  }
  &::-moz-range-track {
    ${track}
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

  // At least some internal state for now to avoid both handles on top of each other at init
  // @TODO single state and onChange function
  // @TODO: ZOMG, Different files
  const [valueA, setValueA] = useState(value[0])
  const [valueB, setValueB] = useState(value[1])
  const [valueZ, setValueZ] = useState(value)

  // @TODO DRY
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
  const onChangeZ = (event) => {
    const newVal = event.target.value
    setValueZ(newVal)
    if (onChange) {
      onChange(event, newVal)
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
          valA={valueA}
          valB={valueB}
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
          <MinMax>{outputFunction ? outputFunction(min) : min}</MinMax>
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
          <MinMax>{outputFunction ? outputFunction(max) : max}</MinMax>
        </Wrapper>
      ) : (
        <WrapperLabel max={max} min={min} value={valueZ}>
          {/*  Need an element for pseudo elems :/ */}
          {minMaxDots && <WrapperGroupLabelDots />}
          <Label>{label}</Label>
          <StyledSlider
            type="range"
            value={valueZ}
            min={min}
            max={max}
            step={step}
            id="simple"
            onChange={(event) => {
              onChangeZ(event)
            }}
          />
          <Output
            htmlFor="simple"
            value={valueZ}
            min={min}
            minMaxDots={minMaxDots}
          >
            {outputFunction ? outputFunction(valueZ) : valueZ}
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
