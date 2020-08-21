import childProcess from 'child_process'
import R from 'ramda'
import util from 'util'

import { fetchFigmaImageUrls } from '../functions/figma'
import { writeUrlToFile, deletePaths } from '../functions/file'
import { isNotEmpty, sleep } from '@utils'
import { PATHS, FILE_IDS } from '../constants'

export async function createFigmaImages(ctx) {
  const exec = util.promisify(childProcess.exec)
  // find all figma urls defined in storefront content files
  const { stdout, stderr } = await exec(
    `grep -rni "\\"https://www.figma" ./../storefront/docs/* | awk -F"[\\"\\"]" '{print $2}' | sed "s/.*file//"`,
  )

  if (stderr) {
    console.error(`error: ${stderr}`)
  }

  // Parse figma urls node & file id
  const imageIdsByFileId = R.pipe(
    R.split(`\n`),
    R.filter(isNotEmpty),
    R.map((line) => {
      const id = R.replace(
        '%3A',
        ':',
        R.head(R.match(/(?<=node-id=).*/g, line)),
      )
      const fileId = R.head(R.match(/[^/]+(?=\/)/g, line))
      const name = `${fileId}.${R.replace(':', '_', id)}`

      return {
        id,
        name,
        fileId,
      }
    }),
    R.groupBy(R.view(R.lensProp('fileId'))),
  )(stdout)

  // Fetch figma image url for each node id
  const imagesWithUrls = await Promise.all(
    Object.keys(imageIdsByFileId).map(async (fileId) => {
      const images = imageIdsByFileId[fileId]
      const ids = images.map((x) => x.id).toString()
      const result = await fetchFigmaImageUrls(fileId, ids, 'png')

      if (!result.err) {
        const imagesWithUrl = images.map((image) => {
          const url = result.images[image.id]

          if (!url) {
            console.log(
              `Missing url, fileId: ${image.fileId}, nodeId: ${image.id}`,
            )
          }

          return {
            ...image,
            url,
          }
        })
        return imagesWithUrl
      }
      return images
    }),
  )

  const images = R.pipe(R.values, R.flatten)(imagesWithUrls)

  // Wait for Figma to start endpoints
  await sleep(2000)

  // Reset figme images
  await deletePaths([PATHS.IMAGES], {
    force: true,
  })

  // Save content of url as file
  writeUrlToFile(images, PATHS.IMAGES, 'png')

  return images
}
