// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginFormPreview } from './LoginFormPreview'
import { resolveSemanticColors, toneRamps } from '@/utils/semanticTokens'

const COLORS = resolveSemanticColors(toneRamps('light'), 'light')

describe('LoginFormPreview', () => {
  describe('Rendering', () => {
    it('renders labelled email and password fields and a sign-in button', () => {
      render(<LoginFormPreview colors={COLORS} />)

      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password',
      )
      expect(
        screen.getByRole('button', { name: 'Sign in' }),
      ).toBeInTheDocument()
    })

    it('paints the form with the surface and text tokens', () => {
      render(<LoginFormPreview colors={COLORS} />)

      expect(
        screen.getByText('Enter your credentials to continue'),
      ).toHaveStyle({ color: COLORS['text.secondary'] })
      expect(screen.getByText('Forgot password?')).toHaveStyle({
        color: COLORS['text.interactive.link.default'],
      })
    })
  })
})
