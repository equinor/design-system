import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { TimePicker } from './TimePicker'

const labelText = 'Click test'

describe('TimePicker', () => {
  it('timepicker should show on click', async () => {
    const { container } = render(<TimePicker value="11:00" label={labelText} />)
    fireEvent.click(container)
    await screen.findByRole('dialog')
  })

  it('closes the options when disabled and can select after re-enabling', () => {
    const onValueChanged = jest.fn()
    const props = { value: '11:00', label: labelText, onValueChanged }
    const { rerender } = render(<TimePicker {...props} />)

    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: '12:00' })).toBeTruthy()

    rerender(<TimePicker {...props} disabled />)
    expect(screen.queryByRole('option', { name: '12:00' })).toBeNull()
    expect(onValueChanged).not.toHaveBeenCalled()

    rerender(<TimePicker {...props} />)
    expect(screen.queryByRole('option', { name: '12:00' })).toBeNull()
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: '12:00' }))
    expect(onValueChanged).toHaveBeenCalledTimes(1)
    expect(onValueChanged).toHaveBeenCalledWith('12:00')
  })

  it('timepicker should hide on selection', async () => {
    const { container } = render(<TimePicker value="01:00" label={labelText} />)
    const optionsNode = screen.getAllByLabelText(labelText)[1]
    const buttonNode = screen.getByLabelText('toggle options', {
      selector: 'button',
    })
    fireEvent.click(container)

    expect(within(buttonNode).queryAllByRole('option')).toHaveLength(0)
    fireEvent.click(buttonNode)
    const timeItem = within(optionsNode).queryAllByRole('option')[0]
    fireEvent.click(timeItem)
    await waitFor(() => {
      return expect(within(optionsNode).queryAllByRole('option')).toHaveLength(
        0,
      )
    })
  })
})
