export type StorybookEmbedProps = {
  /** Storybook story id, e.g. `eds-2-0-beta-icon--introduction`. */
  id: string
  /** Iframe height in px (number) or any CSS length (string). Defaults to 88. */
  height?: number | string
  /** Accessible title for the embed. Defaults to the story id. */
  title?: string
}
