/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { Label } from './Label'

afterEach(cleanup)

describe('Label', () => {
  it('Has correct label text', () => {
    const labelText = 'Some label'
    const { queryByText } = render(
      <Label htmlFor="test-label" label={labelText} />,
    )

    expect(queryByText(labelText)).toBeInTheDocument()
  })
})
