import fs from 'fs'
import del from 'del'
import fetch from 'node-fetch'
import R from 'ramda'
import { createFolder } from './folder'
import prettier from 'prettier'

const prettierConfig = fs.readFileSync('./../../.prettierrc.yaml', 'utf8')
const getFilePath = (path, name, ext) => `${path}/${name}.${ext}`

const write = (file, path, name, ext) => {
  const filePath = getFilePath(path, name, ext)
  fs.writeFile(filePath, file, 'utf-8', (error) => {
    if (error) {
      throw new Error('Error in write(): ', { error, filePath })
    }
  })
}

const stream = (url, path, name, ext) =>
  fetch(url).then((res) => {
    const filePath = getFilePath(path, name, ext)
    var file = fs.createWriteStream(filePath)
    res.body.pipe(file)
  })

export const writeFileStream = (url, path, name, ext) => {
  if (url && path && name) {
    createFolder(path)
    stream(url, path, name, ext)
  } else {
    throw new Error(
      'Missing required parameters to correctly run writeFileStream()!',
    )
  }
}
export const writeFile = (path, name, ext, file) => {
  if (file && path && name && ext) {
    createFolder(path)
    let value = file

    if (ext === 'js') {
      const options = prettier.resolveConfig.sync(prettierConfig)
      value = prettier.format(file, options)
    }

    write(value, path, name, ext)
  } else {
    throw new Error('Missing required parameters to correctly run writeFile()!')
  }
}

export const curriedWriteFile = R.curry(writeFile)

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
  results.forEach(({ value, name, path = '' }) => {
    const writeFileToDisk = curriedWriteFile(
      `${savePath}/${path}`,
      name,
      extension,
    )

    switch (extension) {
      case 'js':
        writeFileToDisk(
          `export const ${name} = ${JSON.stringify(value, null, 2)}\n`,
        )
        break

      case 'json':
        writeFileToDisk(`${JSON.stringify(value, null, 2)}\n`)
        break

      default:
        writeFileToDisk(value)
    }
  })

export const writeResultsIndividually = (
  results,
  savePath,
  extension = 'json',
) => {
  results.forEach(({ value, name }) => {
    writeResults(value, `${savePath}/${name}`, extension)
  })
}

export async function fetchFile(url) {
  return fetch(url).then((res) => res.text())
}

export const writeUrlToFile = (results, savePath, extension = 'json') =>
  results.forEach(({ url, name, path = '' }) => {
    if (url) {
      writeFileStream(url, `${savePath}/${path}`, name, extension)
    }
  })

export const deletePaths = del
