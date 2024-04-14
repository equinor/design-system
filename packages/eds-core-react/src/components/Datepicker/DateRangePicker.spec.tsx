import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DateRangePicker } from './DateRangePicker'
import { I18nProvider } from 'react-aria'
import { ReactNode } from 'react'

const RangeContainer = ({ children }: { children: ReactNode }) => {
  return <I18nProvider locale={'en-US'}>{children}</I18nProvider>
}

describe('DateRangePicker', () => {
  it('Can render', () => {
    render(
      <RangeContainer>
        <DateRangePicker label={'DateRangePicker'} />
      </RangeContainer>,
    )
    expect(screen.getByText('DateRangePicker')).toBeDefined()
  })

  it('Should pass a11y test', async () => {
    const { container } = render(
      <RangeContainer>
        <DateRangePicker label={'DateRangePicker'} />
      </RangeContainer>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should pass a11y test when disabled', async () => {
    const { container } = render(
      <DateRangePicker label={'DateRangePicker'} disabled={true} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should be disabled', () => {
    render(<DateRangePicker label={'DateRangePicker'} disabled={true} />)
    expect(screen.getAllByText('dd').at(0)).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })
})
