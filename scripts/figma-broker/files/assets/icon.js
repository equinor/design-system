import { pathName, propName } from '../../functions/utils'
import { endsWith, not } from 'ramda'

const parseComponent = (groupName, x) => ({
  name: propName(x.name.replace('-', ' ')),
  value: '',
  id: x.id,
  url: '',
  path: pathName(groupName),
  group: groupName,
})

export const makeAssetTokens = (assets, groupName) =>
  assets
    .filter((x) => /COMPONENT|COMPONENT_SET/.test(x.type))
    .map((x) => {
      let asset = {}
      if (x.type === 'COMPONENT') {
        asset = parseComponent(groupName, x)
      }

      if (x.type === 'COMPONENT_SET') {
        const small = x.children.find((child) => /small/i.test(child.name))
        let compact
        if (small) {
          compact = {
            ...parseComponent(groupName, small),
            name: 'compact',
          }
        } else {
          console.warn('child not found for: ', x.name)
        }

        asset = {
          ...asset,
          compact,
        }
      }

      return asset
    })
