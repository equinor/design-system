import React, { Children } from 'react'
import type { ReactNode, RefObject } from 'react'
import type { Bindings } from './bindings'
import { TINT, cssVar } from './bindings'

type Region = 'padding-block' | 'padding-inline' | 'gap' | 'corner-radius'

/** One tinted region. `data-region` says which. */
function Strip({
  region,
  style,
}: {
  region: Region
  style: React.CSSProperties
}) {
  return (
    <span
      className="token-anatomy__strip"
      data-region={region}
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    />
  )
}

/**
 * Tints the regions a spacing token produces.
 *
 * The strips are sized from the same `var()` the specimen is padded with, so they match the
 * element exactly without anything being measured, and they follow a density change for free.
 */
export function SpacingOverlay({ bindings }: { bindings: Bindings }) {
  const block = bindings.paddingBlock?.token
  const inline = bindings.paddingInline?.token
  const radius = bindings.borderRadius?.token

  const blockLength = block ? cssVar(block) : '0px'

  return (
    <>
      {block ? (
        <>
          <Strip
            region="padding-block"
            style={{
              left: 0,
              right: 0,
              top: 0,
              height: cssVar(block),
              background: TINT.paddingBlock,
            }}
          />
          <Strip
            region="padding-block"
            style={{
              left: 0,
              right: 0,
              bottom: 0,
              height: cssVar(block),
              background: TINT.paddingBlock,
            }}
          />
        </>
      ) : null}

      {inline ? (
        <>
          <Strip
            region="padding-inline"
            style={{
              top: blockLength,
              bottom: blockLength,
              left: 0,
              width: cssVar(inline),
              background: TINT.paddingInline,
            }}
          />
          <Strip
            region="padding-inline"
            style={{
              top: blockLength,
              bottom: blockLength,
              right: 0,
              width: cssVar(inline),
              background: TINT.paddingInline,
            }}
          />
        </>
      ) : null}

      {radius ? (
        <Strip
          region="corner-radius"
          style={{
            top: 0,
            left: 0,
            width: cssVar(radius),
            height: cssVar(radius),
            borderTop: `2px dashed ${TINT.borderRadius}`,
            borderLeft: `2px dashed ${TINT.borderRadius}`,
            borderTopLeftRadius: cssVar(radius),
          }}
        />
      ) : null}
    </>
  )
}

/**
 * Wraps each child except the last so a tinted strip can sit in the flex gap.
 *
 * A gap is not a box on any element, so it cannot be tinted directly. A strip at `left: 100%` of
 * the preceding child, as wide as the gap token, occupies precisely the space the gap creates.
 */
export function SpacingContent({
  gapToken,
  stripRef,
  children,
}: {
  gapToken?: string
  stripRef?: RefObject<HTMLSpanElement | null>
  children: ReactNode
}) {
  if (!gapToken) return <>{children}</>

  const items = Children.toArray(children)

  return (
    <>
      {items.map((child, index) =>
        index === items.length - 1 ? (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>{child}</React.Fragment>
        ) : (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="token-anatomy__gap-item"
            style={{ position: 'relative', display: 'inline-flex' }}
          >
            {child}
            <span
              className="token-anatomy__strip"
              data-region="gap"
              aria-hidden="true"
              ref={index === 0 ? stripRef : undefined}
              style={{
                position: 'absolute',
                left: '100%',
                top: 0,
                bottom: 0,
                width: cssVar(gapToken),
                background: TINT.gap,
                pointerEvents: 'none',
              }}
            />
          </span>
        ),
      )}
    </>
  )
}
