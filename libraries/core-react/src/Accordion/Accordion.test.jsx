/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { attach_file, notifications } from '@equinor/eds-icons'
import { accordion as tokens } from './Accordion.tokens'
import { Accordion } from '.'
import { Icon, Button } from '..'

const {
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} = Accordion

Icon.add({ attach_file, notifications })

afterEach(cleanup)

// const SomeAccordion = () => (
//   <Accordion>
//     <AccordionItem isExpanded>
//       <AccordionHeader>
//         <AccordionButton>Header 1</AccordionButton>
//       </AccordionHeader>
//       <AccordionPanel>Content 1</AccordionPanel>
//     </AccordionItem>
//     <AccordionItem>
//       <AccordionHeader chevronPosition="right">
//         <AccordionButton>Header 1</AccordionButton>
//       </AccordionHeader>
//       <AccordionPanel>Content 2</AccordionPanel>
//     </AccordionItem>
//     <AccordionItem>
//       <AccordionHeader>
//         <AccordionButton>Header 1</AccordionButton>
//       </AccordionHeader>
//       <AccordionPanel>Content 3</AccordionPanel>
//     </AccordionItem>
//   </Accordion>
// )

const SimpleAccordion = ({ headerLevel, chevronPosition }) => (
  <Accordion headerLevel={headerLevel} chevronPosition={chevronPosition}>
    <AccordionItem isExpanded>
      <AccordionHeader>
        <AccordionButton>Summary 1</AccordionButton>
      </AccordionHeader>
      <AccordionPanel>Details 1</AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>
        <AccordionButton>Summary 2</AccordionButton>
      </AccordionHeader>
      <AccordionPanel>Details 2</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

SimpleAccordion.propTypes = {
  headerLevel: PropTypes.string,
  chevronPosition: PropTypes.string,
}

SimpleAccordion.defaultProps = {
  headerLevel: 'h2',
  chevronPosition: 'left',
}

const AccordionWithIcons = () => (
  <Accordion>
    <AccordionItem>
      <AccordionHeader>
        <AccordionButton>
          Summary
          <Icon name="attach_file" title="Attach file" size={16} />
          <Icon name="notifications" title="Notifications" size={16} />
        </AccordionButton>
      </AccordionHeader>
      <AccordionPanel>Details</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

const AccordionWithButtons = () => (
  <Accordion>
    <AccordionItem>
      <AccordionHeader>
        <AccordionButton>Summary</AccordionButton>
        <Button variant="ghost_icon">
          <Icon name="attach_file" title="Attach file" />
        </Button>
        <Button variant="ghost_icon">
          <Icon name="notifications" title="Notifications" />
        </Button>
      </AccordionHeader>
      <AccordionPanel>Details</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

describe('Accordion', () => {
  it('Expands items based on prop', () => {
    render(<SimpleAccordion />)
    const button1 = screen.queryByText('Summary 1').parentNode
    const button2 = screen.queryByText('Summary 2').parentNode
    expect(button1).toHaveAttribute('aria-expanded', 'true')
    expect(button2).toHaveAttribute('aria-expanded', 'false')
  })
  it('Expands items on click', () => {
    render(<SimpleAccordion />)
    const button2 = screen.queryByText('Summary 2').parentNode
    fireEvent.click(button2)
    expect(button2).toHaveAttribute('aria-expanded', 'true')
  })
  it('Set header level', () => {
    const { container } = render(<SimpleAccordion headerLevel="h3" />)
    expect(container.querySelectorAll('h3')).toHaveLength(2)
  })
  it('Has chevron on left side as default', () => {
    const { container } = render(<SimpleAccordion />)
    const button = container.querySelector('button')
    const chevron = button.querySelector('svg')
    expect(button.firstChild).toBe(chevron)
  })
  it('Set chevron position to the right', () => {
    const { container } = render(<SimpleAccordion chevronPosition="right" />)
    const button = container.querySelector('button')
    const chevron = button.querySelector('svg')
    expect(button.lastChild).toBe(chevron)
  })
  it('Add custom icons', () => {
    const { container } = render(<AccordionWithIcons />)
    const button = container.querySelector('button')
    expect(button.querySelectorAll('svg')).toHaveLength(3)
  })
  it('Add custom buttons', () => {
    const { container } = render(<AccordionWithButtons />)
    const header = container.querySelector('h1, h2, h3, h4, h5, h6')
    expect(header.querySelectorAll('button')).toHaveLength(3)
  })
})
