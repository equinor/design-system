import { useState } from 'react'
import { Icon } from '@equinor/eds-core-react/next'
import { chevron_down, chevron_right, visibility_off } from '@equinor/eds-icons'
import type { TreeNode } from '../instances'
import { HIDDEN_LABEL } from '../labels'

type InstanceTreeProps = {
  /** The instances at the top, from instanceForest */
  nodes: TreeNode[]
  /** Keys of the rows open at the start */
  initiallyOpen?: string[]
  onSelect: (nodeIds: string[]) => void
}

/**
 * What a row says to a screen reader and in its tooltip: the legacy values
 * in the instance and the instances in it, and how many are on hidden layers.
 */
function summary(node: TreeNode): string {
  const parts = [
    `${node.count} legacy value${node.count === 1 ? '' : 's'}`,
    node.children.length > 0 && node.own > 0 && `${node.own} on its own layers`,
    node.hiddenCount > 0 && `${node.hiddenCount} on hidden layers`,
  ]
  return parts.filter(Boolean).join(', ')
}

/** Figma's instance icon: an outlined diamond. */
function InstanceIcon() {
  return (
    <svg
      className="tree-icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M8 3.75 12.25 8 8 12.25 3.75 8Z" />
    </svg>
  )
}

/** Figma's frame icon: a hash. */
function FrameIcon() {
  return (
    <svg
      className="tree-icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M6 3.5v9M10 3.5v9M3.5 6h9M3.5 10h9" />
    </svg>
  )
}

/** A page, for instances that sit on its canvas: a sheet with its corner folded. */
function PageIcon() {
  return (
    <svg
      className="tree-icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M9.5 1.5 13 5v9.5H3.5v-13h6ZM13 5H9.5V1.5" />
      <path data-fill d="M13 5 9.5 1.5V5H13Z" />
    </svg>
  )
}

/** Figma's main component icon: four filled diamonds. */
function ComponentIcon() {
  return (
    <svg
      className="tree-icon"
      data-filled
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M8 3 9.75 4.75 8 6.5 6.25 4.75ZM11.25 6.25 13 8l-1.75 1.75L9.5 8ZM8 9.5l1.75 1.75L8 13l-1.75-1.75ZM4.75 6.25 6.5 8 4.75 9.75 3 8Z" />
    </svg>
  )
}

/** Figma's slot icon: a rounded square with a plus in it. */
function SlotIcon() {
  return (
    <svg
      className="tree-icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" />
      <path d="M8 5.75v4.5M5.75 8h4.5" />
    </svg>
  )
}

/**
 * Where in an instance its legacy values are, drawn as Figma's Layers panel
 * draws layers, so designers know it at once: one row per instance in layer
 * order, a caret and the instance icon in the component colour, slot content
 * under a slot row in the slot colour, and hidden instances dimmed with the
 * hidden icon. Go to sits at the right end of each row, after the legacy
 * values. The frames, main components and loose layers of the scan are the
 * rows at the top, with Figma's frame and main component icons. Only
 * instances with legacy values from their main components are shown, and
 * the slots that hold them; frames and other layers between them are left
 * out. Casper's case (2026-11-18): PE Editor held 672 legacy values in Text
 * Fields, Switches and Buttons, many of them hidden, and the tab showed only
 * the total.
 */
/** The key of the row for a slot, to open it from outside. */
export function slotKeyOf(parentKey: string, slot: string): string {
  return `${parentKey}:slot:${slot}`
}

export function InstanceTree({
  nodes,
  initiallyOpen = [],
  onSelect,
}: InstanceTreeProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(initiallyOpen))
  const toggle = (key: string) =>
    setOpen((previous) => {
      const next = new Set(previous)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const caret = (key: string, label: string, expandable: boolean) =>
    expandable ? (
      <button
        type="button"
        className="tree-caret"
        aria-expanded={open.has(key)}
        aria-label={`${open.has(key) ? 'Hide' : 'Show'} the layers in ${label}`}
        onClick={() => toggle(key)}
      >
        <Icon data={open.has(key) ? chevron_down : chevron_right} size="sm" />
      </button>
    ) : (
      <span className="tree-spacer" aria-hidden="true" />
    )

  const renderChildren = (parent: TreeNode, depth: number) => {
    const fromMain = parent.children.filter((child) => !child.inSlot)
    // Slot content under a row for its slot, one per slot, in their order
    const slots = new Map<string, TreeNode[]>()
    for (const child of parent.children) {
      if (!child.inSlot) continue
      const slot = child.slotName ?? 'Slot'
      slots.set(slot, [...(slots.get(slot) ?? []), child])
    }
    return (
      <>
        {fromMain.map((child) => renderNode(child, depth))}
        {[...slots].map(([slot, inSlot]) => {
          const slotKey = slotKeyOf(parent.key, slot)
          return (
            <li key={slotKey}>
              <div
                className="tree-row"
                data-kind="slot"
                style={{ '--_depth': depth } as never}
              >
                {caret(
                  slotKey,
                  `the slot ${slot} of ${parent.name.trim()}`,
                  true,
                )}
                <SlotIcon />
                <span className="tree-label">
                  <span className="tree-name">{slot}</span>
                </span>
              </div>
              {open.has(slotKey) && (
                <ul className="tree-list">
                  {inSlot.map((child) => renderNode(child, depth + 1))}
                </ul>
              )}
            </li>
          )
        })}
      </>
    )
  }

  const renderNode = (node: TreeNode, depth: number) => {
    const name = node.name.trim()
    const expandable = node.children.length > 0
    const details = summary(node)
    return (
      <li key={node.key}>
        <div
          className="tree-row"
          data-kind={node.kind ?? 'instance'}
          data-hidden={node.hidden || undefined}
          style={{ '--_depth': depth } as never}
          title={`${name}${node.component && node.component !== name ? `, ${node.component}` : ''}: ${details}`}
        >
          {caret(node.key, name, expandable)}
          {node.page ? (
            <PageIcon />
          ) : node.kind === 'component' ? (
            <ComponentIcon />
          ) : node.kind ? (
            <FrameIcon />
          ) : (
            <InstanceIcon />
          )}
          <span className="tree-label">
            <span className="tree-name">{name}</span>
          </span>
          {node.hidden && (
            <Icon
              className="tree-hidden"
              data={visibility_off}
              size="sm"
              aria-hidden="true"
            />
          )}
          <span className="tree-count" aria-hidden="true">
            {node.count} legacy
          </span>
          <button
            type="button"
            className="tree-goto"
            aria-label={`Go to ${name}${node.hidden ? `, ${HIDDEN_LABEL.toLowerCase()}` : ''}: ${details}`}
            onClick={() => onSelect(node.goTo ?? [node.id])}
          >
            Go to
          </button>
        </div>
        {expandable && open.has(node.key) && (
          <ul className="tree-list">{renderChildren(node, depth + 1)}</ul>
        )}
      </li>
    )
  }

  return (
    <ul className="tree-list instance-tree" aria-label="Instances">
      {nodes.map((node) => renderNode(node, 0))}
    </ul>
  )
}
