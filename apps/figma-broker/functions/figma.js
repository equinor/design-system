import * as R from 'ramda'
import fetch from 'node-fetch'

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
})

export async function fetchFigmaFile(fileId) {
  // https://www.figma.com/developers/docs#get-files-endpoint
  const url = `https://api.figma.com/v1/files/${fileId}`
  return fetch(url, options()).then(handleResponse)
}

export async function fetchFigmaImageUrls(fileId, ids) {
  // https://www.figma.com/developers/docs#get-images-endpoint
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=svg`

  return fetch(url, options()).then(handleResponse)
}
