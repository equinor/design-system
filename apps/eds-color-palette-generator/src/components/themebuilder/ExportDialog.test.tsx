// @vitest-environment jsdom
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExportDialog } from './ExportDialog'
import { tokensStudioInputs } from '@/test/fixtures'
import { TS_HUES, hueKey } from '@/config/tokensStudio'
import { downloadText } from '@/utils/dataviz-export'
import { toOklchString } from '@/utils/color'
import {
  anchorProposals,
  palettesFile,
  palettesFromConfig,
  tokensStudioAnchorsFile,
} from '@/utils/paletteConfigFile'
import type { PaletteInput } from '@/utils/urlState'

vi.mock('@/utils/dataviz-export', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/dataviz-export')>()),
  downloadText: vi.fn(),
}))

// A colour no Tokens Studio anchor is expected to have; the test below
// checks that it differs from the first anchor.
const OTHER_COLOUR = 'oklch(0.5 0.1 30)'

function renderDialog(palettes: PaletteInput[] = tokensStudioInputs()) {
  const onClose = vi.fn()
  const onImport = vi.fn()
  render(
    <ExportDialog
      open
      onClose={onClose}
      palettes={palettes}
      onImport={onImport}
    />,
  )
  return { onClose, onImport, palettes }
}

const downloadButton = () => screen.getByRole('button', { name: 'Download' })

const fileInput = () => {
  // The file input has no role or label; the visible button clicks it.
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input) throw new Error('No file input')
  return input
}

const jsonFile = (content: string, name = 'palettes.json') =>
  new File([content], name, { type: 'application/json' })

/** The default palettes with the first one changed. */
function withFirst(change: Partial<PaletteInput>): PaletteInput[] {
  const [first, ...rest] = tokensStudioInputs()
  return [{ ...first, ...change }, ...rest]
}

describe('ExportDialog', () => {
  beforeEach(() => {
    vi.mocked(downloadText).mockClear()
  })

  describe('Rendering', () => {
    it('opens as a modal dialog named Download', () => {
      renderDialog()

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1)
      expect(
        screen.getByRole('dialog', { name: 'Download' }),
      ).toBeInTheDocument()
    })

    it('does not open the dialog while open is false', () => {
      render(
        <ExportDialog
          open={false}
          onClose={vi.fn()}
          palettes={tokensStudioInputs()}
          onImport={vi.fn()}
        />,
      )

      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('shows every default palette as the same as Tokens Studio', () => {
      renderDialog()

      expect(screen.getAllByText('Same as Tokens Studio')).toHaveLength(
        TS_HUES.length,
      )
      for (const hue of TS_HUES) {
        expect(screen.getByText(hue.name)).toBeInTheDocument()
      }
      expect(
        screen.getByText(/No anchor differs from Tokens Studio/),
      ).toBeInTheDocument()
    })

    it('starts on Tokens Studio anchors with Download disabled when nothing differs', () => {
      renderDialog()

      expect(
        screen.getByRole('radio', { name: /Tokens Studio anchors/ }),
      ).toBeChecked()
      expect(downloadButton()).toBeDisabled()
    })

    it('shows a changed anchor with the old and new value', () => {
      const first = TS_HUES[0]
      expect(toOklchString(OTHER_COLOUR)).not.toBe(toOklchString(first.anchor))
      renderDialog(withFirst({ baseColor: OTHER_COLOUR }))

      expect(screen.getByText('Changed')).toBeInTheDocument()
      expect(
        screen.getByText(
          `${toOklchString(first.anchor, ', ')} → ${toOklchString(OTHER_COLOUR, ', ')}`,
        ),
      ).toBeInTheDocument()
      expect(screen.getAllByText('Same as Tokens Studio')).toHaveLength(
        TS_HUES.length - 1,
      )
      expect(
        screen.queryByText(/No anchor differs from Tokens Studio/),
      ).not.toBeInTheDocument()
      expect(downloadButton()).toBeEnabled()
    })

    it('shows a renamed palette as a new hue with its anchor key', () => {
      const first = TS_HUES[0]
      renderDialog(withFirst({ name: 'Sunset Orange' }))

      expect(screen.getByText('New hue')).toBeInTheDocument()
      expect(
        screen.getByText(
          `input.palette.${hueKey('Sunset Orange')}.anchor = ${toOklchString(first.anchor, ', ')}`,
        ),
      ).toBeInTheDocument()
      expect(downloadButton()).toBeEnabled()
    })

    it('leaves out a palette with several anchors', () => {
      renderDialog(
        withFirst({
          baseColor: '',
          anchors: [
            { step: 4, value: TS_HUES[0].anchor },
            { step: 12, value: OTHER_COLOUR },
          ],
        }),
      )

      expect(screen.getByText('Several anchors')).toBeInTheDocument()
      expect(
        screen.getByText(
          /takes one anchor per hue, so this palette is left out/,
        ),
      ).toBeInTheDocument()
      expect(downloadButton()).toBeDisabled()
    })

    it('counts a palette with a single changed anchor as changed', () => {
      renderDialog(
        withFirst({
          baseColor: '',
          anchors: [{ step: 9, value: OTHER_COLOUR }],
        }),
      )

      expect(screen.getByText('Changed')).toBeInTheDocument()
      expect(downloadButton()).toBeEnabled()
    })
  })

  describe('Behaviour', () => {
    it('enables Download for the palettes file and hides the comparison', async () => {
      const user = userEvent.setup()
      renderDialog()

      await user.click(screen.getByRole('radio', { name: /Palettes file/ }))

      expect(downloadButton()).toBeEnabled()
      expect(
        screen.queryByText('Compared with Tokens Studio'),
      ).not.toBeInTheDocument()
    })

    it('downloads the changed anchors in the Tokens Studio format and closes', async () => {
      const user = userEvent.setup()
      const { onClose, palettes } = renderDialog(
        withFirst({ baseColor: OTHER_COLOUR }),
      )

      await user.click(downloadButton())

      const expected = tokensStudioAnchorsFile(anchorProposals(palettes))
      expect(Object.keys(expected.input.palette)).toEqual([TS_HUES[0].key])
      expect(downloadText).toHaveBeenCalledWith(
        'tokens-studio-anchors.json',
        JSON.stringify(expected, null, 2),
        'application/json',
      )
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('downloads the palettes file', async () => {
      const user = userEvent.setup()
      const { onClose, palettes } = renderDialog()

      await user.click(screen.getByRole('radio', { name: /Palettes file/ }))
      await user.click(downloadButton())

      expect(downloadText).toHaveBeenCalledWith(
        'palettes.json',
        JSON.stringify(palettesFile(palettes), null, 2),
        'application/json',
      )
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('imports an uploaded palettes file and closes', async () => {
      const user = userEvent.setup()
      const { onImport, onClose } = renderDialog()
      const uploaded = palettesFile(withFirst({ name: 'Sunset Orange' }))
      const content = JSON.stringify(uploaded)

      await user.upload(fileInput(), jsonFile(content))

      await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1))
      expect(onImport).toHaveBeenCalledWith(palettesFromConfig(uploaded))
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('reports a file that is not valid JSON', async () => {
      const user = userEvent.setup()
      const { onImport, onClose } = renderDialog()

      await user.upload(fileInput(), jsonFile('{ not json', 'broken.json'))

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'The file is not valid JSON.',
      )
      expect(onImport).not.toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    })

    it('reports a file without palettes', async () => {
      const user = userEvent.setup()
      const { onImport } = renderDialog()

      await user.upload(fileInput(), jsonFile(JSON.stringify({ colors: [] })))

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'This file has no palettes. Choose a palettes file downloaded from this tool.',
      )
      expect(onImport).not.toHaveBeenCalled()
    })

    it('clears the import message and calls onClose on Cancel', async () => {
      const user = userEvent.setup()
      const { onClose } = renderDialog()
      await user.upload(fileInput(), jsonFile('{ not json', 'broken.json'))
      await screen.findByRole('alert')

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(onClose).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('calls onClose from the close button', async () => {
      const user = userEvent.setup()
      const { onClose } = renderDialog()

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('groups the export choices under the Export legend', () => {
      renderDialog()

      const group = screen.getByRole('group', { name: 'Export' })
      expect(within(group).getAllByRole('radio')).toHaveLength(2)
    })

    it('offers the upload as a named button', () => {
      renderDialog()

      expect(
        screen.getByRole('button', { name: 'Upload palettes file' }),
      ).toBeInTheDocument()
    })
  })
})
