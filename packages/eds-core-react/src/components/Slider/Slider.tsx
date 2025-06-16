import {
  forwardRef,
  useState,
  useRef,
  HTMLAttributes,
  MouseEvent,
  TouchEvent,
  KeyboardEvent,
  useEffect,
  ChangeEvent,
  useCallback,
} from 'react'
import styled, { css } from 'styled-components'
import { slider as tokens } from './Slider.tokens'
import { MinMax } from './MinMax'
import { Output } from './Output'
import { SliderInput } from './SliderInput'
import { bordersTemplate, useId } from '@equinor/eds-utils'

const {
  entities: { track, handle, dot, output },
} = tokens

const encodedTrackColor = encodeURIComponent(track.background)
const encodedHoverColor = encodeURIComponent(track.states.hover.background)

const fakeTrackBg = css`
  background-image: url("data:image/svg+xml,<svg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'><rect x='0' y='11' fill='${encodedTrackColor}' width='100%' height='4' rx='2' /></svg>");
  background-size: cover;
  background-repeat: no-repeat;
`

const trackFill = css`
  grid-column: 1 / span 2;
  grid-row: 2;
  height: ${track.height};
  margin-bottom: ${track.spacings.bottom};
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
  $valA: number
  $valB: number
  $min: number
  $max: number
  $disabled: boolean
  $hideActiveTrack: boolean
  $labelAlwaysOn: boolean
  $labelBelow: boolean
  $touchNavigation: boolean
}

const RangeWrapper = styled.div.attrs<RangeWrapperProps>(
  ({
    $min,
    $max,
    $valA,
    $valB,
    $disabled,
    $hideActiveTrack,
    $labelAlwaysOn,
    style,
  }) => ({
    'data-disabled': $disabled ? true : null,
    style: {
      '--a': $valA,
      '--b': $valB,
      '--min': $min,
      '--max': $max,
      '--showTooltip': $labelAlwaysOn ? 1 : 0,
      '--background': $disabled
        ? track.entities.indicator.states.disabled.background
        : $hideActiveTrack
          ? 'transparent'
          : track.entities.indicator.background,
      ...style,
    },
  }),
)<RangeWrapperProps>`
  --dif: calc(var(--max) - var(--min));
  --realWidth: calc(100% - 12px);
  ${wrapperGrid}
  ${fakeTrackBg}
  &::before,
  &::after {
    ${trackFill};
    background: var(--background);
  }
  /** Faking the active region of the slider */
  &::before {
    margin-left: calc(
      calc(${handle.width} / 2) + (var(--a) - var(--min)) / var(--dif) *
        var(--realWidth)
    );
    width: calc((var(--b) - var(--a)) / var(--dif) * var(--realWidth));
  }

  &::after {
    margin-left: calc(
      calc(${handle.width} / 2) + (var(--b) - var(--min)) / var(--dif) *
        var(--realWidth)
    );
    width: calc((var(--a) - var(--b)) / var(--dif) * var(--realWidth));
  }

  &:has(:focus-visible),
  &:hover {
    & > output {
      --showTooltip: 1;
      --tooltip-background: ${output.states.hover.background};
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([data-disabled]) {
      background-image: url("data:image/svg+xml,<svg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'><rect x='0' y='11' fill='${encodedHoverColor}' width='100%' height='4' rx='2' /></svg>");

      &::before,
      &::after {
        background: ${({ $hideActiveTrack }) =>
          $hideActiveTrack
            ? 'transparent'
            : track.entities.indicator.states.hover.background};
      }
    }
  }

  ${({ $touchNavigation }) =>
    $touchNavigation &&
    css`
      & > input[type='range'] {
        pointer-events: none;
      }

      & > input[type='range']::-webkit-slider-thumb {
        pointer-events: auto;
      }
      & > input[type='range']::-moz-range-thumb {
        pointer-events: auto;
      }
    `};
  ${({ $labelBelow }) =>
    $labelBelow &&
    css`
      & > output {
        top: calc(100% + 1px);
        bottom: unset;
      }
    `};
`

type WrapperProps = {
  $min: number
  $max: number
  $hideActiveTrack: boolean
  $labelAlwaysOn: boolean
  $labelBelow: boolean
  $disabled: boolean
} & Pick<SliderProps, 'value'>

const Wrapper = styled.div.attrs<WrapperProps>(
  ({
    $min,
    $max,
    value,
    $disabled,
    $hideActiveTrack,
    $labelAlwaysOn,
    style,
  }) => ({
    'data-disabled': $disabled ? true : null,
    style: {
      '--min': $min,
      '--max': $max,
      '--value': value,
      '--showTooltip': $labelAlwaysOn ? 1 : 0,
      '--background': $disabled
        ? track.entities.indicator.states.disabled.background
        : $hideActiveTrack
          ? 'transparent'
          : track.entities.indicator.background,
      ...style,
    },
  }),
)<WrapperProps>`
  --dif: calc(var(--max) - var(--min));
  --realWidth: calc(100% - 12px);
  ${wrapperGrid}
  ${fakeTrackBg}
  &::after {
    ${trackFill}
    background: var(--background)
  }
  &::after {
    margin-right: calc(
      (var(--max) - var(--value)) / var(--dif) * var(--realWidth)
    );
    /* Adjusting for start dot circle */
    margin-left: 3px;
  }

  &:has(:focus-visible),
  &:hover {
    & > output {
      --showTooltip: 1;
      --tooltip-background: ${output.states.hover.background};
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([data-disabled]) {
      background-image: url("data:image/svg+xml,<svg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'><rect x='0' y='11' fill='${encodedHoverColor}' width='100%' height='4' rx='2' /></svg>");

      &::after {
        background: ${({ $hideActiveTrack }) =>
          $hideActiveTrack
            ? 'transparent'
            : track.entities.indicator.states.hover.background};
      }
    }

    ${({ $labelBelow }) =>
      $labelBelow &&
      css`
        & > output {
          top: calc(100% + 1px);
          bottom: unset;
        }
      `};
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
    width: ${dot.width};
    height: ${dot.height};
    background: ${tokens.background};
    ${bordersTemplate(dot.border)};
    bottom: ${dot.spacings.bottom};
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

export type SliderProps = {
  /**
   * Id for the elements that labels this slider
   * @deprecated  Use the `aria-labelledby` instead
   * */
  ariaLabelledby?: string
  /** Components value, range of numbers */
  value: number[] | number
  /** Function to be called when value change */
  onChange?: (event: ChangeEvent<HTMLInputElement>, newValue: number[]) => void
  /** Function to be called when value is committed by mouseup event */
  onChangeCommitted?: (
    event: MouseEvent | KeyboardEvent | TouchEvent,
    newValue: number[],
  ) => void
  /** Function for formatting the displayed value. E.g. formatting dates, or adding a unit suffix */
  outputFunction?: (value: number) => string
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
  /** hides the "active" fill color from the track */
  hideActiveTrack?: boolean
  /** Make the current value label always visible, otherwise it only shows on hover/focus or while using touch input
   * @default false
   */
  labelAlwaysOn?: boolean
  /** Display the value label below the track
   * @default false
   */
  labelBelow?: boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    value = [40, 60],
    outputFunction,
    onChange,
    onChangeCommitted,
    minMaxDots = true,
    minMaxValues = true,
    labelAlwaysOn,
    labelBelow,
    step = 1,
    disabled,
    hideActiveTrack,
    ariaLabelledby,
    'aria-labelledby': ariaLabelledbyNative,
    ...rest
  },
  ref,
) {
  const isNumber = !Array.isArray(value)
  const isRangeSlider = !isNumber && value.length === 2

  const parsedValue: number[] = isNumber ? [value] : value
  const [initalValue, setInitalValue] = useState<number[]>(parsedValue)
  const [sliderValue, setSliderValue] = useState<number[]>(parsedValue)
  const [mousePressed, setMousePressed] = useState<boolean>(false)
  const [touchNavigation, setTouchNavigation] = useState<boolean>(false)

  useEffect(() => {
    if (isRangeSlider) {
      if (value[0] !== initalValue[0] || value[1] !== initalValue[1]) {
        setInitalValue(value)
        setSliderValue(value)
      }
    } else {
      const numberValue = Number(value)
      if (numberValue !== initalValue[0]) {
        setInitalValue([numberValue])
        setSliderValue([numberValue])
      }
    }
  }, [value, initalValue, isRangeSlider])

  const minRange = useRef<HTMLInputElement>(null)
  const maxRange = useRef<HTMLInputElement>(null)
  const onValueChange = (
    event: ChangeEvent<HTMLInputElement>,
    valueArrIdx?: number,
  ) => {
    const changedValue = parseFloat(event.target.value)
    if (isRangeSlider) {
      const newValue = sliderValue.slice()
      newValue[valueArrIdx] = changedValue

      //Prevent min/max values from crossing eachother
      if (valueArrIdx === 0 && newValue[0] >= newValue[1]) {
        newValue[0] = newValue[1]
        maxRange.current?.focus()
      }

      if (valueArrIdx === 1 && newValue[1] <= newValue[0]) {
        newValue[1] = newValue[0]
        minRange.current?.focus()
      }

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
  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      handleCommitedValue(event)
    }
  }

  const handleCommitedValue = (
    event: KeyboardEvent | MouseEvent | TouchEvent,
  ) => {
    if (onChangeCommitted) {
      onChangeCommitted(event, sliderValue)
    }
  }

  const getFormattedText = (text: number) => {
    return outputFunction ? outputFunction(text) : text
  }

  const findClosestRange = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLOutputElement | HTMLInputElement
    if (target.type === 'output' || mousePressed) {
      return
    }
    let clientX: number
    if (event.type === 'touchstart') {
      clientX = (event as TouchEvent<HTMLInputElement>).targetTouches[0].clientX
      setTouchNavigation(true)
    } else if (event.type === 'mousemove') {
      clientX = (event as MouseEvent<HTMLInputElement>).clientX
      setTouchNavigation(false)
    }

    const bounds = target.getBoundingClientRect()
    const x = clientX - bounds.left
    const inputWidth = minRange.current.offsetWidth
    const minValue = parseFloat(minRange.current.value)
    const maxValue = parseFloat(maxRange.current.value)
    const diff = max - min

    const normX = (x / inputWidth) * diff + min

    const maxX = Math.abs(normX - maxValue)
    const minX = Math.abs(normX - minValue)
    if (minX > maxX) {
      minRange.current.style.zIndex = '10'
      maxRange.current.style.zIndex = '20'
    } else {
      minRange.current.style.zIndex = '20'
      maxRange.current.style.zIndex = '10'
    }
    //special cases where both thumbs are all the way to the left or right
    if (minValue === maxValue && minValue === min) {
      minRange.current.style.zIndex = '10'
      maxRange.current.style.zIndex = '20'
    }
    if (minValue === maxValue && maxValue === max) {
      minRange.current.style.zIndex = '20'
      maxRange.current.style.zIndex = '10'
    }
  }

  const handleDragging = (type: string) => {
    if (type === 'mousedown' || type === 'touchmove') {
      setMousePressed(true)
    } else {
      setMousePressed(false)
    }
  }

  let inputIdA = useId(null, 'inputA')
  let inputIdB = useId(null, 'inputB')
  let inputId = useId(null, 'thumb')
  if (rest['id']) {
    const overrideId = rest['id']
    inputIdA = `${overrideId}-thumb-a`
    inputIdB = `${overrideId}-thumb-b`
    inputId = `${overrideId}-thumb`
  }

  const getAriaLabelledby = useCallback(() => {
    if (ariaLabelledbyNative) return ariaLabelledbyNative
    if (ariaLabelledby) return ariaLabelledby
    return null
  }, [ariaLabelledbyNative, ariaLabelledby])

  return (
    <>
      {isRangeSlider ? (
        <RangeWrapper
          {...rest}
          ref={ref}
          role="group"
          aria-labelledby={getAriaLabelledby()}
          $valA={sliderValue[0]}
          $valB={sliderValue[1]}
          $max={max}
          $min={min}
          $disabled={disabled}
          $hideActiveTrack={hideActiveTrack}
          $labelAlwaysOn={labelAlwaysOn || touchNavigation}
          $labelBelow={labelBelow}
          $touchNavigation={touchNavigation}
          onMouseMove={findClosestRange}
          onTouchStartCapture={findClosestRange}
          onTouchEnd={(e) => handleDragging(e.type)}
          onTouchMove={(e) => handleDragging(e.type)}
          onMouseDown={(e) => handleDragging(e.type)}
          onMouseUp={(e) => handleDragging(e.type)}
        >
          {minMaxDots && <WrapperGroupLabelDots />}
          <SrOnlyLabel htmlFor={inputIdA}>Value A</SrOnlyLabel>
          <SliderInput
            type="range"
            ref={minRange}
            value={sliderValue[0]}
            max={max}
            min={min}
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={sliderValue[0]}
            aria-valuetext={getFormattedText(sliderValue[0]).toString()}
            id={inputIdA}
            step={step}
            onChange={(event) => {
              onValueChange(event, 0)
            }}
            onMouseUp={(event) => handleCommitedValue(event)}
            onTouchEnd={(event) => handleCommitedValue(event)}
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
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={sliderValue[1]}
            aria-valuetext={getFormattedText(sliderValue[1]).toString()}
            id={inputIdB}
            step={step}
            ref={maxRange}
            onChange={(event) => {
              onValueChange(event, 1)
            }}
            onMouseUp={(event) => handleCommitedValue(event)}
            onTouchEnd={(event) => handleCommitedValue(event)}
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
          $max={max}
          $min={min}
          value={sliderValue[0]}
          $disabled={disabled}
          $hideActiveTrack={hideActiveTrack}
          $labelAlwaysOn={labelAlwaysOn || touchNavigation}
          $labelBelow={labelBelow}
          onTouchStartCapture={() => setTouchNavigation(true)}
          onMouseDownCapture={() => setTouchNavigation(false)}
        >
          <SliderInput
            type="range"
            value={sliderValue[0]}
            min={min}
            max={max}
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={sliderValue[0]}
            aria-valuetext={getFormattedText(sliderValue[0]).toString()}
            step={step}
            id={inputId}
            onChange={(event) => {
              onValueChange(event)
            }}
            disabled={disabled}
            aria-labelledby={getAriaLabelledby()}
            onMouseUp={(event) => handleCommitedValue(event)}
            onKeyUp={(event) => handleKeyUp(event)}
            onTouchEnd={(event) => handleCommitedValue(event)}
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
