/**
 * Plain words for the rules (UX review F2). The rules explain a Needs check
 * in their own terms, such as “Text is named for what it sits on
 * background/surface on “Card / Actions””. A designer who does not know the
 * Beta token names needs what that means for the layer, and what each
 * proposed target is for. The rule's own words stay available as Details.
 */

/** What a fill named in a reason is, in words. */
function fillWords(text: string): string {
  if (/hover or pressed fill/.test(text))
    return 'the hover or pressed fill of a control'
  if (/selected/.test(text)) return 'a selected fill'
  if (/tinted fill|\/muted/.test(text)) return 'a light, tinted fill'
  if (/emphasis/.test(text)) return 'a strong fill'
  if (/surface|canvas/.test(text)) return 'the page or a card'
  return 'a fill'
}

function toneWords(reason: string): string {
  const tone = /tone (\w+) from the 🎨 Appearance mode/.exec(reason)?.[1]
  return tone
    ? ` Its tone, ${tone}, comes from the legacy Appearance mode on the frame and is now part of the variable's name.`
    : ''
}

/** The reason a binding needs a check, in plain words; undefined when there is nothing to add to the rule's own words. */
export function plainReason(reason: string | undefined): string | undefined {
  if (!reason) return undefined
  const onFill = /^Text is named for what it sits on (.+?) on “(.+?)”/.exec(
    reason,
  )
  if (onFill) {
    return `This text sits on ${fillWords(onFill[1])}, “${onFill[2]}”. EDS names text colours after what they sit on, so check what is under the text in the frame.${toneWords(reason)}`
  }
  const both =
    /^Not interactive \(“(.+?)” matches both (.+?), which is interactive, and (.+?), which is not\)/.exec(
      reason,
    )
  if (both) {
    return `The name “${both[1]}” mentions both a ${both[2].toLowerCase()}, which people click, and a ${both[3].toLowerCase()}, which only shows information. The plugin guessed that people cannot click it. If they can, choose the interactive fill.`
  }
  const interactive = /^Interactive element \(“(.+?)” matches (.+?)\)/.exec(
    reason,
  )
  if (interactive) {
    const outline = /the border is the outline of the control/.test(reason)
      ? ' The border is the outline of the control, so it follows the same states.'
      : ''
    return `The name “${interactive[1]}” says it is a ${interactive[2].toLowerCase()}, which people click, so the plugin proposes the interactive variable with hover and pressed states. If it only shows information, choose the non-interactive one.${outline}${toneWords(reason)}`
  }
  if (/^Selected element/.test(reason)) {
    return 'The layer’s name says it is selected, so the plugin proposes the selected fill, whatever colour it had before. If it is only pressed, choose the pressed fill.'
  }
  if (/^Subtle on emphasis has no equivalent/.test(reason)) {
    return 'EDS has no subtle text on a strong fill: there is one text colour per tone on emphasis fills. The plugin proposes that one, so the text will look a little stronger than before.'
  }
  return undefined
}

function stateWords(name: string): string {
  if (name.endsWith('/hover')) return ', hover state'
  if (name.endsWith('/pressed')) return ', pressed state'
  return ''
}

/** What a target is for, in a few words; undefined when the name says it. */
export function targetMeaning(name: string): string | undefined {
  const state = stateWords(name)
  if (/^(text|icon)\/on-default\//.test(name)) {
    return 'On the page, a card or another default surface'
  }
  if (/^(text|icon)\/on-muted\//.test(name)) {
    return 'On a light, tinted fill, such as a banner or a selected item'
  }
  if (/^(text|icon)\/on-emphasis\//.test(name)) {
    return 'On a strong fill, such as a primary button'
  }
  if (/^background\/interactive\/[^/]+\/selected\//.test(name)) {
    return `The fill of a selected item${state}`
  }
  if (/^background\/interactive\/[^/]+\/emphasis\//.test(name)) {
    return `A strong fill people can click${state}`
  }
  if (/^background\/interactive\/[^/]+\/muted\//.test(name)) {
    return `A light fill people can click${state}`
  }
  if (/^background\/non-interactive\/[^/]+\/emphasis/.test(name)) {
    return 'A strong fill that only shows information'
  }
  if (/^background\/non-interactive\/[^/]+\/muted/.test(name)) {
    return 'A light fill that only shows information, such as a badge'
  }
  if (/^border\/interactive\//.test(name)) {
    return `A border on something people can click${state}`
  }
  if (/^border\/non-interactive\//.test(name)) {
    return 'A border that only separates or frames content'
  }
  return undefined
}
