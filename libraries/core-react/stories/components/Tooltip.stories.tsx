import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  Tooltip,
  TooltipProps,
  Typography,
  Button,
  Table,
  Icon,
} from '@components'
import { data, columns } from './helpers/data'
import { toCellValues } from './helpers/toCellValues'
import { Story, Meta } from '@storybook/react'

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
`

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 64px;
  grid-template-columns: repeat(3, fit-content(100%));
`

const TextWrapper = styled.div`
  margin-bottom: 32px;
  width: 800px;
`

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      defaultValue: 'This is the tooltip title',
    },
  },
} as Meta

export const Default: Story<TooltipProps> = (args) => {
  const [openState, setOpenState] = useState(false)

  const handleOpen = () => {
    setTimeout(() => {
      setOpenState(true)
    }, 300)
  }

  const handleClose = () => {
    setOpenState(false)
  }

  const referenceElement = useRef(null)

  return (
    <div style={{ margin: '3rem 10rem' }}>
      <Typography
        link
        href="#"
        ref={referenceElement}
        aria-describedby="tooltip"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
      >
        Hover me!
      </Typography>
      <Tooltip
        open={openState}
        id="tooltip"
        anchorEl={referenceElement.current}
        {...args}
      />
    </div>
  )
}

export const WithDisabledElements: Story<TooltipProps> = () => {
  const [openState, setOpenState] = useState(null)

  const handleOpen = (num: 1 | 2) => {
    setTimeout(() => {
      setOpenState(num)
    }, 300)
  }

  const handleClose = () => {
    setOpenState(null)
  }

  const referenceElementOne = useRef(null)
  const referenceElementTwo = useRef(null)

  const safariIcon = {
    name: 'safari',
    prefix: 'safari-logo',
    height: '24',
    width: '24',
    svgPathData:
      'M 320 0 C 143.234 0 0 143.234 0 320 s 143.234 320 320 320 s 320 -143.234 320 -320 S 496.766 0 320 0 Z m 49.725 44.363 l 9.791 1.972 l -11.716 58.832 l -9.792 -1.961 l 11.717 -58.843 Z m -99.45 551.168 l -9.791 -1.973 l 11.716 -58.831 l 9.792 1.96 l -11.717 58.844 Z M 396.477 50.564 l 9.555 2.917 l -8.716 28.725 l -9.556 -2.917 l 8.717 -28.725 Z M 243.522 589.4 l -9.555 -2.918 l 8.716 -28.724 l 9.556 2.917 l -8.717 28.725 Z M 431.804 63.2 l -22.973 55.442 l -9.236 -3.838 l 22.96 -55.442 l 9.249 3.839 Z M 208.278 576.764 l 22.96 -55.43 l 9.237 3.839 l -22.96 55.43 l -9.237 -3.84 Z M 447.572 70.69 l 8.788 4.712 l -14.115 26.446 l -8.8 -4.725 l 14.127 -26.433 Z M 192.427 569.287 l -8.788 -4.725 l 14.162 -26.433 l 8.8 4.713 l -14.174 26.445 Z m 376.906 -376.871 l -26.422 14.15 l -4.712 -8.8 l 26.398 -14.15 a 268.258 268.258 0 0 0 -9 -15.012 l -49.867 33.367 l -5.48 -8.362 l 49.878 -33.367 c -3.354 -4.76 -6.839 -9.354 -10.476 -13.996 l -23.115 19.004 l -6.366 -7.76 l 23.114 -19.004 c -3.767 -4.394 -7.76 -8.646 -11.764 -12.874 l -15.65 15.65 l -145.867 218.755 l -218.766 145.88 l -15.745 15.65 c 4.24 4.003 8.528 7.996 12.993 11.752 l 19.004 -23.115 l 7.76 6.366 l -19.004 23.115 c 4.523 3.602 9.236 7.004 13.996 10.358 l 33.13 -49.878 l 8.362 5.48 l -33.366 49.867 c 35.114 22.642 75.461 37.63 118.998 42.638 l 2.882 -29.87 l 9.992 0.992 l -2.882 29.87 c 5.87 0.52 11.634 0.756 17.516 0.886 v -60.012 h 10.004 v 60.012 c 5.882 -0.13 11.764 -0.402 17.528 -0.886 l -2.988 -29.87 l 9.992 -0.992 l 2.988 29.87 c 5.87 -0.685 11.622 -1.57 17.386 -2.598 l -11.705 -58.773 l 9.804 -1.96 l 11.693 58.796 c 5.74 -1.24 11.338 -2.705 16.937 -4.3 l -8.729 -28.7 l 9.556 -2.918 l 8.728 28.725 l -9.343 2.858 c 8.8 -2.504 17.375 -5.445 25.796 -8.74 l -22.925 -55.347 l 9.236 -3.84 l 22.937 55.36 c 5.35 -2.315 10.548 -4.807 15.72 -7.453 l -14.137 -26.398 l 8.8 -4.713 l 14.149 26.422 c 5.126 -2.847 10.193 -5.776 15.095 -8.953 l -33.367 -49.867 l 8.362 -5.48 l 33.367 49.878 c 4.76 -3.354 9.354 -6.838 13.996 -10.476 l -19.004 -23.115 l 7.76 -6.366 l 19.004 23.233 c 4.347 -3.756 8.646 -7.748 12.874 -11.764 l -42.355 -42.355 l 7.11 -7.122 l 42.367 42.367 c 4.004 -4.252 7.997 -8.48 11.764 -13.005 l -23.114 -19.004 l 6.366 -7.76 l 23.115 19.005 l 0.023 -0.012 c 3.603 -4.642 7.122 -9.237 10.359 -13.76 l -49.879 -33.367 l 5.48 -8.362 l 49.867 33.366 c 8.15 -12.626 15.225 -25.984 21.296 -39.874 l -55.43 -22.95 l 3.839 -9.236 l 55.441 22.961 c 8.693 -22.075 14.681 -45.46 17.492 -69.898 l -29.87 -2.882 l 0.992 -9.992 l 29.87 2.882 c 0.52 -5.87 0.756 -11.634 0.886 -17.516 l -60.012 -0.012 v -9.992 h 60.012 c -0.13 -5.882 -0.401 -11.764 -0.885 -17.528 l -29.87 2.988 l -0.993 -9.992 l 29.87 -2.988 a 278.127 278.127 0 0 0 -28.795 -95.187 Z M 70.854 447.573 l 26.398 -14.138 l 4.713 8.8 l -26.41 14.149 c 2.81 5.126 5.74 10.122 8.917 15.012 l 49.879 -33.367 l 5.516 8.363 l -49.879 33.366 v -0.035 c 3.354 4.76 6.72 9.484 10.359 13.996 l 23.114 -19.004 l 6.366 7.76 l -23.114 19.004 c 3.767 4.358 7.76 8.646 11.764 12.886 l 15.65 -15.65 L 279.993 279.95 L 498.76 134.081 l 15.993 -15.65 c -4.252 -4.004 -8.48 -7.996 -13.004 -11.764 l -19.005 23.115 l -7.76 -6.366 L 493.99 100.3 c -4.465 -3.59 -9.237 -6.992 -13.997 -10.358 l -33.366 49.878 l -8.362 -5.515 l 33.366 -49.879 c -35.114 -22.63 -75.461 -37.63 -118.998 -42.627 l -2.882 29.87 l -9.992 -1.003 l 2.882 -29.87 c -5.87 -0.508 -11.634 -0.756 -17.516 -0.874 v 60 h -10.04 v -60 c -5.882 0.118 -11.763 0.39 -17.527 0.874 l 3 29.87 l -9.993 1.004 l -3 -29.87 c -43.477 4.996 -83.87 19.878 -118.986 42.52 l 33.367 49.878 l -8.362 5.516 l -33.367 -49.878 c -4.76 3.401 -9.366 6.885 -13.996 10.523 l 18.992 23.115 l -7.748 6.366 l -19.004 -23.233 c -4.406 3.768 -8.646 7.76 -12.886 11.764 l 42.367 42.355 l -7.122 7.122 l -42.367 -42.355 c -4.004 4.24 -7.996 8.528 -11.752 12.993 l 23.114 19.004 l -6.366 7.76 l -23.115 -19.004 c -3.602 4.523 -7.004 9.236 -10.358 13.996 l 49.997 33.13 l -5.516 8.363 l -49.879 -33.367 a 272.578 272.578 0 0 0 -9.165 15.295 l 26.433 14.091 l -4.724 8.847 l -26.422 -14.127 a 284.62 284.62 0 0 0 -7.417 15.721 l 55.43 22.973 l -3.839 9.236 l -55.418 -22.96 c -2.15 5.432 -4.098 10.96 -5.917 16.559 l 28.665 8.716 l -2.917 9.555 l -28.619 -8.693 c -1.582 5.575 -2.952 11.21 -4.204 16.926 l 58.666 11.693 l -1.973 9.791 l -58.666 -11.68 c -1.04 5.621 -1.878 11.338 -2.551 17.055 l 29.882 2.881 l -1.004 9.993 l -29.87 -2.882 c -0.52 5.87 -0.756 11.634 -0.874 17.516 l 60 0.012 v 9.992 h -60 c 0.118 5.882 0.39 11.764 0.874 17.528 l 29.87 -2.989 l 1.004 9.993 l -29.882 2.988 c 0.673 5.835 1.583 11.575 2.587 17.291 l 58.678 -11.68 l 1.96 9.79 l -58.701 11.694 c 1.24 5.752 2.728 11.398 4.31 17.008 l 28.548 -8.67 l 2.918 9.556 l -28.595 8.681 a 277.767 277.767 0 0 0 5.894 16.465 l 55.264 -22.89 l 3.839 9.236 l -55.288 22.902 c 2.315 5.374 4.842 10.606 7.5 15.792 Z m 505.908 -239.294 l 3.839 9.236 l -55.43 22.961 l -3.839 -9.236 l 55.43 -22.961 Z m 12.602 35.28 l -28.724 8.728 l -2.918 -9.555 l 28.725 -8.728 l 2.917 9.555 Z m 6.166 26.717 l -58.843 11.716 l -1.96 -9.791 l 58.83 -11.717 l 1.973 9.792 Z m -1.925 109.242 L 534.773 367.8 l 1.961 -9.791 l 58.843 11.716 l -1.972 9.792 Z m -7.158 26.516 l -28.725 -8.717 l 2.918 -9.555 l 28.725 8.717 l -2.918 9.555 Z M 59.8 216.559 l 3.449 -8.28 a 304.285 304.285 0 0 0 -3.449 8.28 Z M 564.526 456.36 l -26.492 -14.114 l 4.712 -8.8 l 26.493 14.126 l -4.713 8.788 Z M 183.51 75.404 l 8.8 -4.713 l 14.173 26.434 l -8.8 4.724 l -14.173 -26.445 Z m 34.005 -15.969 l 22.96 55.442 l -9.236 3.838 l -22.96 -55.43 l 9.236 -3.85 Z m 26.008 -8.87 l 8.716 28.725 l -9.555 2.917 l -8.717 -28.725 l 9.556 -2.917 Z m 26.8 -6.118 l 11.716 58.831 l -9.792 1.973 l -11.716 -58.844 l 9.791 -1.96 Z m 328.68 251.082 l -0.638 -6.638 c 0.13 2.232 0.367 4.346 0.638 6.638 Z m -43.76 -127.525 l -4.524 -6.756 c 1.477 2.232 2.988 4.476 4.524 6.756 Z m -17.363 -23.882 l -2.763 -3.367 c 0.992 1.122 1.878 2.244 2.763 3.367 Z m -38.764 -39.355 l -3.354 -2.764 c 1.24 0.992 2.244 1.866 3.354 2.764 Z m -20.362 -15.532 l -6.756 -4.476 c 2.232 1.535 4.523 3 6.756 4.476 Z M 351.11 41.765 l -6.756 -0.637 c 2.232 0.13 4.523 0.366 6.756 0.638 Z m -55.584 -0.767 l -6.756 0.638 c 2.233 -0.13 4.465 -0.366 6.756 -0.638 Z m -127.525 43.76 l -6.756 4.477 c 2.233 -1.524 4.477 -2.988 6.756 -4.476 Z m -23.882 17.363 l -3.236 2.646 c 1.11 -0.874 2.114 -1.76 3.236 -2.646 Z m -39.355 38.764 l -2.764 3.355 c 0.993 -1.122 1.867 -2.244 2.764 -3.355 Z m -15.531 20.363 l -4.477 6.756 c 1.536 -2.233 3 -4.477 4.477 -6.756 Z M 41.764 288.89 l -0.637 6.756 c 0.13 -2.233 0.366 -4.477 0.637 -6.756 Z m -0.767 55.63 l 0.638 6.756 c -0.13 -2.232 -0.367 -4.511 -0.638 -6.756 Z m 43.76 127.36 l 4.477 6.756 c -1.524 -2.114 -2.989 -4.358 -4.477 -6.756 Z m 20.008 27.237 c -0.874 -1.11 -1.76 -2.114 -2.645 -3.236 l 2.645 3.236 Z m 36.119 36.119 l 3.236 2.645 c -1.122 -0.874 -2.126 -1.748 -3.236 -2.645 Z m 20.362 15.401 l 6.756 4.524 c -2.232 -1.358 -4.476 -2.882 -6.756 -4.524 Z m 127.643 47.6 l 6.756 0.637 c -2.232 -0.13 -4.476 -0.366 -6.756 -0.638 Z m 55.63 0.767 l 6.639 -0.638 c -2.233 0.13 -4.359 0.366 -6.638 0.638 Z m 127.479 -43.76 l 6.756 -4.524 c -2.232 1.476 -4.524 2.988 -6.756 4.524 Z m 23.882 -17.363 l 3.366 -2.763 c -1.122 0.992 -2.244 1.877 -3.366 2.763 Z m 21.886 -19.642 l 0.473 -0.472 l -0.473 0.472 Z m 17.469 -19.122 l 2.764 -3.354 c -0.992 1.122 -1.866 2.244 -2.764 3.354 Z m 63.768 -154.762 c -0.236 2.232 -0.366 4.524 -0.637 6.756 l 0.637 -6.756 Z m -43.76 127.643 c -1.488 2.232 -3 4.524 -4.524 6.756 l 4.524 -6.756 Z',
  }

  const chromeIcon = {
    name: 'moon',
    prefix: 'starwars',
    height: '24',
    width: '24',
    svgPathData:
      'M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z',
  }

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Tooltip with disabled elements</Typography>
        <Typography variant="body_long">
          Firefox, Edge and Chrome supports tooltip on disabled elements. We
          found onPointerEnter and onPointerLeave was the best way to trigger
          events on disabled elements.
        </Typography>
        <Typography variant="body_long" style={{ marginTop: 8 }}>
          If you have Safari users, you will need to add inline style to your
          disabled element, shown in the example below, as well as wrapping the
          anchor inside a div which will handle the pointer event handlers. This
          will help trigger the mouse events correctly. Unfortunately, this
          workaround overwrites the &apos;not-allowed&apos; cursor.
        </Typography>
      </TextWrapper>
      <Wrapper>
        <Button
          disabled
          variant="ghost_icon"
          aria-describedby="tooltip-disabled-chrome"
          ref={referenceElementOne}
          onPointerEnter={() => handleOpen(1)}
          onPointerLeave={handleClose}
        >
          Disabled, but hover works!
        </Button>

        <Tooltip
          id="tooltip-disabled-chrome"
          open={openState === 1}
          title="Disabled button, but hover works!"
          anchorEl={referenceElementOne.current}
        />

        <div
          ref={referenceElementTwo}
          onPointerEnter={() => handleOpen(2)}
          onPointerLeave={handleClose}
          aria-describedby="tooltip-disabled-safari"
        >
          <Button
            disabled
            style={{ pointerEvents: 'none' }}
            variant="ghost_icon"
          >
            <Icon
              title="Safari disabled button has Tooltip!"
              data={safariIcon}
            ></Icon>
          </Button>
        </div>

        <Tooltip
          id="tooltip-disabled-safari"
          open={openState === 2}
          title="Disabled button, but hover works!"
          anchorEl={referenceElementTwo.current}
        />
      </Wrapper>
    </Body>
  )
}

export const TableCellsWithTooltip: Story<TooltipProps> = () => {
  const cellValues = toCellValues(data, columns)
  const [state, setState] = useState<{
    openRow: number
    openCell: number
  }>({
    openRow: null,
    openCell: null,
  })

  const handleOpen = (openRow: number, openCell: number) => {
    setTimeout(() => {
      setState({
        openRow,
        openCell,
      })
    }, 300)
  }

  const handleClose = () => {
    setState({ openRow: null, openCell: null })
  }

  const { openRow, openCell } = state

  return (
    <Table>
      <Table.Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Table.Caption>
      <Table.Head>
        <Table.Row>
          {columns.map((col) => (
            <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {cellValues?.map((row, rowIndex) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue, cellIndex) => {
              const createdRef = React.useRef(null)
              return (
                <Table.Cell key={cellValue}>
                  <span
                    ref={createdRef}
                    onMouseEnter={() => handleOpen(rowIndex, cellIndex)}
                    onMouseLeave={handleClose}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    {cellValue}
                    <Tooltip
                      open={openRow === rowIndex && openCell === cellIndex}
                      placement="top"
                      title={`Tooltip title for ` + cellValue}
                      anchorEl={createdRef.current}
                    />
                  </span>
                </Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
