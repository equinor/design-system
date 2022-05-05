/* eslint-disable no-undef */
import { render, cleanup, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { DatePicker } from './DatePicker'

afterEach(cleanup)

describe('DatePicker', () => {
  // it('Matches snapshot', () => {
  //   const { asFragment } = render(
  //     <DatePicker
  //       id="date-picker-test"
  //       dateValue={new Date()}
  //       label="DatePicker"
  //     />,
  //   )
  //   expect(asFragment()).toMatchSnapshot()
  // })
  it('calendar should show on click', async () => {
    const testDate = new Date(2021, 8, 8)
    const onChangedFunction = jest.fn()

    render(
      <DatePicker
        id={'clickPicker'}
        dateValue={testDate}
        onChanged={onChangedFunction}
        label={'Focus Test'}
      />,
    )
    const inputElement = screen.getByLabelText('Focus Test')

    inputElement.focus()

    expect(await screen.findByText(/28/i)).toBeTruthy()
  })

  test('calendar should hide on selection', async () => {
    const testDate = new Date(2021, 8, 8)
    const onChangedFunction = jest.fn()

    render(
      <DatePicker
        id={'clickPicker'}
        dateValue={testDate}
        onChanged={onChangedFunction}
        label={'Focus Test'}
      />,
    )
    const inputElement = screen.getByLabelText('Focus Test')

    inputElement.focus()

    const chooseDay = await screen.findByText(/15/i)
    fireEvent.click(chooseDay)
    expect(screen.queryByText(/28/i)).toBeNull()
  })
})
