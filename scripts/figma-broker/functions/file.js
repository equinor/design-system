import fs from 'fs'
import { deleteAsync } from 'del'
import fetch from 'node-fetch'
import * as R from 'ramda'
import { createFolder } from './folder.js'
//import prettier from 'prettier'

//const prettierConfig = fs.readFileSync('./../../.prettierrc.yaml', 'utf8')
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
  try {
    if (file && path && name && ext) {
      createFolder(path)
      let value = file

      if (ext === 'js' || ext === 'ts') {
        /* prettier "resolveConfig" and "format" was made async in v3
        @todo rewrite this and the cascade of other functions using it to async.
        In the meantime autoformat packages\eds-icons\src\data.ts with vsCode instead */
        //const options = await prettier.resolveConfig(prettierConfig)
        //value = await prettier.format(file, { ...options, parser: 'babel' })
      }

      write(value, path, name, ext)
    } else {
      throw new Error(
        'Missing required parameters to correctly run writeFile()!',
      )
    }
  } catch (error) {
    console.error('Failed writing file: ', error.message)
  }
}

export const curriedWriteFile = R.curry(writeFile)

export async function readFile(path, name, ext) {
  const data = await fs.promises.readFile(getFilePath(path, name, ext), {
    encoding: 'utf8',
  })
  return Promise.resolve(JSON.parse(data))
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
      case 'ts':
      case 'js':
        writeFileToDisk(
          `export const ${name} = ${JSON.stringify(value, null, 2)}\n`,
        )
        break

      case 'json':
        writeFileToDisk(`${JSON.stringify(value, null, 2)}\n`)
        break

      default:
        writeFileToDisk(`${value}\n`)
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

export const deletePaths = deleteAsync
