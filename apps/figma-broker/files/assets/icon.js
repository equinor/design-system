import { formatName } from '@utils'

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
