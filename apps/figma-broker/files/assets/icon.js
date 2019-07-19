import { propName, formatName } from '@utils'

export const makeAssetTokens = (assets, groupName) =>
  assets
    .filter((x) => x.type === 'COMPONENT')
    .map((x) => ({
      name: propName(x.name),
      value: '',
      id: x.id,
      url: '',
      path: formatName(groupName),
      group: groupName,
    }))
