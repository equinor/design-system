import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '@equinor/eds-core-react/next'
import { chevron_down, chevron_right, visibility_off } from '@equinor/eds-icons'
import { hasInner, slotKeyOf } from '../instances'
import type { TreeNode } from '../instances'
import { HIDDEN_LABEL, values } from '../labels'

export { slotKeyOf }

type InstanceTreeProps = {
  /** The rows at the top, from entryForest or instanceForest */
  nodes?: TreeNode[]
  /**
   * Instead of `nodes`: the instance whose instances are the rows at the
   * top, with its slot content under a row for each slot, for a tree under
   * a header that names the instance
   */
  parent?: TreeNode
  /** Keys of the rows open at the start */
  initiallyOpen?: string[]
  /**
   * In a frame's Layers view, the values under a row: `key` is the row's key
   * for the values on its own layers, or its slot's key (`slotKeyOf`) for
   * the values on layers in the slot outside the instances there; `owner` is
   * the instance; `depth` is the level of the rows below.
   */
  leaves?: (key: string, owner: TreeNode, depth: number) => ReactNode
  /** Counts are of legacy values (the Instances tab), or of every value (a frame's Layers view) */
  legacyOnly?: boolean
  onSelect: (nodeIds: string[]) => void
}

/**
 * The count at the right of a row: the legacy values on the Instances tab;
 * every value in a frame's Layers view, and how many of them the instance
 * overrides, which are the ones that change there.
 */
function countText(
  count: number,
  overridden: number | undefined,
  legacyOnly: boolean,
): string {
  if (legacyOnly) return `${count} legacy`
  return overridden
    ? `${values(count)}, ${overridden} overridden`
    : values(count)
}

/**
 * What a row says to a screen reader and in its tooltip: the legacy values
 * in the instance and the instances in it, and how many are on hidden layers.
 */
function summary(node: TreeNode, legacyOnly: boolean): string {
  const parts = [
    `${node.count} ${legacyOnly ? 'legacy ' : ''}value${node.count === 1 ? '' : 's'}`,
    node.children.length > 0 && node.own > 0 && `${node.own} on its own layers`,
    (node.overridden ?? 0) > 0 && `${node.overridden} overridden`,
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
 *
 * A click anywhere on a row opens it: the caret is the button, stretched over
 * the row, and Go to sits above it. With `leaves`, in a frame's Layers view,
 * an instance with values on its own layers and instances in it shows its
 * values under a row of their own, closed at the start, so the inner
 * instances are not far down below a long list; with `parent`, that row
 * comes first and the inner instances follow under a small header.
 */
export function InstanceTree({
  nodes,
  parent,
  initiallyOpen = [],
  leaves,
  legacyOnly = true,
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
        aria-label={`${open.has(key) ? 'Hide' : 'Show'} ${label}`}
        onClick={() => toggle(key)}
      >
        <Icon data={open.has(key) ? chevron_down : chevron_right} size="sm" />
      </button>
    ) : (
      <span className="tree-spacer" aria-hidden="true" />
    )

  // The values on an instance's own layers, or on the layers of one of its
  // slots outside the instances there, as a row that opens to them
  const valuesRow = (
    key: string,
    owner: TreeNode,
    place: string,
    own: number,
    overridden: number | undefined,
    ids: string[] | undefined,
    depth: number,
  ) => {
    const rowKey = `${key}:values`
    const label = `Directly in ${place}`
    return (
      <li key={rowKey}>
        <div
          className="tree-row"
          data-kind="values"
          style={{ '--_depth': depth } as never}
          title={`${label}: ${countText(own, overridden, false)}`}
        >
          {caret(rowKey, `the values directly in ${place}`, true)}
          <span className="tree-icon-space" aria-hidden="true" />
          <span className="tree-label">
            <span className="tree-name">{label}</span>
          </span>
          <span className="tree-count" aria-hidden="true">
            {countText(own, overridden, false)}
          </span>
          {ids && ids.length > 0 && (
            <button
              type="button"
              className="tree-goto"
              aria-label={`Go to the layers directly in ${place}: ${values(own)}`}
              onClick={() => onSelect(ids)}
            >
              Go to
            </button>
          )}
        </div>
        {open.has(rowKey) && leaves?.(key, owner, depth + 1)}
      </li>
    )
  }

  const ownValuesRow = (node: TreeNode, depth: number) =>
    leaves && node.own > 0
      ? valuesRow(
          node.key,
          node,
          node.name.trim(),
          node.own,
          node.ownOverridden,
          node.ownIds,
          depth,
        )
      : null

  const renderChildren = (parent: TreeNode, depth: number) => {
    const fromMain = parent.children.filter((child) => !child.inSlot)
    // Slot content under a row for its slot, one per slot, in their order:
    // the instances in it, and the values on its other layers
    const slots = new Map<string, TreeNode[]>()
    for (const child of parent.children) {
      if (!child.inSlot) continue
      const slot = child.slotName ?? 'Slot'
      slots.set(slot, [...(slots.get(slot) ?? []), child])
    }
    for (const { slot } of parent.slotValues ?? []) {
      if (!slots.has(slot)) slots.set(slot, [])
    }
    const parentName = parent.name.trim()
    return (
      <>
        {fromMain.map((child) => renderNode(child, depth))}
        {[...slots].map(([slot, inSlot]) => {
          const slotKey = slotKeyOf(parent.key, slot)
          const slotValues = leaves
            ? parent.slotValues?.find((item) => item.slot === slot)
            : undefined
          return (
            <li key={slotKey}>
              <div
                className="tree-row"
                data-kind="slot"
                style={{ '--_depth': depth } as never}
              >
                {caret(
                  slotKey,
                  `the layers in the slot ${slot} of ${parentName}`,
                  true,
                )}
                <SlotIcon />
                <span className="tree-label">
                  <span className="tree-name">{slot}</span>
                </span>
              </div>
              {open.has(slotKey) &&
                (inSlot.length > 0 ? (
                  <ul className="tree-list">
                    {slotValues &&
                      valuesRow(
                        slotKey,
                        parent,
                        slot,
                        slotValues.own,
                        undefined,
                        slotValues.ownIds,
                        depth + 1,
                      )}
                    {inSlot.map((child) => renderNode(child, depth + 1))}
                  </ul>
                ) : (
                  leaves?.(slotKey, parent, depth + 1)
                ))}
            </li>
          )
        })}
      </>
    )
  }

  const renderNode = (node: TreeNode, depth: number) => {
    const name = node.name.trim()
    const inner = hasInner(node)
    const expandable = inner || (leaves !== undefined && node.own > 0)
    const details = summary(node, legacyOnly)
    return (
      <li key={node.key}>
        <div
          className="tree-row"
          data-kind={node.kind ?? 'instance'}
          data-hidden={node.hidden || undefined}
          style={{ '--_depth': depth } as never}
          title={`${name}${node.component && node.component !== name ? `, ${node.component}` : ''}: ${details}`}
        >
          {caret(node.key, `the layers in ${name}`, expandable)}
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
            {countText(node.count, node.overridden, legacyOnly)}
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
        {expandable &&
          open.has(node.key) &&
          (inner ? (
            <ul className="tree-list">
              {ownValuesRow(node, depth + 1)}
              {renderChildren(node, depth + 1)}
            </ul>
          ) : (
            leaves?.(node.key, node, depth + 1)
          ))}
      </li>
    )
  }

  if (parent) {
    const name = parent.name.trim()
    const own = ownValuesRow(parent, 0)
    return (
      <>
        {own && (
          <ul
            className="tree-list instance-tree"
            aria-label={`Values directly in ${name}`}
          >
            {own}
          </ul>
        )}
        {hasInner(parent) && (
          <>
            <div className="tree-heading" id={`${parent.key}:inner`}>
              Inner instances
            </div>
            <ul
              className="tree-list instance-tree"
              aria-labelledby={`${parent.key}:inner`}
            >
              {renderChildren(parent, 0)}
            </ul>
          </>
        )}
      </>
    )
  }

  return (
    <ul className="tree-list instance-tree" aria-label="Instances">
      {(nodes ?? []).map((node) => renderNode(node, 0))}
    </ul>
  )
}
