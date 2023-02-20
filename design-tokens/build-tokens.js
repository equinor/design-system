const StyleDictionary = require('style-dictionary')

const extractState = (styleObject, state, attributeName, value) => {
  const newStyleObject = { ...styleObject }

  if (!newStyleObject.states) {
    newStyleObject.states = {}
  }

  if (!newStyleObject.states[state]) {
    newStyleObject.states[state] = {}
  }

  newStyleObject.states[state] = {
    ...newStyleObject.states[state],
    [attributeName]: value,
  }

  return newStyleObject
}

const extractStyle = (variantObject, style, state, attributeName, value) => {
  const newVariantObject = { ...variantObject }

  newVariantObject[style] = extractState(
    newVariantObject[style] || {},
    state,
    attributeName,
    value,
  )

  return newVariantObject
}

StyleDictionary.registerFormat({
  name: 'js/custom',
  formatter: function (dictionary, config) {
    let styleObject = {}

    dictionary.allTokens.forEach((token) => {
      const component = token.path[1]
      const variant = token.path[2] // primary, secondary, danger, allVariants or elements
      const style = token.path[3] // filled, outlined, ghost
      const state = token.path[4] // default, hover, disabled, loading, or allStates
      const attributeName = token.path[5] // default, hover, disabled, loading

      let componentStyle

      if (variant === 'elements') {
        console.log('token', token)
        componentStyle = styleObject['common']
          ? { ...styleObject['common'] }
          : {}

        Object.entries(token.value).forEach(([key, value]) => {
          componentStyle[key] = value
        })

        styleObject[component]['common'] = componentStyle
      } else {
        componentStyle = styleObject[component]
          ? { ...styleObject[component] }
          : {}

        componentStyle[variant] = extractStyle(
          componentStyle[variant] || {},
          style,
          state,
          attributeName,
          token.value,
        )

        styleObject[component] = componentStyle
      }
    })
    return 'export const edsTokens = ' + JSON.stringify(styleObject, null, 2)
  },
})

/**
 * Generate a Config
 */
const getStyleDictionaryConfig = () => {
  console.log(`🚧 Compiling tokens`)

  return {
    source: [
      '../design-tokens/raw/component/buttonTest.json',
      '../design-tokens/build/json/shapeTest.json',
      '../design-tokens/build/json/semanticTest.json',
    ],
    platforms: {
      js: {
        transformGroup: 'js',
        buildPath: 'build/js/',
        files: [
          {
            format: 'js/custom',
            destination: `button.js`,
          },
        ],
      },
    },
  }
}

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration

StyleDictionaryExtended = StyleDictionary.extend(getStyleDictionaryConfig())

// BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms()
