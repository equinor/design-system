import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateItem } from './index'

test('CreateItem renders', () => {
  render(
    <CreateItem
      createLabel="Label"
      isOpen={false}
      onCreate={() => undefined}
    ></CreateItem>,
  )
})

test('Renders label when open', () => {
  render(
    <CreateItem
      createLabel="Label"
      isOpen={true}
      onCreate={() => undefined}
    ></CreateItem>,
  )

  expect(screen.getByText('Label')).toBeInTheDocument()
})

test("Doesn't render label when closed", () => {
  render(
    <CreateItem
      createLabel="Label"
      isOpen={false}
      onCreate={() => undefined}
    ></CreateItem>,
  )

  expect(screen.queryByText('Label')).not.toBeInTheDocument()
})

test('Fires onCreate when clicked', () => {
  const onCreateFn = jest.fn()

  render(
    <CreateItem
      createLabel="Label"
      isOpen={true}
      onCreate={onCreateFn}
    ></CreateItem>,
  )

  const btn = screen.getByRole('button')
  userEvent.click(btn)

  expect(onCreateFn).toHaveBeenCalledTimes(1)
})
