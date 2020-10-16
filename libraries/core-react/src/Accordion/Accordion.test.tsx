/* eslint-disable no-undef */
// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
// eslint-disable-next-line camelcase
import { attach_file, notifications } from '@equinor/eds-icons'
import { Accordion } from '.'
import { Icon, Button } from '..'

const {
  AccordionItem,
  AccordionHeader,
  AccordionHeaderTitle,
  AccordionPanel,
} = Accordion

Icon.add({ attach_file, notifications })

afterEach(cleanup)

const SimpleAccordion = ({ headerLevel, chevronPosition }) => (
  <Accordion headerLevel={headerLevel} chevronPosition={chevronPosition}>
    <AccordionItem isExpanded>
      <AccordionHeader>Summary 1</AccordionHeader>
      <AccordionPanel>Details 1</AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Summary 2</AccordionHeader>
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
        <AccordionHeaderTitle>Summary</AccordionHeaderTitle>
        <Icon name="attach_file" title="Attach file" size={16} />
        <Icon name="notifications" title="Notifications" size={16} />
      </AccordionHeader>
      <AccordionPanel>Details</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

const AccordionWithButtons = () => (
  <Accordion>
    <AccordionItem>
      <AccordionHeader>
        <AccordionHeaderTitle>Summary</AccordionHeaderTitle>
        <Button variant="ghost_icon" onClick={(e) => e.stopPropagation()}>
          <Icon name="attach_file" title="Attach file" />
        </Button>
        <Button variant="ghost_icon" onClick={(e) => e.stopPropagation()}>
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
    const header1 = screen.queryByText('Summary 1').parentNode
    const header2 = screen.queryByText('Summary 2').parentNode
    expect(header1).toHaveAttribute('aria-expanded', 'true')
    expect(header2).toHaveAttribute('aria-expanded', 'false')
  })
  it('Expands items on click', () => {
    render(<SimpleAccordion />)
    const header = screen.queryByText('Summary 2').parentNode
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })
  it('Set header level', () => {
    render(<SimpleAccordion headerLevel="h3" />)
    expect(document.querySelectorAll('h3')).toHaveLength(2)
  })
  it('Has chevron on left side as default', () => {
    render(<SimpleAccordion />)
    const header = screen.queryByText('Summary 1').parentNode
    const chevron = header.querySelector('svg')
    expect(header.firstChild).toBe(chevron)
  })
  it('Set chevron position to the right', () => {
    render(<SimpleAccordion chevronPosition="right" />)
    const header = screen.queryByText('Summary 1').parentNode
    const chevron = header.querySelector('svg')
    expect(header.lastChild).toBe(chevron)
  })
  it('Add custom icons', () => {
    render(<AccordionWithIcons />)
    const header = screen.queryByText('Summary').parentNode
    expect(header.querySelectorAll('svg')).toHaveLength(3)
  })
  it('Add custom buttons', () => {
    render(<AccordionWithButtons />)
    const header = screen.queryByText('Summary').parentNode
    expect(header.querySelectorAll('button')).toHaveLength(2)
  })
  it('Does not expand when clicking custom buttons', () => {
    render(<AccordionWithButtons />)
    const header = screen.queryByText('Summary').parentNode
    const button = screen.getAllByTitle('Notifications')[0].parentNode
    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })
})
