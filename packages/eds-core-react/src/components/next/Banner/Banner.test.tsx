import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Banner } from '.'

describe('Banner (next)', () => {
  describe('Rendering', () => {
    it('renders with message', () => {
      render(
        <Banner>
          <Banner.Message>Hello</Banner.Message>
        </Banner>,
      )
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })

    it('renders with icon and message', () => {
      render(
        <Banner>
          <Banner.Icon>
            <svg data-testid="test-icon" />
          </Banner.Icon>
          <Banner.Message>With icon</Banner.Message>
        </Banner>,
      )
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByText('With icon')).toBeInTheDocument()
    })

    it('renders with actions', () => {
      render(
        <Banner>
          <Banner.Message>With actions</Banner.Message>
          <Banner.Actions>
            <button>Ok</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument()
    })

    it('renders with all sub-components', () => {
      render(
        <Banner>
          <Banner.Icon>
            <svg data-testid="test-icon" />
          </Banner.Icon>
          <Banner.Message>Full banner</Banner.Message>
          <Banner.Actions>
            <button>Action</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByText('Full banner')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Tones', () => {
    it('defaults to info tone', () => {
      render(
        <Banner>
          <Banner.Message>Info</Banner.Message>
        </Banner>,
      )
      expect(screen.getByRole('status')).toHaveAttribute(
        'data-color-appearance',
        'info',
      )
    })

    it('supports warning tone', () => {
      render(
        <Banner tone="warning">
          <Banner.Message>Warning</Banner.Message>
        </Banner>,
      )
      expect(screen.getByRole('status')).toHaveAttribute(
        'data-color-appearance',
        'warning',
      )
    })

    it('supports danger tone', () => {
      render(
        <Banner tone="danger">
          <Banner.Message>Danger</Banner.Message>
        </Banner>,
      )
      expect(screen.getByRole('status')).toHaveAttribute(
        'data-color-appearance',
        'danger',
      )
    })

    it('supports success tone', () => {
      render(
        <Banner tone="success">
          <Banner.Message>Success</Banner.Message>
        </Banner>,
      )
      expect(screen.getByRole('status')).toHaveAttribute(
        'data-color-appearance',
        'success',
      )
    })
  })

  describe('Actions placement', () => {
    it('defaults to left placement', () => {
      render(
        <Banner>
          <Banner.Message>Test</Banner.Message>
          <Banner.Actions data-testid="actions">
            <button>Ok</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(screen.getByTestId('actions')).toHaveAttribute(
        'data-placement',
        'left',
      )
    })

    it('supports bottom placement', () => {
      render(
        <Banner>
          <Banner.Message>Test</Banner.Message>
          <Banner.Actions placement="bottom" data-testid="actions">
            <button>Ok</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(screen.getByTestId('actions')).toHaveAttribute(
        'data-placement',
        'bottom',
      )
    })
  })

  describe('Accessibility', () => {
    it('has role="status" by default', () => {
      render(
        <Banner>
          <Banner.Message>Status</Banner.Message>
        </Banner>,
      )
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('allows role to be overridden to alert', () => {
      render(
        <Banner role="alert">
          <Banner.Message>Alert</Banner.Message>
        </Banner>,
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('passes axe accessibility test', async () => {
      const { container } = render(
        <Banner>
          <Banner.Message>Accessible banner</Banner.Message>
        </Banner>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe with all sub-components', async () => {
      const { container } = render(
        <Banner tone="warning">
          <Banner.Icon>
            <svg aria-hidden="true" />
          </Banner.Icon>
          <Banner.Message>Full accessible banner</Banner.Message>
          <Banner.Actions>
            <button>Ok</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Dismiss', () => {
    it('renders dismiss button when onDismiss is provided', () => {
      render(
        <Banner onDismiss={() => {}}>
          <Banner.Message>Dismissible</Banner.Message>
        </Banner>,
      )
      expect(
        screen.getByRole('button', { name: 'Dismiss' }),
      ).toBeInTheDocument()
    })

    it('does not render dismiss button without onDismiss', () => {
      render(
        <Banner>
          <Banner.Message>Not dismissible</Banner.Message>
        </Banner>,
      )
      expect(
        screen.queryByRole('button', { name: 'Dismiss' }),
      ).not.toBeInTheDocument()
    })

    it('calls onDismiss when dismiss button is clicked', async () => {
      const handleDismiss = jest.fn()
      render(
        <Banner onDismiss={handleDismiss}>
          <Banner.Message>Click dismiss</Banner.Message>
        </Banner>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('passes axe with dismiss button', async () => {
      const { container } = render(
        <Banner onDismiss={() => {}}>
          <Banner.Message>Accessible dismiss</Banner.Message>
        </Banner>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Props', () => {
    it('forwards ref to root element', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Banner ref={ref}>
          <Banner.Message>Ref test</Banner.Message>
        </Banner>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('forwards ref to Banner.Icon', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Banner>
          <Banner.Icon ref={ref}>
            <svg />
          </Banner.Icon>
          <Banner.Message>Test</Banner.Message>
        </Banner>,
      )
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('forwards ref to Banner.Message', () => {
      const ref = createRef<HTMLParagraphElement>()
      render(
        <Banner>
          <Banner.Message ref={ref}>Test</Banner.Message>
        </Banner>,
      )
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })

    it('forwards ref to Banner.Actions', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Banner>
          <Banner.Message>Test</Banner.Message>
          <Banner.Actions ref={ref}>
            <button>Ok</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('merges className on root', () => {
      render(
        <Banner className="custom">
          <Banner.Message>Test</Banner.Message>
        </Banner>,
      )
      const banner = screen.getByRole('status')
      expect(banner).toHaveClass('eds-banner', 'custom')
    })

    it('merges className on Banner.Icon', () => {
      render(
        <Banner>
          <Banner.Icon className="custom-icon" data-testid="icon">
            <svg />
          </Banner.Icon>
          <Banner.Message>Test</Banner.Message>
        </Banner>,
      )
      expect(screen.getByTestId('icon')).toHaveClass(
        'eds-banner__icon',
        'custom-icon',
      )
    })

    it('merges className on Banner.Message', () => {
      render(
        <Banner>
          <Banner.Message className="custom-msg" data-testid="msg">
            Test
          </Banner.Message>
        </Banner>,
      )
      expect(screen.getByTestId('msg')).toHaveClass(
        'eds-banner__message',
        'custom-msg',
      )
    })

    it('merges className on Banner.Actions', () => {
      render(
        <Banner>
          <Banner.Message>Test</Banner.Message>
          <Banner.Actions className="custom-actions" data-testid="actions">
            <button>Ok</button>
          </Banner.Actions>
        </Banner>,
      )
      expect(screen.getByTestId('actions')).toHaveClass(
        'eds-banner__actions',
        'custom-actions',
      )
    })

    it('spreads additional props', () => {
      render(
        <Banner data-testid="my-banner">
          <Banner.Message>Test</Banner.Message>
        </Banner>,
      )
      expect(screen.getByTestId('my-banner')).toBeInTheDocument()
    })
  })
})
