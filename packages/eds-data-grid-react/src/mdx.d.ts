import type { JSX } from 'react'

declare module '*.mdx' {
  let MDXComponent: (props) => JSX.Element
  // eslint-disable-next-line import/no-default-export
  export default MDXComponent
}
