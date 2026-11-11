/**
 * A Typography instance inside a main component holds the text of every
 * instance of that component: each instance sets its own text on it, as an
 * override. Replacing the Typography instance with a text layer removes the
 * layer those overrides belong to, so every instance would fall back to the
 * main component's placeholder. These helpers read each instance's text
 * before the conversion and put it on the new text layer afterwards, and do
 * the same the other way for Revert frame.
 */
import type { InstanceText } from '../../shared/changelog'
import { counterpartId, nestingDepth } from '../../shared/instance-ids'
import type { Fonts } from './apply'

/** The main component a layer belongs to, when it is not inside an instance. */
export function owningComponent(node: SceneNode): ComponentNode | null {
  for (
    let parent = node.parent;
    parent && parent.type !== 'PAGE' && parent.type !== 'DOCUMENT';
    parent = parent.parent
  ) {
    if (parent.type === 'COMPONENT') return parent
    if (parent.type === 'INSTANCE') return null
  }
  return null
}

function samePaints(a: readonly Paint[], b: readonly Paint[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * What each instance of `component` shows in the Typography instance
 * `typography`, whose text layer is `source`. The outermost instances come
 * first, so an instance nested in another one can follow what the outer one
 * sets.
 */
export async function readInstanceTexts(
  component: ComponentNode,
  typography: InstanceNode,
  source: TextNode,
): Promise<InstanceText[]> {
  const instances = await component.getInstancesAsync()
  const texts: InstanceText[] = []
  for (const instance of [...instances].sort(
    (a, b) => nestingDepth(a.id) - nestingDepth(b.id),
  )) {
    const copy = await figma.getNodeByIdAsync(
      counterpartId(instance.id, source.id),
    )
    if (copy?.type !== 'TEXT') continue
    const item: InstanceText = { id: instance.id, characters: copy.characters }
    const holder = await figma.getNodeByIdAsync(
      counterpartId(instance.id, typography.id),
    )
    if (
      holder &&
      'visible' in holder &&
      holder.visible !== typography.visible
    ) {
      item.visible = holder.visible
    }
    if (
      copy.fills !== figma.mixed &&
      source.fills !== figma.mixed &&
      !samePaints(copy.fills, source.fills)
    ) {
      item.fills = JSON.parse(JSON.stringify(copy.fills)) as unknown[]
    }
    texts.push(item)
  }
  return texts
}

/** Puts each instance's text on its copy of the new text layer. Returns how many instances were found. */
export async function writeInstanceTexts(
  text: TextNode,
  texts: InstanceText[],
  fonts: Fonts,
): Promise<number> {
  let written = 0
  for (const item of texts) {
    const copy = await figma.getNodeByIdAsync(counterpartId(item.id, text.id))
    if (copy?.type !== 'TEXT') continue
    if (copy.characters !== item.characters) {
      await fonts.loadText(copy)
      copy.characters = item.characters
    }
    if (item.visible !== undefined && copy.visible !== item.visible) {
      copy.visible = item.visible
    }
    if (item.fills) copy.fills = item.fills as Paint[]
    written += 1
  }
  return written
}

/** For Revert frame: puts each instance's text back on its copy of the Typography instance. */
export async function restoreInstanceTexts(
  typography: InstanceNode,
  texts: InstanceText[],
  fonts: Fonts,
): Promise<void> {
  for (const item of texts) {
    const copy = await figma.getNodeByIdAsync(
      counterpartId(item.id, typography.id),
    )
    if (copy?.type !== 'INSTANCE') continue
    if (item.visible !== undefined) copy.visible = item.visible
    const text = copy.findOne((child) => child.type === 'TEXT')
    if (text?.type !== 'TEXT') continue
    if (text.characters !== item.characters) {
      const property = text.componentPropertyReferences?.characters
      if (property && property in copy.componentProperties) {
        copy.setProperties({ [property]: item.characters })
      } else {
        await fonts.loadText(text)
        text.characters = item.characters
      }
    }
    if (item.fills) text.fills = item.fills as Paint[]
  }
}
