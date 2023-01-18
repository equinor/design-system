import { promises as fs } from 'fs'
import { PATHS } from '../figma-broker/constants.js'
import { gridResolution } from './constants.mjs'

const density = {
  TIGHT: 'tight',
  COMPRESSED: 'compressed',
  COMFORTABLE: 'comfortable',
  RELAXED: 'relaxed',
}

const numOfTypeScaleSteps = 10
const BUILD_DIR = `${PATHS.FIGMA}/readonly`

const typeScale = [...Array(numOfTypeScaleSteps).keys()] // [0, 1, ... 9]

const spreadToGrid = (num) => num * gridResolution

const spacing = [...Array(7).keys()].map(spreadToGrid) // [0, 4, 8, ... 24]

const type = {
  COMPOSITION: 'composition',
}

const verticalSnapped = (density, spacing, typeScale) => ({
  paddingBottom: `roundTo(${spacing} - ({eds.core.lineHeight.${density}.${typeScale}} - {eds.core.capHeight.rounded.${typeScale}}) / 2)`,
  paddingTop: `${spacing} * 2 + {eds.core.const.grid} * ceil({eds.core.capHeight.rounded.${typeScale}} / {eds.core.const.grid}) - {eds.core.lineHeight.${density}.${typeScale}} - roundTo(${spacing} - ({eds.core.lineHeight.${density}.${typeScale}} - {eds.core.capHeight.rounded.${typeScale}}) / 2)`,
  horizontalPadding: '0',
})

const verticalCentered = (density, spacing, typeScale) => ({
  paddingBottom: `(${spacing} * 2 + {eds.core.capHeight.snappedToGrid.${typeScale}} - {eds.core.lineHeight.${density}.${typeScale}}) / 2`,
  paddingTop: `(${spacing} * 2 + {eds.core.capHeight.snappedToGrid.${typeScale}} - {eds.core.lineHeight.${density}.${typeScale}}) / 2`,
  horizontalPadding: '0',
})

const template = (density, snapped, vertSpace, typeScale) => ({
  value: {
    ...(snapped
      ? verticalSnapped(density, vertSpace, typeScale)
      : verticalCentered(density, vertSpace, typeScale)),
    typography: `{eds.core.typography.${density}.${typeScale}}`,
    itemSpacing: 0,
  },
  type: type.COMPOSITION,
})

const createTokens = (snapped) => (density, vertSpace, typeScale) =>
  Object.fromEntries(
    spacing
      .slice(3, 5)
      .map((vertSpace) => [
        `verticalPadding${vertSpace}`,
        Object.fromEntries(
          typeScale.map((type) => [
            `${type}`,
            template(density, snapped, vertSpace, type),
          ]),
        ),
      ]),
  )

const createOnGridTokens = createTokens(true)
const createOffGridTokens = createTokens(false)

const data = (density, spacing, typeScale) => ({
  eds: {
    core: {
      spacing: {
        block: {
          [density]: {
            onGrid: createOnGridTokens(density, spacing, typeScale),
            offGrid: createOffGridTokens(density, spacing, typeScale),
          },
        },
      },
    },
  },
})

const writeToFile = (spacing) => (typeScale) => async (density) => {
  await fs.writeFile(
    `${BUILD_DIR}/${density}.json`,
    JSON.stringify(data(density, spacing, typeScale), null, 2),
    {
      encoding: 'utf-8',
    },
  )
}

const writeTokensToFile = writeToFile(spacing)(typeScale)

writeTokensToFile(density.TIGHT)
writeTokensToFile(density.COMPRESSED)
// writeToFile(density.COMFORTABLE)
// writeToFile(density.RELAXED)
