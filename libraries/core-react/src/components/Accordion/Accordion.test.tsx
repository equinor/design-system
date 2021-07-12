/* eslint-disable no-undef */
import { MouseEventHandler } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
// eslint-disable-next-line camelcase
import { attach_file, notifications } from '@equinor/eds-icons'
import { Accordion } from '.'
import { Button } from '../Button'
import { Icon } from '../Icon'
import type { AccordionProps } from './Accordion.types'
import React from 'react'

Icon.add({ attach_file, notifications })

afterEach(cleanup)

const SimpleAccordion = ({
  headerLevel = 'h2',
  chevronPosition = 'left',
}: AccordionProps) => (
  <Accordion headerLevel={headerLevel} chevronPosition={chevronPosition}>
    <Accordion.Item isExpanded>
      <Accordion.Header>Summary 1</Accordion.Header>
      <Accordion.Panel>Details 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Summary 2</Accordion.Header>
      <Accordion.Panel>Details 2</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

const AccordionWithIcons = () => (
  <Accordion>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.HeaderTitle>Summary</Accordion.HeaderTitle>
        <Icon name="attach_file" title="Attach file" size={16} />
        <Icon name="notifications" title="Notifications" size={16} />
      </Accordion.Header>
      <Accordion.Panel>Details</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

const AccordionWithButtons = () => (
  <Accordion>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.HeaderTitle>Summary</Accordion.HeaderTitle>
        <Button
          variant="ghost_icon"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            event.stopPropagation()
          }
        >
          <Icon name="attach_file" title="Attach file" />
        </Button>
        <Button
          variant="ghost_icon"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            event.stopPropagation()
          }
        >
          <Icon name="notifications" title="Notifications" />
        </Button>
      </Accordion.Header>
      <Accordion.Panel>Details</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

describe('Accordion', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<SimpleAccordion />)
    expect(asFragment()).toMatchSnapshot()
  })
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
  it('triggers onToggle callback', () => {
    const mockOnToggle = jest.fn()
    render(
      <Accordion.Item isExpanded>
        <Accordion.Header onToggle={mockOnToggle}>Summary 1</Accordion.Header>
      </Accordion.Item>,
    )
    const header = screen.queryByText('Summary 1').parentNode
    fireEvent.click(header)
    expect(mockOnToggle).toHaveBeenCalled()
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
