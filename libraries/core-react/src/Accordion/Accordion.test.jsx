/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { accordion as tokens } from './Accordion.tokens'
import { Accordion } from '.'

afterEach(cleanup)

describe('Accordion', () => {
  it('Does stuff', () => {
    render(<Accordion />)
    screen.debug()
  })
})
