/* eslint-disable react/require-default-props */
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import { attach_file, notifications } from '@equinor/eds-icons'
import { Accordion } from '.'
import { Icon } from '../Icon'
import { Button } from '../Button'
import type { AccordionProps } from './Accordion.types'
import { useState } from 'react'

Icon.add({ attach_file, notifications })

beforeEach(() => {
  jest.spyOn(Math, 'random').mockReturnValue(0.12345)
})

afterEach(() => {
  jest.spyOn(Math, 'random').mockRestore()
})

type TestProps = {
  isExpanded?: boolean
} & AccordionProps

const SimpleAccordion = ({
  isExpanded = true,
  headerLevel = 'h2',
  chevronPosition = 'left',
}: TestProps) => (
  <Accordion headerLevel={headerLevel} chevronPosition={chevronPosition}>
    <Accordion.Item isExpanded={isExpanded}>
      <Accordion.Header data-testid="header1">Summary 1</Accordion.Header>
      <Accordion.Panel>Details 1</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)

const AccordionWithIcons = () => (
  <Accordion>
    <Accordion.Item>
      <Accordion.Header data-testid="header1" isExpanded>
        <Accordion.HeaderTitle>Summary</Accordion.HeaderTitle>
        <Icon name="attach_file" title="Attach file" size={16} />
        <Icon name="notifications" title="Notifications" size={16} />
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
  it('Should pass a11y test', async () => {
    const { container } = render(<SimpleAccordion />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with icons ', async () => {
    const { container } = render(<AccordionWithIcons />)
    expect(await axe(container)).toHaveNoViolations()
  })
  /* failing test */
  /* it('Should pass a11y test with buttons ', async () => {
    const { container } = render(<AccordionWithButtons />)
    expect(await axe(container)).toHaveNoViolations()
  }) */
  it('Expands items based on prop', () => {
    render(<SimpleAccordion isExpanded />)
    const header1 = screen.getByTestId('header1')
    expect(header1).toHaveAttribute('aria-expanded', 'true')
  })
  it('Expands items on click', () => {
    render(<SimpleAccordion isExpanded={false} />)
    const header = screen.getByTestId('header1')
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })
  it('triggers onToggle callback', () => {
    const mockOnToggle = jest.fn()
    render(
      <Accordion>
        <Accordion.Item isExpanded>
          <Accordion.Header onToggle={mockOnToggle} data-testid="header">
            Summary 1
          </Accordion.Header>
        </Accordion.Item>
      </Accordion>,
    )
    const header = screen.getByTestId('header')
    fireEvent.click(header)
    expect(mockOnToggle).toHaveBeenCalled()
  })

  type ControlledProps = {
    onExpandedChange: () => void
  }
  const ControlledAccordion = ({ onExpandedChange }: ControlledProps) => {
    const [expanded, setExpanded] = useState(false)
    const toggleAccordion = (state: boolean) => {
      setExpanded(state)
      onExpandedChange()
    }
    return (
      <>
        <Button data-testid="button" onClick={() => toggleAccordion(!expanded)}>
          testbutton
        </Button>
        <Accordion>
          <Accordion.Item
            isExpanded={expanded}
            onExpandedChange={toggleAccordion}
          >
            <Accordion.Header data-testid="header">Summary 1</Accordion.Header>
          </Accordion.Item>
        </Accordion>
      </>
    )
  }

  it('Can be a controlled component', () => {
    const mockToggled = jest.fn()
    render(<ControlledAccordion onExpandedChange={mockToggled} />)
    const header = screen.getByTestId('header')
    const button = screen.getByTestId('button')
    expect(header).not.toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(button)
    expect(mockToggled).toHaveBeenCalled()
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })
  it('Add custom icons', () => {
    render(<AccordionWithIcons />)
    const header = screen.getByTestId('header1')
    const icon = screen.getAllByTitle('Notifications')
    expect(header).toContainElement(icon[0])
  })
  // it('Add custom buttons', () => {
  //   render(<AccordionWithButtons />)
  //   expect(screen.getAllByRole('button')).toHaveLength(3) // 2 + itself
  // })
  // it('Does not expand when clicking custom buttons', () => {
  //   render(<AccordionWithButtons />)
  //   const header = screen.getByTestId('header1')
  //   const button = screen.getByTestId('button2')
  //   fireEvent.click(button)
  //   expect(header).toHaveAttribute('aria-expanded', 'false')
  // })
})
