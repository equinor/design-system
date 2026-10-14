// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  describe('Rendering', () => {
    it('shows its label', () => {
      render(<Badge pass label="AA" />)

      expect(screen.getByText('AA')).toBeInTheDocument()
    })

    it('uses the success tone for a pass and the danger tone for a fail', () => {
      render(
        <>
          <Badge pass label="Pass" />
          <Badge pass={false} label="Fail" />
        </>,
      )

      expect(screen.getByText('Pass')).toHaveClass(
        'bg-success-muted',
        'text-success-on-muted',
      )
      expect(screen.getByText('Fail')).toHaveClass(
        'bg-danger-muted',
        'text-danger-on-muted',
      )
    })

    it('uses the info tone for a reached level', () => {
      render(<Badge pass label="AA18" variant="level" />)

      expect(screen.getByText('AA18')).toHaveClass(
        'bg-info-muted',
        'text-info-on-muted',
      )
      expect(screen.getByText('AA18')).not.toHaveClass('bg-success-muted')
    })

    it('uses the danger tone for a level that is not reached', () => {
      render(<Badge pass={false} label="DECO" variant="level" />)

      expect(screen.getByText('DECO')).toHaveClass('bg-danger-muted')
    })
  })
})
