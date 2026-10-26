// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { STEP_COUNT, TS_HUES } from '@/config/tokensStudio'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import {
  APCA_FONT_ROWS,
  calcContrast,
  clearSimulationPalettes,
  editablePalettesFromTokensStudio,
  examplePalettes,
  getApcaFontBreakdown,
  getSimulationPalettes,
  setSimulationPalettes,
  type TokenPalette,
} from './palette'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('editablePalettesFromTokensStudio', () => {
  it('returns the seven Tokens Studio hues with 15 steps each', () => {
    const palettes = editablePalettesFromTokensStudio()
    expect(palettes).toHaveLength(TS_HUES.length)
    expect(palettes.map((palette) => palette.name)).toEqual(
      TS_HUES.map((hue) => hue.name),
    )
    for (const palette of palettes) {
      expect(palette.steps).toHaveLength(STEP_COUNT)
    }
  })

  it('starts from the light Tokens Studio ramps', () => {
    expect(editablePalettesFromTokensStudio()).toEqual(
      tokensStudioPalettes('light'),
    )
  })

  it('returns copies, so editing a step leaves the Tokens Studio ramps alone', () => {
    const before = tokensStudioPalettes('light').map((palette) => [
      ...palette.steps,
    ])
    const palettes = editablePalettesFromTokensStudio()
    palettes[0].steps[0] = '#000000'
    palettes[0].name = 'Edited'
    palettes[1].steps.push('#ffffff')

    const after = tokensStudioPalettes('light')
    expect(after.map((palette) => palette.steps)).toEqual(before)
    expect(after[0].name).toBe(TS_HUES[0].name)
    palettes.forEach((palette, i) => {
      expect(palette).not.toBe(after[i])
      expect(palette.steps).not.toBe(after[i].steps)
    })
  })

  it('returns a new list on each call', () => {
    const first = editablePalettesFromTokensStudio()
    first[0].steps[0] = '#000000'
    const second = editablePalettesFromTokensStudio()
    expect(second).not.toBe(first)
    expect(second[0].steps[0]).not.toBe('#000000')
  })
})

describe('APCA_FONT_ROWS', () => {
  it('lists font sizes from small to large', () => {
    const sizes = APCA_FONT_ROWS.map((row) => row.size)
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b))
  })

  it('lists weights from light to heavy, needing less contrast as they get heavier', () => {
    for (const row of APCA_FONT_ROWS) {
      row.weights.slice(1).forEach((weight, i) => {
        expect(weight.weight).toBeGreaterThan(row.weights[i].weight)
        expect(weight.minLc).toBeLessThanOrEqual(row.weights[i].minLc)
      })
    }
  })

  it('needs less contrast for larger text at the same weight', () => {
    APCA_FONT_ROWS.slice(1).forEach((row, i) => {
      const smaller = APCA_FONT_ROWS[i]
      for (const weight of row.weights) {
        const same = smaller.weights.find((w) => w.weight === weight.weight)
        expect(same).toBeDefined()
        expect(weight.minLc).toBeLessThanOrEqual(same?.minLc ?? Infinity)
      }
    })
  })
})

describe('getApcaFontBreakdown', () => {
  const bySize = (lc: number) =>
    Object.fromEntries(
      getApcaFontBreakdown(lc).map((row) => [row.size, row.minWeight]),
    )

  it('returns one entry per font size, in table order', () => {
    expect(getApcaFontBreakdown(60).map((row) => row.size)).toEqual(
      APCA_FONT_ROWS.map((row) => row.size),
    )
  })

  it('finds no passing weight when there is no contrast', () => {
    for (const row of getApcaFontBreakdown(0)) {
      expect(row.minWeight).toBeNull()
      expect(row.minWeightName).toBeNull()
    }
  })

  it('picks the lightest weight that meets the minimum for each size', () => {
    expect(bySize(60)).toEqual({ 12: null, 14: 700, 16: 500, 18: 400, 24: 400 })
    expect(bySize(90)).toEqual({ 12: null, 14: 400, 16: 400, 18: 400, 24: 400 })
  })

  it('passes a weight when the contrast equals its minimum', () => {
    const at75 = getApcaFontBreakdown(75).find((row) => row.size === 16)
    expect(at75).toEqual({ size: 16, minWeight: 400, minWeightName: 'Regular' })
  })

  it('only allows bold at 12px, whatever the contrast', () => {
    expect(bySize(100)[12]).toBe(700)
    expect(bySize(108)[12]).toBe(700)
    expect(bySize(99)[12]).toBeNull()
  })

  it('uses the weight name from the table', () => {
    for (const row of getApcaFontBreakdown(60)) {
      const table = APCA_FONT_ROWS.find((r) => r.size === row.size)
      const weight = table?.weights.find((w) => w.weight === row.minWeight)
      expect(row.minWeightName).toBe(weight?.name ?? null)
    }
  })
})

describe('calcContrast', () => {
  it('gives the full WCAG ratio and both levels for black on white', () => {
    const result = calcContrast('#000000', '#ffffff')
    expect(result.wcag).toBe('21.0')
    expect(result.aa).toBe(true)
    expect(result.aaa).toBe(true)
    expect(parseFloat(result.apca)).toBeGreaterThan(100)
  })

  it('gives a ratio of 1 and no contrast for the same colour', () => {
    const result = calcContrast('#808080', '#808080')
    expect(result.wcag).toBe('1.0')
    expect(parseFloat(result.apca)).toBe(0)
    expect(result.aa).toBe(false)
    expect(result.aaa).toBe(false)
  })

  it('passes AA but not AAA between 4.5 and 7', () => {
    // #767676 on white is 4.54:1
    const result = calcContrast('#767676', '#ffffff')
    expect(result.aa).toBe(true)
    expect(result.aaa).toBe(false)
  })

  it('fails AA below 4.5', () => {
    // #949494 on white is 3.03:1
    const result = calcContrast('#949494', '#ffffff')
    expect(result.wcag).toBe('3.0')
    expect(result.aa).toBe(false)
    expect(result.aaa).toBe(false)
  })

  it('judges AA and AAA on the unrounded ratio', () => {
    // #777777 on white is 4.48:1, shown rounded as 4.5
    const aa = calcContrast('#777777', '#ffffff')
    expect(aa.wcag).toBe('4.5')
    expect(aa.wcagRatio).toBeLessThan(4.5)
    expect(aa.aa).toBe(false)

    // #595959 on white is 7.00:1 and passes AAA; #5a5a5a is 6.9
    expect(calcContrast('#595959', '#ffffff').aaa).toBe(true)
    expect(calcContrast('#5a5a5a', '#ffffff').aaa).toBe(false)
  })

  it('gives the unrounded APCA Lc next to the rounded one', () => {
    // #8f8f8f on white is Lc 59.6, shown rounded as 60
    const result = calcContrast('#8f8f8f', '#ffffff')
    expect(result.apca).toBe('60')
    expect(result.apcaLc).toBeGreaterThan(59.5)
    expect(result.apcaLc).toBeLessThan(60)
  })

  it('gives the APCA Lc as a positive value for both polarities', () => {
    expect(calcContrast('#ffffff', '#000000').apcaLc).toBeGreaterThan(0)
    expect(calcContrast('#000000', '#ffffff').apcaLc).toBeGreaterThan(0)
  })

  it('gives the same WCAG ratio in either direction', () => {
    expect(calcContrast('#767676', '#ffffff').wcag).toBe(
      calcContrast('#ffffff', '#767676').wcag,
    )
  })

  it('reports APCA as a positive value for both polarities', () => {
    expect(parseFloat(calcContrast('#000000', '#ffffff').apca)).toBeGreaterThan(
      0,
    )
    expect(parseFloat(calcContrast('#ffffff', '#000000').apca)).toBeGreaterThan(
      0,
    )
  })

  it('returns zero and fails both levels for a colour it cannot parse, without logging', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = calcContrast('not a colour', '#ffffff')
    expect(result).toEqual({
      wcag: '0',
      apca: '0',
      wcagRatio: 0,
      apcaLc: 0,
      aa: false,
      aaa: false,
    })
    expect(error).not.toHaveBeenCalled()
  })
})

describe('simulation palettes', () => {
  const palettes: TokenPalette[] = [
    { name: 'Custom', steps: Array(STEP_COUNT).fill('#111111') },
    { name: 'Other', steps: Array(STEP_COUNT).fill('#333333') },
  ]

  it('returns an empty list when nothing is stored', () => {
    expect(getSimulationPalettes()).toEqual([])
  })

  it('saves and reads the palettes', () => {
    setSimulationPalettes(palettes)
    expect(getSimulationPalettes()).toEqual(palettes)
  })

  it('clears the saved palettes', () => {
    setSimulationPalettes(palettes)
    clearSimulationPalettes()
    expect(getSimulationPalettes()).toEqual([])
  })

  it('returns an empty list when the stored value is not JSON', () => {
    localStorage.setItem('colorPalette_simulationPalettes', '[{oops')
    expect(getSimulationPalettes()).toEqual([])
  })

  it('returns an empty list when the stored value is not a list', () => {
    localStorage.setItem('colorPalette_simulationPalettes', 'null')
    expect(getSimulationPalettes()).toEqual([])
    localStorage.setItem('colorPalette_simulationPalettes', '{"name":"x"}')
    expect(getSimulationPalettes()).toEqual([])
  })

  it('drops stored entries that are not palettes', () => {
    localStorage.setItem(
      'colorPalette_simulationPalettes',
      JSON.stringify([
        { name: 'x' },
        { name: 'Bad steps', steps: Array(STEP_COUNT).fill(1) },
        { name: 'Too few steps', steps: ['#111111', '#222222'] },
        {
          name: 'Too many steps',
          steps: Array(STEP_COUNT + 1).fill('#111111'),
        },
        { name: 'No steps', steps: [] },
        { name: 42, steps: palettes[0].steps },
        { steps: ['#111111'] },
        null,
        'Custom',
        palettes[0],
      ]),
    )
    expect(getSimulationPalettes()).toEqual([palettes[0]])
  })

  it('does not throw when writing fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(() => setSimulationPalettes(palettes)).not.toThrow()
  })

  it('does nothing without a window', () => {
    setSimulationPalettes(palettes)
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem')
    vi.stubGlobal('window', undefined)
    expect(getSimulationPalettes()).toEqual([])
    setSimulationPalettes([])
    clearSimulationPalettes()
    expect(setItem).not.toHaveBeenCalled()
    expect(removeItem).not.toHaveBeenCalled()
  })
})

describe('examplePalettes', () => {
  const custom: TokenPalette = {
    name: 'Custom',
    steps: Array(STEP_COUNT).fill('#888888'),
  }

  /** The editor's starting list with step 9 of the first hue edited. */
  function withEditedFirstHue(): TokenPalette[] {
    const palettes = editablePalettesFromTokensStudio()
    palettes[0].steps[8] = '#123456'
    return palettes
  }

  it('gives the Tokens Studio hues when nothing is saved', () => {
    expect(examplePalettes('light', [])).toEqual(tokensStudioPalettes('light'))
    expect(examplePalettes('dark', [])).toEqual(tokensStudioPalettes('dark'))
  })

  it('lists each hue once when the editor saved the unedited hues', () => {
    const saved = editablePalettesFromTokensStudio()

    expect(examplePalettes('light', saved)).toEqual(
      tokensStudioPalettes('light'),
    )
    expect(examplePalettes('dark', saved)).toEqual(tokensStudioPalettes('dark'))
  })

  it('counts a step typed in another letter case as unedited', () => {
    const saved = editablePalettesFromTokensStudio()
    saved[0].steps = saved[0].steps.map((step) => step.toUpperCase())

    expect(examplePalettes('dark', saved)).toEqual(tokensStudioPalettes('dark'))
  })

  it('puts an edited hue in the place of the hue in light mode', () => {
    const saved = withEditedFirstHue()
    const result = examplePalettes('light', saved)

    expect(result).toHaveLength(TS_HUES.length)
    expect(result[0]).toEqual(saved[0])
    expect(result.slice(1)).toEqual(tokensStudioPalettes('light').slice(1))
  })

  it('matches a saved palette to a hue by name, as toneRamps does', () => {
    const saved = withEditedFirstHue()
    saved[0].name = `  ${saved[0].name.toLowerCase()} `

    const result = examplePalettes('light', saved.slice(0, 1))

    expect(result).toHaveLength(TS_HUES.length)
    expect(result[0]).toEqual(saved[0])
  })

  it('keeps a hue the editor removed', () => {
    const saved = editablePalettesFromTokensStudio().slice(1)

    expect(examplePalettes('light', saved)).toEqual(
      tokensStudioPalettes('light'),
    )
  })

  it('adds new palettes after the hues, in the saved order', () => {
    const other = { ...custom, name: 'Other' }
    const saved = [custom, ...editablePalettesFromTokensStudio(), other]

    expect(examplePalettes('light', saved)).toEqual([
      ...tokensStudioPalettes('light'),
      custom,
      other,
    ])
  })

  it('never puts a light ramp in the place of a dark hue', () => {
    const saved = [...withEditedFirstHue(), custom]
    const result = examplePalettes('dark', saved)

    expect(result.slice(0, TS_HUES.length)).toEqual(
      tokensStudioPalettes('dark'),
    )
    expect(result.slice(TS_HUES.length)).toEqual([
      { name: `${saved[0].name} (light)`, steps: saved[0].steps },
      { name: 'Custom (light)', steps: custom.steps },
    ])
  })

  it('does not change the saved palettes', () => {
    const saved = [...withEditedFirstHue(), custom]
    const copy = structuredClone(saved)

    examplePalettes('light', saved)
    examplePalettes('dark', saved)

    expect(saved).toEqual(copy)
  })
})
