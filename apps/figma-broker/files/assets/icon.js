import { pathName, propName } from '../../functions/utils'
import { endsWith, not } from 'ramda'
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
    .filter((icon) => not(endsWith('__compact', icon.name)))
