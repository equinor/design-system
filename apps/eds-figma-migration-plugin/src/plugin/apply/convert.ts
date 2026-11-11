/**
 * Replaces instances of the legacy Typography component with text layers
 * that have the matching EDS Foundation text style. The component is a text
 * in a component, so a plain text layer with a text style does the same job
 * without legacy variables. The colour becomes its EDS Foundation variable
 * when the rule is sure, and keeps the legacy variable otherwise, so it shows
 * up in the review. Each text layer logs the component it replaced, so
 * Revert frame can put the instance back.
 *
 * A Typography instance inside a main component also carries the text of
 * every instance of that component. That text is read before the
 * conversion and put on the new text layer in each instance afterwards.
 */
import { MAPPING_VERSION } from '../../mapping/version'
import { classifyUnit } from '../../scan/classify'
import type { RawUnit } from '../../scan/types'
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
  instanceIds: string[],
  units: RawUnit[],
): Promise<ConvertResult> {
  const targets = new Targets()
  const fonts = new Fonts()
  const failed: ChangeFailure[] = []
  let converted = 0
  let monoNumbers = 0
  let instanceTexts = 0
  const monoNumberIds: string[] = []
  const at = new Date().toISOString()
  await fonts.load({ family: 'Inter', style: 'Regular' })

  for (const id of instanceIds) {
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
      // The scan read the text inside the instance; classified as if it
      // were not in an instance, it gets the rules' text style and colour.
      const own = units.filter(
        (unit) => unit.instanceId === id && unit.nodeId === source.id,
      )
      const typography = own.find((unit) => unit.unit === 'typography')
      const record = typography
        ? classifyUnit({ ...typography, instanceId: undefined })
        : null
      const styleName = record?.candidates?.[0]
      if (!record || !styleName || record.category === 'none') {
        fail(
          record?.reason ??
            'No legacy typography was read, so no text style can be matched.',
        )
        continue
      }
      const style = await targets.textStyle(styleName)
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
        if (source.textCase !== figma.mixed) text.textCase = source.textCase

        const fill = own.find(
          (unit) => unit.unit === 'variable' && unit.kind === 'textFill',
        )
        const fillRecord = fill
          ? classifyUnit({ ...fill, instanceId: undefined })
          : null
        const colour = fillRecord?.candidates?.[0]
        if (fillRecord?.category === 'sure' && colour) {
          const variable = await targets.variable(colour)
          text.fills = [
            figma.variables.setBoundVariableForPaint(
              { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
              'color',
              variable,
            ),
          ]
        } else if (source.fills !== figma.mixed) {
          // The legacy colour stays, so it shows up in the review.
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
        outcome: record.category === 'sure' ? 'sure' : 'confirmed',
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
  return { converted, monoNumbers, monoNumberIds, instanceTexts, failed }
}
