import * as R from 'ramda'
import fetch from 'node-fetch'
import { readFile, writeFile } from './file.js'

const options = () => ({
  headers: {
    'X-Figma-Token': process.env.FIGMA_TOKEN,
  },
})
const isUnderConstrution = (x) => /^🚧/.test(x.name)

const handleResponse = (res) => {
  if (res.ok) {
    return res.json()
  } else {
    throw { status: res.status, message: res.statusText }
  }
}

export const processFigmaFile = (result) => ({
  ...result,
  pages: result.document.children.filter((x) => !isUnderConstrution(x)),
  getStyle: R.curry((styles, id) => styles[id])(result.styles),
  getComponent: R.curry((components, id) => components[id])(result.components),
})

export async function fetchFigmaFile(fileId) {
  // https://www.figma.com/developers/docs#get-files-endpoint
  const url = `https://api.figma.com/v1/files/${fileId}`
  return fetch(url, options())
    .then(handleResponse)
    .catch((error) => console.error(`Error fetching file from figma`, error))
}

export async function fetchFigmaImageUrls(fileId, ids, format = 'svg') {
  // https://www.figma.com/developers/docs#get-images-endpoint
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=${format}`
  return fetch(url, options())
    .then(handleResponse)
    .catch((error) => console.error(`Error fetching file from figma`, error))
}

export async function getFigmaFile({ fileId, force = 'false' }) {
  let data = null

  if (force === 'true') {
    console.info('Fetching new file from Figma')
    data = await fetchFigmaFile(fileId)
    writeFile('raw', fileId, 'json', `${JSON.stringify(data, null, 2)}\n`)
  } else {
    try {
      console.info('Reading local Figma file')
      data = await readFile('raw', fileId, 'json')
    } catch (error) {
      console.info(
        'Local figma file not found, fetching new file from Figma',
        error.message,
      )
      data = await fetchFigmaFile(fileId)
      writeFile('raw', fileId, 'json', `${JSON.stringify(data, null, 2)}\n`)
    }
  }

  return data
}
