import { pathName, propName } from '../../functions/utils'

export const makeAssetTokens = (assets, groupName) =>
  assets
    .filter((x) => x.type === 'COMPONENT')
    .map((x) => ({
      name: propName(x.name.replace('-', ' ')),
      value: '',
      id: x.id,
      url: '',
      path: pathName(groupName),
      group: groupName,
    }))
