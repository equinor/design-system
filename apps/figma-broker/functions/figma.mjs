import fetch from 'node-fetch'

const options = () => ({
  headers: {
    'X-Figma-Token': process.env.FIGMA_TOKEN,
  },
})
const isUnderConstrution = (x) => /^🚧/.test(x.name)

export const processFigmaFile = (result) =>
  result.document.children.filter((x) => !isUnderConstrution(x))

export async function fetchFigmaFile(fileId) {
  // https://www.figma.com/developers/docs#get-files-endpoint
  const url = `https://api.figma.com/v1/files/${fileId}`
  return await fetch(url, options()).then((res) => res.json())
}

export async function fetchFigmaImageUrls(fileId, ids) {
  // https://www.figma.com/developers/docs#get-images-endpoint
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=svg`

  return await fetch(url, options()).then((res) => res.json())
}
