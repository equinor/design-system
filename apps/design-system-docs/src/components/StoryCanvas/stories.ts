import { composeStories } from '@storybook/react'

import * as ButtonStories from '@eds-core-react-src/components/next/Button/Button.stories'

/**
 * Portable-stories registry (pilot). Each entry composes a component's actual
 * CSF story file from eds-core-react source into render-ready React
 * components — the same stories Storybook shows, with args and decorators
 * applied. Renaming or removing a story becomes a docs build error instead of
 * a silently broken iframe.
 */
export const storyRegistry = {
  Button: composeStories(ButtonStories),
} as const

export type StoryRegistry = typeof storyRegistry
