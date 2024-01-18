import { PortableTextBlock } from 'sanity'

interface Block {
  _type: string
  children?: {
    text: string
  }[]
}

interface Options {
  nonTextBehavior?: 'remove' | 'keep'
}

const defaults: Options = { nonTextBehavior: 'remove' }

const blocksToText = (blocks: Block[] | PortableTextBlock[] | undefined, opts: Options = {}) => {
  const options = Object.assign({}, defaults, opts)
  if (!Array.isArray(blocks)) return blocks

  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children || !Array.isArray(block.children)) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
      }

      return block.children.map((child: { text: any }) => child.text).join('')
    })
    .join('\n\n')
}

export default blocksToText
