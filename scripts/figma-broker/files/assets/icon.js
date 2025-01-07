import { pathName, propName } from '../../functions/utils.js'

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
      let assets = []
      if (x.type === 'COMPONENT') {
        assets = [parseComponent(groupName, x)]
      }

      if (x.type === 'COMPONENT_SET') {
        const smallIcon = x.children.find((child) => /small/i.test(child.name))
        const defaultIcon = x.children.find((child) =>
          /default/i.test(child.name),
        )

        if (smallIcon) {
          assets = [
            parseComponent(groupName, {
              ...defaultIcon,
              name: x.name,
            }),
            parseComponent(groupName, {
              ...smallIcon,
              name: `${x.name}_small`,
            }),
          ]
        } else {
          console.error('Failed parsing component set for: ', x.name)
        }
      }

      return assets
    })
    .reduce((acc, val) => [...acc, ...val])
