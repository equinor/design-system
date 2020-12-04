/* eslint-disable no-undef */
import * as React from 'react'
import { useState } from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { MultiSelect } from '.'

const items = ['One', 'Two', 'Three']
afterEach(cleanup)

describe('MultiSelect', () => {
  it('Has provided label', () => {
    const labelText = 'Select label test'
    render(<MultiSelect label={labelText} items={items} id="id" />)
    // The same label is used for both the input field and the list of options
    const inputNode = screen.getAllByLabelText(labelText)
    expect(inputNode).toBeDefined()
  })
})
