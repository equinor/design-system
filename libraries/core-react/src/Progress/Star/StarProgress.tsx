import React, { forwardRef, SVGProps, Ref } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { progress as tokens } from '../Progress.tokens'

const indeterminate = keyframes`
    0% {
        opacity: 1;
    }
    20% {
        opacity: 0.8;
    }
    40% {
        opacity: 0.6;
    }
    60% {
        opacity: 0.4;
    }
    80% {
        opacity: 0.2;
    }
    100% {
        opacity: 0.05;
    }
`

const determinate = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.05;
  }
  20% {
    opacity: 0.2:
  }
  40% {
    opacity: 0.4;
  }
  60% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
`

type SvgProps = {
  progress: number
} & Pick<StarProgressProps, 'variant'> &
  SVGProps<SVGSVGElement>

const Svg = styled.svg<SvgProps>`
  fill: ${tokens.star.background};
  ${({ variant, progress }) =>
    variant === 'indeterminate'
      ? css`
          path {
            &:nth-child(1) {
              animation: ${indeterminate} 1.3s linear infinite;
            }
            &:nth-child(2) {
              animation: ${indeterminate} 1.3s linear 0.3s infinite;
            }
            &:nth-child(3) {
              animation: ${indeterminate} 1.3s linear 0.4s infinite;
            }
            &:nth-child(4) {
              animation: ${indeterminate} 1.3s linear 0.6s infinite;
            }
            &:nth-child(5) {
              animation: ${indeterminate} 1.3s linear 0.8s infinite;
            }
            &:nth-child(6) {
              animation: ${indeterminate} 1.3s linear 1s infinite;
            }
          }
        `
      : css`
          path {
            animation: ${determinate} 1.3s linear;
            &:nth-child(6) {
              animation-play-state: ${progress > 90 ? 'running' : 'paused'};
            }
            &:nth-child(5) {
              animation-play-state: ${progress > 80 ? 'running' : 'paused'};
            }
            &:nth-child(4) {
              animation-play-state: ${progress > 60 ? 'running' : 'paused'};
            }
            &:nth-child(3) {
              animation-play-state: ${progress > 40 ? 'running' : 'paused'};
            }
            &:nth-child(2) {
              animation-play-state: ${progress > 20 ? 'running' : 'paused'};
            }
            &:nth-child(1) {
              animation-play-state: ${progress <= 20 ? 'running' : 'paused'};
            }
          }
        `}
`

export type StarProgressProps = {
  /** Use indeterminate when there is no progress value */
  variant?: 'indeterminate' | 'determinate'
  /** @ignore */
  className?: string
  /** The value of the progress indicator for determinate variant
   * Value between 0 and 100 */
  value?: number
  /** @ignore */
  ref?: Ref<SVGSVGElement>
} & SVGProps<SVGSVGElement>

const StarProgress = forwardRef<SVGSVGElement, StarProgressProps>(
  function StarProgress(
    { variant = 'indeterminate', className = '', value = null, ...rest },
    ref,
  ) {
    const progress = Math.round(value)

    const rootProps = {
      ref,
      ...rest,
      variant,
      progress,
    }

    if (variant === 'determinate') {
      if (value !== undefined) {
        rootProps['aria-valuenow'] = progress
        rootProps['aria-valuemin'] = 0
        rootProps['aria-valuemax'] = 100
      }
    }

    return (
      <Svg
        {...rootProps}
        role="progressbar"
        className={`${className} ${variant}-progress`}
        width="40"
        height="48"
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M32.756 34.6798L29.482 36.5817C29.4139 36.6219 29.3295 36.6227 29.2606 36.5829L25.9476 34.7151C25.7975 34.6306 25.7967 34.4149 25.9456 34.3284L29.2397 32.4256C29.3077 32.3858 29.3914 32.3858 29.4603 32.4248L32.754 34.2931C32.9033 34.3784 32.9041 34.5929 32.756 34.6798Z" />
        <path d="M25.9596 45.4706L22.6655 43.5867C22.5966 43.5469 22.554 43.4744 22.554 43.396V41.4289V39.5922C22.5519 39.4204 22.7381 39.3109 22.8878 39.397L26.1819 41.2981C26.25 41.3379 26.2926 41.4104 26.2934 41.4896V43.4268V45.2762C26.2947 45.4472 26.1085 45.5559 25.9596 45.4706Z" />
        <path d="M12.3022 47.7037V44.9795V42.6544C12.3022 42.5495 12.3576 42.4515 12.4482 42.3986L14.1262 41.4062L16.8143 39.8188C17.0119 39.7019 17.2617 39.8442 17.2625 40.0739L17.2633 42.7627V45.1456C17.2633 45.251 17.2079 45.3486 17.1165 45.4015L12.7496 47.9587C12.552 48.0748 12.3031 47.9325 12.3022 47.7037Z" />
        <path d="M0.221343 34.2106L6.76939 30.4056C6.90636 30.326 7.07449 30.3256 7.21227 30.4023L13.8378 34.1401C14.138 34.3095 14.14 34.7413 13.8415 34.9131L7.25492 38.7182C7.11795 38.7977 6.94941 38.7985 6.81204 38.7206L0.225854 34.9836C-0.0734986 34.8139 -0.075549 34.3833 0.221343 34.2106Z" />
        <path d="M6.03876 9.125L16.9237 15.5151C17.1513 15.6484 17.2903 15.8912 17.2903 16.1549V28.8331C17.2903 29.4076 16.665 29.7647 16.1704 29.4728L5.28546 23.0264C5.05869 22.8919 4.92008 22.6479 4.9209 22.3855V9.76307C4.92254 9.1902 5.54503 8.83467 6.03876 9.125Z" />
        <path d="M39.6262 1.07261V11.7603V19.3368C39.627 19.7178 39.4265 20.0709 39.0988 20.2644L31.4145 24.8195L23.3545 29.5964C22.6385 30.0192 21.7339 29.5029 21.7339 28.6717V10.3259C21.7339 9.94495 21.9356 9.5927 22.2641 9.39955L38.008 0.149533C38.7232 -0.270381 39.6241 0.24385 39.6262 1.07261Z" />
      </Svg>
    )
  },
)

// StarProgress.displayName = 'eds-star-progress'

export { StarProgress }
