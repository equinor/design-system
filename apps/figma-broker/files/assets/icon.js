import { pathName, propName } from '@utils'

export const makeAssetTokens = (assets, groupName) =>
  assets
    .filter((x) => x.type === 'COMPONENT')
    .map((x) => ({
      name: propName(x.name),
      value: '',
      id: x.id,
      url: '',
      path: pathName(groupName),
      group: groupName,
    }))
