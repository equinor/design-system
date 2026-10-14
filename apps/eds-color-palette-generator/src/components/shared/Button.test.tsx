// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, buttonClassName } from './Button'

const classes = (element: HTMLElement) => element.className.split(' ')

describe('Button', () => {
  describe('Rendering', () => {
    it('renders a button named by its text', () => {
      render(<Button>Export</Button>)

      expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
    })

    it('is type="button" by default so it does not submit a form', () => {
      render(<Button>Export</Button>)

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('keeps an explicit type', () => {
      render(<Button type="submit">Save</Button>)

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('is a medium secondary button by default', () => {
      render(<Button>Export</Button>)

      expect(screen.getByRole('button').className).toBe(
        buttonClassName({ variant: 'secondary', size: 'md' }),
      )
    })

    it('applies the variant, size and icon-only classes', () => {
      render(
        <>
          <Button variant="primary">Primary</Button>
          <Button variant="ghost" size="sm">
            Ghost
          </Button>
          <Button iconOnly aria-label="Add" size="sm">
            +
          </Button>
        </>,
      )

      expect(screen.getByRole('button', { name: 'Primary' }).className).toBe(
        buttonClassName({ variant: 'primary' }),
      )
      expect(screen.getByRole('button', { name: 'Ghost' }).className).toBe(
        buttonClassName({ variant: 'ghost', size: 'sm' }),
      )
      expect(screen.getByRole('button', { name: 'Add' }).className).toBe(
        buttonClassName({ size: 'sm', iconOnly: true }),
      )
    })

    it('adds its className after the button classes', () => {
      render(<Button className="w-full">Export</Button>)

      expect(classes(screen.getByRole('button')).at(-1)).toBe('w-full')
    })

    it('passes other props through to the button', () => {
      render(
        <Button title="Export the palettes" data-testid="export">
          Export
        </Button>,
      )

      expect(screen.getByRole('button')).toHaveAttribute(
        'title',
        'Export the palettes',
      )
      expect(screen.getByTestId('export')).toBe(screen.getByRole('button'))
    })
  })

  describe('Behaviour', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Export</Button>)

      await user.click(screen.getByRole('button'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button disabled onClick={onClick}>
          Export
        </Button>,
      )

      await user.click(screen.getByRole('button'))

      expect(screen.getByRole('button')).toBeDisabled()
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('names an icon-only button by its aria-label', () => {
      render(
        <Button iconOnly aria-label="Close">
          <svg aria-hidden />
        </Button>,
      )

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    it('lets aria-label override the text of a text button', () => {
      render(<Button aria-label="Export palettes">Export</Button>)

      expect(
        screen.getByRole('button', { name: 'Export palettes' }),
      ).toBeInTheDocument()
    })
  })
})

describe('buttonClassName', () => {
  it('defaults to a medium secondary button', () => {
    expect(buttonClassName()).toBe(
      buttonClassName({ variant: 'secondary', size: 'md', iconOnly: false }),
    )
    expect(buttonClassName()).toContain('border-accent-emphasis')
    expect(buttonClassName()).toContain('min-h-9')
  })

  it('gives primary a fill, secondary an outline and ghost neither', () => {
    expect(buttonClassName({ variant: 'primary' })).toContain(
      'border-transparent bg-accent-emphasis',
    )
    expect(buttonClassName({ variant: 'secondary' })).toContain(
      'border-accent-emphasis bg-transparent',
    )
    expect(buttonClassName({ variant: 'ghost' })).toContain(
      'border-transparent bg-transparent',
    )
  })

  it('makes an icon-only button square, without the text padding', () => {
    expect(buttonClassName({ size: 'sm', iconOnly: true })).toContain('size-7')
    expect(buttonClassName({ size: 'md', iconOnly: true })).toContain('size-9')
    expect(buttonClassName({ iconOnly: true })).not.toContain('px-4')
  })

  it('leaves no empty or undefined entries in the class list', () => {
    const list = buttonClassName().split(' ')

    expect(list).not.toContain('')
    expect(list).not.toContain('undefined')
  })

  it('adds a className last', () => {
    expect(buttonClassName({ className: 'ml-auto' }).endsWith(' ml-auto')).toBe(
      true,
    )
  })
})
