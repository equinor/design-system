/**
 * Inert stand-in for `@storybook/addon-docs/blocks`.
 *
 * Story files pulled in by the portable-stories registry (see
 * ../components/StoryCanvas/stories.ts) reach the shared
 * `packages/eds-core-react/.storybook/components` barrel, which re-exports a
 * couple of docs-only helpers built on Storybook's docs blocks. Those blocks
 * need a Storybook docs context that does not exist here, and they drag
 * Storybook's manager internals into the site bundle. The stories the docs
 * render only ever use `Stack` from that barrel, so the blocks are replaced
 * with no-ops via a webpack alias in docusaurus.config.ts.
 */
import type { ReactNode } from 'react'

const emptyBlock = () => null

export const Story = emptyBlock
export const Unstyled = ({ children }: { children?: ReactNode }) => children
export const Canvas = emptyBlock
export const Controls = emptyBlock
export const Description = emptyBlock
export const Meta = emptyBlock
export const Primary = emptyBlock
export const Source = emptyBlock
export const Stories = emptyBlock
export const Subtitle = emptyBlock
export const Title = emptyBlock
export const Typeset = emptyBlock
