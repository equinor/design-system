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

    await act(async () => {
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
      return Promise.resolve().then(() => {
        expect(screen.queryByText(/28/i)).toBeTruthy()
      })
    })
  })

  test('calendar should hide on selection', async () => {
    const testDate = new Date(2021, 8, 8)
    const onChangedFunction = jest.fn()

    await act(async () => {
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

      return Promise.resolve().then(() => {
        const chooseDay = screen.getByText(/15/i)
        fireEvent.click(chooseDay)
        expect(screen.queryByText(/28/i)).toBeNull()
      })
    })
  })
})
