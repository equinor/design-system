import { pathName, propName } from '../../functions/utils'

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
        const small = x.children.find((child) => /small/i.test(child.name))
        const normal = x.children.find((child) => /default/i.test(child.name))

        let compact, comfortable

        comfortable = parseComponent(groupName, { ...normal, name: x.name })

        if (small) {
          compact = {
            ...parseComponent(groupName, {
              ...small,
              name: `${x.name}_small`,
            }),
          }
        } else {
          console.warn('child not found for: ', x.name)
        }

        assets = [comfortable, compact]
      }

      return assets
    })
    .reduce((acc, val) => [...acc, ...val])
