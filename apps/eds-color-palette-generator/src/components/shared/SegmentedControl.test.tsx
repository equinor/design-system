// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { grid_on } from '@equinor/eds-icons'
import {
  SegmentedControl,
  TabPanel,
  segmentPanelId,
  segmentTabId,
} from './SegmentedControl'
import type { SegmentedControlProps, SegmentedOption } from './SegmentedControl'

type View = 'system' | 'examples' | 'contrast'

const VIEWS: SegmentedOption<View>[] = [
  { value: 'system', label: 'Colour system' },
  { value: 'examples', label: 'Examples' },
  { value: 'contrast', label: 'Contrast' },
]

/** A controlled control that keeps its own selection, as the pages do. */
function Controlled({
  initial = 'system',
  onChange,
  withPanel = false,
  ...props
}: Omit<SegmentedControlProps<View>, 'value' | 'onChange' | 'options'> & {
  initial?: View | null
  onChange?: (value: View) => void
  withPanel?: boolean
}) {
  const [value, setValue] = useState<View | null>(initial)
  return (
    <>
      <SegmentedControl
        {...props}
        options={VIEWS}
        value={value}
        onChange={(next) => {
          setValue(next)
          onChange?.(next)
        }}
      />
      {withPanel && props.idPrefix && value && (
        <TabPanel idPrefix={props.idPrefix} value={value}>
          Panel for {value}
        </TabPanel>
      )}
    </>
  )
}

describe('segmentTabId and segmentPanelId', () => {
  it('build the tab and panel ids from the prefix and value', () => {
    expect(segmentTabId('builder', 'contrast')).toBe('builder-tab-contrast')
    expect(segmentPanelId('builder', 'contrast')).toBe('builder-panel-contrast')
  })
})

describe('SegmentedControl in tabs mode', () => {
  describe('Rendering', () => {
    it('renders a tablist named by its aria-label with one tab per option', () => {
      render(<Controlled mode="tabs" aria-label="View" idPrefix="builder" />)

      const tablist = screen.getByRole('tablist', { name: 'View' })
      const tabs = within(tablist).getAllByRole('tab')
      expect(tabs.map((tab) => tab.textContent)).toEqual([
        'Colour system',
        'Examples',
        'Contrast',
      ])
    })

    it('gives each tab the id from segmentTabId', () => {
      render(<Controlled mode="tabs" aria-label="View" idPrefix="builder" />)

      expect(screen.getByRole('tab', { name: 'Examples' })).toHaveAttribute(
        'id',
        segmentTabId('builder', 'examples'),
      )
    })

    it('leaves out the ids and aria-controls without an idPrefix', () => {
      render(<Controlled mode="tabs" aria-label="View" />)

      const tab = screen.getByRole('tab', { name: 'Colour system' })
      expect(tab).toHaveAttribute('aria-selected', 'true')
      expect(tab).not.toHaveAttribute('id')
      expect(tab).not.toHaveAttribute('aria-controls')
    })
  })

  describe('Accessibility', () => {
    it('marks only the selected tab with aria-selected', () => {
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial="examples"
        />,
      )

      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Examples',
      )
      expect(screen.getAllByRole('tab', { selected: false })).toHaveLength(2)
    })

    it('points only the selected tab at its panel with aria-controls', () => {
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial="examples"
        />,
      )

      expect(screen.getByRole('tab', { name: 'Examples' })).toHaveAttribute(
        'aria-controls',
        segmentPanelId('builder', 'examples'),
      )
      expect(
        screen.getByRole('tab', { name: 'Colour system' }),
      ).not.toHaveAttribute('aria-controls')
    })

    it('labels the panel with its tab', () => {
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial="contrast"
          withPanel
        />,
      )

      const panel = screen.getByRole('tabpanel', { name: 'Contrast' })
      expect(panel).toHaveTextContent('Panel for contrast')
      expect(panel).toHaveAttribute('id', segmentPanelId('builder', 'contrast'))
      expect(screen.getByRole('tab', { name: 'Contrast' })).toHaveAttribute(
        'aria-controls',
        panel.id,
      )
    })

    it('gives only the selected tab a place in the Tab order', () => {
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial="examples"
        />,
      )

      expect(screen.getByRole('tab', { name: 'Examples' })).toHaveAttribute(
        'tabindex',
        '0',
      )
      expect(
        screen.getByRole('tab', { name: 'Colour system' }),
      ).toHaveAttribute('tabindex', '-1')
      expect(screen.getByRole('tab', { name: 'Contrast' })).toHaveAttribute(
        'tabindex',
        '-1',
      )
    })

    it('puts the first tab in the Tab order when nothing is selected', () => {
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial={null}
        />,
      )

      expect(screen.queryByRole('tab', { selected: true })).toBeNull()
      expect(
        screen.getByRole('tab', { name: 'Colour system' }),
      ).toHaveAttribute('tabindex', '0')
    })

    it('reaches the selected tab with Tab', async () => {
      const user = userEvent.setup()
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial="contrast"
        />,
      )

      await user.tab()

      expect(screen.getByRole('tab', { name: 'Contrast' })).toHaveFocus()
    })
  })

  describe('Behaviour', () => {
    it('calls onChange with the value of a clicked tab', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <SegmentedControl
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          options={VIEWS}
          value="system"
          onChange={onChange}
        />,
      )

      await user.click(screen.getByRole('tab', { name: 'Contrast' }))

      expect(onChange).toHaveBeenCalledExactlyOnceWith('contrast')
    })

    it('moves selection and focus with ArrowRight and ArrowLeft, wrapping round', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          onChange={onChange}
        />,
      )
      await user.tab()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('tab', { name: 'Examples' })).toHaveFocus()
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Examples',
      )

      await user.keyboard('{ArrowRight}{ArrowRight}')
      expect(screen.getByRole('tab', { name: 'Colour system' })).toHaveFocus()

      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('tab', { name: 'Contrast' })).toHaveFocus()
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Contrast',
      )

      expect(onChange.mock.calls.map(([value]) => value)).toEqual([
        'examples',
        'contrast',
        'system',
        'contrast',
      ])
    })

    it('moves to the first tab with Home and the last with End', async () => {
      const user = userEvent.setup()
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          initial="examples"
        />,
      )
      await user.tab()

      await user.keyboard('{End}')
      expect(screen.getByRole('tab', { name: 'Contrast' })).toHaveFocus()
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Contrast',
      )

      await user.keyboard('{Home}')
      expect(screen.getByRole('tab', { name: 'Colour system' })).toHaveFocus()
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Colour system',
      )
    })

    it('ignores ArrowUp and ArrowDown, as a horizontal tablist should', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <Controlled
          mode="tabs"
          aria-label="View"
          idPrefix="builder"
          onChange={onChange}
        />,
      )
      await user.tab()

      await user.keyboard('{ArrowDown}{ArrowUp}')

      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByRole('tab', { name: 'Colour system' })).toHaveFocus()
    })
  })
})

describe('SegmentedControl in radio mode', () => {
  describe('Accessibility', () => {
    it('renders a radiogroup named by its aria-label with one radio per option', () => {
      render(<Controlled mode="radio" aria-label="View" />)

      const group = screen.getByRole('radiogroup', { name: 'View' })
      expect(within(group).getAllByRole('radio')).toHaveLength(3)
      expect(screen.queryByRole('tab')).toBeNull()
    })

    it('marks only the selected option with aria-checked', () => {
      render(<Controlled mode="radio" aria-label="View" initial="contrast" />)

      expect(screen.getByRole('radio', { name: 'Contrast' })).toBeChecked()
      expect(
        screen.getByRole('radio', { name: 'Colour system' }),
      ).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Examples' })).not.toBeChecked()
    })

    it('does not set tab attributes on the radios', () => {
      render(<Controlled mode="radio" aria-label="View" idPrefix="view" />)

      const radio = screen.getByRole('radio', { name: 'Colour system' })
      expect(radio).not.toHaveAttribute('aria-selected')
      expect(radio).not.toHaveAttribute('aria-controls')
      expect(radio).not.toHaveAttribute('id')
    })

    it('names an icon-only option by its aria-label and hides the icon', () => {
      render(
        <SegmentedControl
          mode="radio"
          aria-label="Layout"
          options={[
            { value: 'grid', icon: grid_on, 'aria-label': 'Grid' },
            { value: 'list', label: 'List' },
          ]}
          value="grid"
          onChange={() => {}}
        />,
      )

      const grid = screen.getByRole('radio', { name: 'Grid' })
      expect(grid.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    })

    it('uses the option aria-label in place of its visible label', () => {
      render(
        <SegmentedControl
          mode="radio"
          aria-label="Theme"
          options={[
            { value: 'light', label: 'Light', 'aria-label': 'Light theme' },
            { value: 'dark', label: 'Dark', 'aria-label': 'Dark theme' },
          ]}
          value="light"
          onChange={() => {}}
        />,
      )

      expect(screen.getByRole('radio', { name: 'Light theme' })).toBeChecked()
      expect(
        screen.getByRole('radio', { name: 'Dark theme' }),
      ).toHaveTextContent('Dark')
    })
  })

  describe('Behaviour', () => {
    it('calls onChange with the value of a clicked option', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Controlled mode="radio" aria-label="View" onChange={onChange} />)

      await user.click(screen.getByRole('radio', { name: 'Examples' }))

      expect(onChange).toHaveBeenCalledExactlyOnceWith('examples')
      expect(screen.getByRole('radio', { name: 'Examples' })).toBeChecked()
    })

    it('moves the choice with all four arrow keys', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Controlled mode="radio" aria-label="View" onChange={onChange} />)
      await user.tab()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('radio', { name: 'Examples' })).toHaveFocus()
      expect(screen.getByRole('radio', { name: 'Examples' })).toBeChecked()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('radio', { name: 'Contrast' })).toBeChecked()

      await user.keyboard('{ArrowUp}')
      expect(screen.getByRole('radio', { name: 'Examples' })).toBeChecked()

      await user.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(screen.getByRole('radio', { name: 'Contrast' })).toHaveFocus()
      expect(screen.getByRole('radio', { name: 'Contrast' })).toBeChecked()

      expect(onChange.mock.calls.map(([value]) => value)).toEqual([
        'examples',
        'contrast',
        'examples',
        'system',
        'contrast',
      ])
    })

    it('ignores other keys', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Controlled mode="radio" aria-label="View" onChange={onChange} />)
      await user.tab()

      await user.keyboard('a{PageDown}')

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Disabled', () => {
    it('disables every option and ignores clicks and arrow keys', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <Controlled
          mode="radio"
          aria-label="View"
          onChange={onChange}
          disabled
        />,
      )

      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toBeDisabled()
      }
      await user.click(screen.getByRole('radio', { name: 'Examples' }))
      fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
