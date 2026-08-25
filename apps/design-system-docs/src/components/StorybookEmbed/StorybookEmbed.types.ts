export type StorybookEmbedProps = {
  /** Storybook story id, e.g. `eds-2-0-beta-icon--introduction`. */
  id: string
  /** Iframe height in px (number) or any CSS length (string). Defaults to 88. */
  height?: number | string
  /** Accessible title for the embed. Defaults to the story id. */
  title?: string
  /**
   * Render a "View in Storybook" link under the embed, derived from `id` —
   * replaces the hand-written markdown links that had to repeat the story id.
   */
  showLink?: boolean
}
