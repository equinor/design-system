import { promises as fs } from 'fs'
import { BUILD_DIR, tokenType, gridResolution } from './constants.mjs'

const stepsNum = 25

const multByGrid = (num) => num * gridResolution

const steps = [...Array(stepsNum).keys()]

const template = (itemSpacing) => (steps) => ({
  [`itemSpacing${itemSpacing}`]: Object.fromEntries(
    steps
      .slice(1, 7)
      .map(multByGrid)
      .map((step) => [
        step,
        {
          value: {
            horizontalPadding: `{eds.core.spacing.step.${step}}`,
            verticalPadding: 0,
            itemSpacing,
          },
          type: tokenType.COMPOSITION,
        },
      ]),
  ),
})

const is0template = template(0)
const is4template = template(4)

const data = (steps) => ({
  eds: {
    core: {
      spacing: {
        step: Object.fromEntries(
          steps.map((step) => [
            step,
            {
              value: step.toString(),
              type: tokenType.SPACING,
            },
          ]),
        ),
        grid: Object.fromEntries(
          steps.map((step) => [
            step,
            {
              value: `{eds.core.const.grid} * {eds.core.spacing.step.${step}}`,
              type: tokenType.OTHER,
            },
          ]),
        ),
        inline: { ...is0template(steps), ...is4template(steps) },
      },
    },
  },
})

async function writeToFile() {
  await fs.writeFile(
    `${BUILD_DIR}/spacing.json`,
    JSON.stringify(data(steps), null, 2),
    {
      encoding: 'utf-8',
    },
  )
}

writeToFile()
