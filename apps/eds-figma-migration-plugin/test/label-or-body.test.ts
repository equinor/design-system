/**
 * Label or body for Inter text with the legacy default line height (rules
 * 2026-11-26.1). Most short texts in components were proposed body, since
 * the default line height was read as a sign of running text.
 */
import { describe, expect, it } from 'vitest'
import { resolveTypography } from '../src/mapping/rules'
import type { RoleContext } from '../src/mapping/types'
import { ctx, densityType, spacingSemantic, textInput } from './helpers'

const style = (context: RoleContext, step = 'md', font = 'Inter Regular') =>
  resolveTypography(
    textInput(
      densityType({ family: 'ui-body', step, lineHeight: 'default' }),
      font,
      context,
    ),
  )

const words = (count: number, sentenceEnd = false) => ({ count, sentenceEnd })

describe('Inter text with the legacy default line height', () => {
  it('takes label for a short text on one line in a component', () => {
    const result = style(
      ctx(['Title', 'List item', 'Well list'], {
        singleLine: true,
        words: words(2),
      }),
    )
    expect(result).toMatchObject({
      outcome: 'sure',
      candidates: ['label/md/default'],
      rule: 'type/style',
    })
    expect(result.reason).toMatch(/not a sentence takes label/)
  })

  it('takes label for a short text on one line outside components', () => {
    expect(
      style(
        ctx(['Last updated', 'Page header'], {
          singleLine: true,
          words: words(4),
        }),
      ).candidates[0],
    ).toBe('label/md/default')
  })

  it('takes label medium and label xs, which body does not have, without a check', () => {
    const medium = style(
      ctx(['Typography', 'Section header'], {
        singleLine: true,
        words: words(1),
      }),
      'md',
      'Inter Medium',
    )
    expect(medium).toMatchObject({
      outcome: 'sure',
      candidates: ['label/md/medium'],
    })
    const xs = style(
      ctx(['Typography', 'Tag'], { singleLine: true, words: words(1) }),
      'xs',
    )
    expect(xs).toMatchObject({
      outcome: 'sure',
      candidates: ['label/xs/default'],
    })
  })

  it('takes body for text on several lines', () => {
    expect(
      style(ctx(['Notes', 'Card'], { singleLine: false, words: words(3) }))
        .candidates[0],
    ).toBe('body/md/default')
  })

  it('takes body for a sentence on one line', () => {
    const result = style(
      ctx(['Typography', 'Empty state'], {
        singleLine: true,
        words: words(5, true),
      }),
    )
    expect(result).toMatchObject({
      outcome: 'sure',
      candidates: ['body/md/default'],
    })
    expect(result.reason).toMatch(/it is a sentence/)
    expect(
      style(ctx(['Typography', 'Card'], { singleLine: true, words: words(12) }))
        .candidates[0],
    ).toBe('body/md/default')
  })

  it('takes label for a short text ending with a full stop, such as “Read more.”', () => {
    expect(
      style(
        ctx(['Link text', 'Card'], {
          singleLine: true,
          words: words(2, true),
        }),
      ).candidates[0],
    ).toBe('label/md/default')
  })

  it('takes body for a description, helper text or message on one line', () => {
    for (const names of [
      ['Description', 'Card'],
      ['Helper text', 'Text field'],
      ['Text', 'Message'],
    ]) {
      expect(
        style(ctx(names, { singleLine: true, words: words(2) })).candidates[0],
      ).toBe('body/md/default')
    }
  })

  it('keeps label for single-line text in a control, even a sentence', () => {
    expect(
      style(
        ctx(['Label', 'Button / Primary'], {
          singleLine: true,
          words: words(4, true),
        }),
      ).candidates[0],
    ).toBe('label/md/default')
  })

  it('takes label for a legacy Typography component on one line, read from the modes', () => {
    const result = resolveTypography(
      textInput(
        {
          fontSize: spacingSemantic(
            'Typography/Font size',
            'typography/ui-body/sm/font-size',
          ),
          lineHeight: spacingSemantic(
            'Typography/Line height',
            'typography/ui-body/sm/line-height-default',
          ),
          fontFamily: spacingSemantic(
            'Typography/Font family',
            'typography/ui-body/font-family',
            'STRING',
          ),
        },
        'Inter Regular',
        ctx(['Text', 'Typography', 'Table header'], {
          singleLine: true,
          words: words(1),
        }),
      ),
    )
    expect(result).toMatchObject({
      outcome: 'sure',
      candidates: ['label/sm/default'],
    })
  })

  it('takes label without a word count, as in fixtures exported before 2026-11-26', () => {
    expect(
      style(ctx(['Card title', 'Card / Well'], { singleLine: true }))
        .candidates[0],
    ).toBe('label/md/default')
  })
})

describe('Inter text with no line height variable', () => {
  it('chooses by the same rule, as a check', () => {
    const result = resolveTypography(
      textInput(
        densityType({ family: 'ui-body', step: 'md' }),
        'Inter Regular',
        ctx(['Typography', 'Empty state'], {
          singleLine: true,
          words: words(6, true),
        }),
      ),
    )
    expect(result.outcome).toBe('check')
    expect(result.candidates[0]).toBe('body/md/default')
    expect(result.reason).toMatch(
      /no line height variable, so body is chosen because the text is a sentence/,
    )
  })
})
