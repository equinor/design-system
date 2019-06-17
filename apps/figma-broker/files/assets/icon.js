import { formatName } from '@utils'

const getChildren = (acc, x) => [...acc, ...x.children]

export const makeAssetTokens = (assets, path) =>
  assets
    .filter((x) => x.type === 'COMPONENT')
    .map((x) => ({
      name: formatName(x.name),
      value: '',
      id: x.id,
      url: '',
      path,
    }))
