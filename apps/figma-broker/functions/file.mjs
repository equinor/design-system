import fs from 'fs'
import { createFolder } from './folder'
import fetch from 'node-fetch'

const getFilePath = (path, name, ext) => `${path}/${name}.${ext}`

const write = (file, path, name, ext) => {
  const filePath = getFilePath(path, name, ext)
  fs.writeFile(filePath, file, 'utf-8', (error) => {
    if (error) {
      throw new Error('Error in write(): ', { error, filePath })
    }
  })
}

export const writeFile = (file, path, name, ext) => {
  if (file && path && name) {
    createFolder(path)
    write(file, path, name, ext)
  } else {
    throw new Error('Missing required parameters to correctly run writeFile()!')
  }
}

export const readFile = (path, name, ext, callback) => {
  fs.readFile(getFilePath(path, name, ext), (err, data) => {
    if (err) {
      callback(err)
      return
    }
    try {
      callback(null, JSON.parse(data))
    } catch (exception) {
      callback(exception)
    }
  })
}

export const readTokens = (path) =>
  fs.readdirSync(path).map((fileName) => ({
    name: fileName.replace(/.json/, ''),
    extension: 'json',
    tokens: JSON.parse(fs.readFileSync(`${path}/${fileName}`)),
  }))

export const writeResults = (results, savePath, extension = 'json') =>
  results.forEach(({ value, name, path = '' }) =>
    writeFile(
      JSON.stringify(value, null, 4),
      `${savePath}/${path}`,
      name,
      extension,
    ),
  )

export async function writeResultsGroup(resultsGroup, savePath) {
  await resultsGroup.forEach(async function({ name, path, assetUrl }) {
    const asset = await fetchFile(assetUrl)
  })
}

export async function fetchFile(url) {
  return await fetch(url).then((res) => res.text())
}
