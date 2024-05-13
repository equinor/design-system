import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useState,
  CSSProperties,
} from 'react'
import styled, { keyframes } from 'styled-components'
import * as tokens from './LinearProgress.tokens'

const indeterminate = keyframes`
  0%{
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }

`

const Track = styled.div`
  position: relative;
  overflow: hidden;
  height: 4px;
  background-color: ${tokens.primary.background};
  width: 100%;
  border-radius: 50px;
`

const ProgressBar = styled.div`
  transition: transform 0.4s linear;
  background-color: ${tokens.primary.entities.progress.background};
  width: 100%;
  border-radius: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
`
const IndeterminateProgressBar = styled.div`
  width: 75%;
  border-radius: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  transition: transform 0.2s linear;
  transform-origin: left;
  background-color: ${tokens.primary.entities.progress.background};
  animation: ${indeterminate} 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) 1s
    infinite;
`

const SrOnlyOutput = styled.output`
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

export type LinearProgressProps = {
  /** Variant
   * Use indeterminate when there is no progress value */
  variant?: 'indeterminate' | 'determinate'
  /** The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value?: number
} & HTMLAttributes<HTMLDivElement>

const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
  function LinearProgress(
    { variant = 'indeterminate', value = null, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
    }
    const [srProgress, setSrProgress] = useState(0)

    let barStyle: string
    if (variant === 'determinate') {
      if (value !== undefined) {
        props['aria-valuenow'] = Math.round(value)
        props['aria-valuemin'] = 0
        props['aria-valuemax'] = 100
        const transform = value - 100

        barStyle = `translateX(${transform}%)`
      }
    }

    const transformStyle: CSSProperties = {
      transform: barStyle,
    }

    useEffect(() => {
      if (variant === 'indeterminate') return
      if (value >= 25 && value < 50) {
        setSrProgress(25)
      } else if (value >= 50 && value < 75) {
        setSrProgress(50)
      } else if (value >= 75 && value < 100) {
        setSrProgress(75)
      } else if (value === 100) {
        setSrProgress(100)
      }
    }, [value, variant])

    const getProgressFormatted = () => {
      return `Loading ${srProgress}%`
    }

    return (
      <>
        <Track {...props} role="progressbar">
          {variant === 'indeterminate' ? (
            <IndeterminateProgressBar />
          ) : (
            <ProgressBar style={transformStyle} />
          )}
        </Track>
        {variant === 'determinate' && (
          <SrOnlyOutput>{getProgressFormatted()}</SrOnlyOutput>
        )}
      </>
    )
  },
)

// LinearProgress.displayName = 'eds-linear-progress'

export { LinearProgress }
