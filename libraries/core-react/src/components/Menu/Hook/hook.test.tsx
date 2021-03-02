import { render } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { Hook, BasicPopper } from './Hook'

test('should render', async () => {
  const { container } = render(<Hook />)

  expect(container).toBeInTheDocument()
})
