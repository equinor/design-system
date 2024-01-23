const StyleDictionary = require('style-dictionary')

const addValues = (styleObject, path, value, type) => {
  const newStyleObject = { ...styleObject }

  if (path.length > 0) {
    newStyleObject[path[0]] = addValues(
      styleObject[path[0]] || {},
      path.slice(1),
      value,
      type,
    )
    return newStyleObject
  } else {
    return value
  }
}

StyleDictionary.registerFormat({
  name: 'json/resolve-composition',
  formatter: function (dictionary, config) {
    let styleObject = {}

    dictionary.allTokens.forEach((token) => {
      const { path, value, type } = token

      styleObject = {
        ...styleObject,
        ...addValues(styleObject, path, value, type),
      }
    })

    return JSON.stringify(styleObject, null, 2)
  },
})

/**
 * Generate a Config
 */
const getStyleDictionaryConfig = () => {
  console.log(`🚧 Resolving compositions`)

  return {
    source: [
      '../design-tokens/raw/semantic/semanticTest.json',
      '../design-tokens/raw/semantic/shapeTest.json',
    ],
    platforms: {
      json: {
        buildPath: 'build/json/',
        files: [
          {
            format: 'json/resolve-composition',
            destination: 'semanticTest.json',
          },
          {
            format: 'json/resolve-composition',
            destination: 'shapeTest.json',
          },
        ],
      },
    },
  }
}

StyleDictionaryExtended = StyleDictionary.extend(getStyleDictionaryConfig())
StyleDictionaryExtended.buildAllPlatforms()
