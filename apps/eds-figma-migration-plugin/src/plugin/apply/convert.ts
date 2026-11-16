/**
 * Replaces instances of the legacy Typography component with text layers
 * that have an EDS Foundation text style. The component is a text in a
 * component, so a plain text layer with a text style does the same job
 * without legacy variables. The text style and the colour come from the
 * plan (scan/apply-plan.ts, planConversions): the targets the Typography tab
 * shows, after the designer's choices. Without a Ready colour the legacy
 * variable is copied, and Changes lists it after the conversion. Each text
 * layer logs the component it replaced, so Revert frame can put the
 * instance back.
 *
 * A Typography instance inside a main component also carries the text of
 * every instance of that component. That text is read before the
 * conversion and put on the new text layer in each instance afterwards.
 */
import { MAPPING_VERSION } from '../../mapping/version'
import type { ConversionPlan } from '../../scan/apply-plan'
import type { LogEntry } from '../../shared/changelog'
import type { ChangeFailure, ConvertResult } from '../../shared/messages'
import { Fonts } from './apply'
import {
  owningComponent,
  readInstanceTexts,
  writeInstanceTexts,
} from './instance-texts'
import { appendLog } from './log'
import { Targets } from './targets'

function isAutoLayout(node: BaseNode | null): boolean {
  return (
    node !== null &&
    'layoutMode' in node &&
    (node as FrameNode).layoutMode !== 'NONE'
  )
}

/** Puts the text where the instance was, with the same size behaviour. */
function place(text: TextNode, instance: InstanceNode, source: TextNode) {
  const parent = instance.parent as (BaseNode & ChildrenMixin) | null
  if (!parent) throw new Error('The instance has no parent.')
  parent.insertChild(parent.children.indexOf(instance), text)
  text.name = instance.name
  text.visible = instance.visible
  text.locked = instance.locked
  text.opacity = instance.opacity
  text.textAlignHorizontal = source.textAlignHorizontal
  text.textAlignVertical = source.textAlignVertical
  if (source.textTruncation === 'ENDING') {
    text.textTruncation = 'ENDING'
    text.maxLines = source.maxLines
  }
  const inFlow =
    isAutoLayout(parent) && instance.layoutPositioning !== 'ABSOLUTE'
  if (inFlow) {
    text.layoutAlign = instance.layoutAlign
    text.layoutGrow = instance.layoutGrow
    const horizontal = instance.layoutSizingHorizontal
    if (horizontal === 'HUG') {
      text.textAutoResize = 'WIDTH_AND_HEIGHT'
    } else {
      if (horizontal === 'FIXED') text.resize(instance.width, text.height)
      else text.layoutSizingHorizontal = 'FILL'
      text.textAutoResize = 'HEIGHT'
    }
    if (instance.layoutSizingVertical === 'FILL') {
      text.layoutSizingVertical = 'FILL'
    }
    return
  }
  if (instance.layoutPositioning === 'ABSOLUTE') {
    text.layoutPositioning = 'ABSOLUTE'
  }
  text.x = instance.x
  text.y = instance.y
  text.resize(instance.width, text.height)
  text.textAutoResize =
    source.textAutoResize === 'WIDTH_AND_HEIGHT' ? 'WIDTH_AND_HEIGHT' : 'HEIGHT'
  if ('constraints' in instance) text.constraints = instance.constraints
}

function properties(instance: InstanceNode): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {}
  for (const [name, property] of Object.entries(instance.componentProperties)) {
    if (
      typeof property.value === 'string' ||
      typeof property.value === 'boolean'
    ) {
      values[name] = property.value
    }
  }
  return values
}

export async function convertTypography(
  plan: ConversionPlan,
): Promise<ConvertResult> {
  const targets = new Targets()
  const fonts = new Fonts()
  const failed: ChangeFailure[] = []
  let converted = 0
  let monoNumbers = 0
  let instanceTexts = 0
  const monoNumberIds: string[] = []
  const caseIds: string[] = []
  const at = new Date().toISOString()
  const skipped: ConvertResult['skipped'] = []
  for (const skip of plan.skipped) {
    let name = skip.name
    if (!name) {
      const node = await figma.getNodeByIdAsync(skip.instanceId)
      name = node && 'name' in node ? node.name : skip.instanceId
    }
    skipped.push({
      nodeId: skip.instanceId,
      nodeName: name,
      reason: skip.reason,
    })
  }
  if (plan.convert.length === 0) {
    return {
      converted,
      monoNumbers,
      monoNumberIds,
      caseIds,
      instanceTexts,
      skipped,
      failed,
    }
  }
  await fonts.load({ family: 'Inter', style: 'Regular' })

  for (const conversion of plan.convert) {
    const id = conversion.instanceId
    const node = await figma.getNodeByIdAsync(id)
    const fail = (message: string) =>
      failed.push({
        nodeId: id,
        nodeName: node && 'name' in node ? node.name : id,
        property: 'Typography',
        message,
      })
    try {
      if (node?.type !== 'INSTANCE' || node.removed) {
        fail('The instance is no longer in the file. Scan again.')
        continue
      }
      const source = node.findOne((child) => child.type === 'TEXT')
      if (source?.type !== 'TEXT') {
        fail('The instance has no text.')
        continue
      }
      // The text style the Typography tab shows for the instance: the
      // rules' proposal or the designer's choice.
      const style = await targets.textStyle(conversion.style.target)
      await fonts.load(style.fontName)

      // Read what each instance of the main component shows here before
      // the layer it is set on goes away.
      const component = owningComponent(node)
      const texts = component
        ? await readInstanceTexts(component, node, source)
        : []

      const text = figma.createText()
      try {
        await text.setTextStyleIdAsync(style.id)
        text.characters = source.characters
        // Setting any style property, such as the text case, detaches the
        // text style in Figma and leaves its variables bound to the layer.
        // The style wins, and the case is dropped: the tab marks such an
        // instance Needs check before it is converted (decision B), and the
        // result counts them again.
        if (
          source.textCase === figma.mixed ||
          source.textCase !== style.textCase
        ) {
          caseIds.push(text.id)
        }

        const colour = conversion.colour?.target
        if (colour) {
          const variable = await targets.variable(colour)
          text.fills = [
            figma.variables.setBoundVariableForPaint(
              { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
              'color',
              variable,
            ),
          ]
        } else if (source.fills !== figma.mixed) {
          // The legacy colour stays, and Changes lists it after the scan
          // that follows.
          text.fills = source.fills
        }
        place(text, node, source)
      } catch (error) {
        text.remove()
        throw error
      }

      const main = await node.getMainComponentAsync()
      const values = properties(node)
      if (
        Object.entries(values).some(
          ([name, value]) =>
            /mono/i.test(name) && /^true$/i.test(String(value)),
        )
      ) {
        monoNumbers += 1
        monoNumberIds.push(text.id)
      }
      const entry: LogEntry = {
        property: { type: 'typography' },
        old: {
          type: 'component',
          key: main?.key ?? '',
          name: node.name,
          properties: values,
          modes: { ...node.explicitVariableModes },
          sizing: {
            horizontal: node.layoutSizingHorizontal,
            vertical: node.layoutSizingVertical,
            width: node.width,
            height: node.height,
          },
          ...(source.fills !== figma.mixed
            ? {
                textFills: JSON.parse(
                  JSON.stringify(source.fills),
                ) as unknown[],
              }
            : {}),
          ...(node.isExposedInstance ? { exposed: true } : {}),
          ...(texts.length > 0 ? { instances: texts } : {}),
        },
        new: { type: 'textStyle', key: style.key, name: style.name },
        outcome: conversion.style.outcome,
        ...(conversion.style.record.rule
          ? { rule: conversion.style.record.rule }
          : {}),
        mappingVersion: MAPPING_VERSION,
        at,
      }
      appendLog(text, entry)
      node.remove()
      instanceTexts += await writeInstanceTexts(text, texts, fonts)
      converted += 1
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error))
    }
  }
  figma.commitUndo()
  return {
    converted,
    monoNumbers,
    monoNumberIds,
    caseIds,
    instanceTexts,
    skipped,
    failed,
  }
}
