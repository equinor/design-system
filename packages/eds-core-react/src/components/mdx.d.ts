import type { JSX } from 'react'

declare module '*.mdx' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MDXComponent: (props: any) => JSX.Element
  // eslint-disable-next-line import/no-default-export
  export default MDXComponent
}
