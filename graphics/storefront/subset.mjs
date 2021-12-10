/* @TODO: Create stream from cdn so we don’t have to download the font-file first */

import subsetFont from 'subset-font'
import { promises as fs } from 'fs'

const { readFile, writeFile } = fs

const font = await readFile('./Equinor-Regular.woff')

const subsetBuffer = await subsetFont(font, 'Equinor Design System', {
  targetFormat: 'woff',
})

const css = `@font-face {
  font-family: Equinor;
  src: url(data:font/woff;charset=utf-8;base64,${subsetBuffer.toString(
    'base64',
  )}) format('woff');
  font-weight: normal;
  font-style: normal;
}`

const writeToDisk = await writeFile('subset.css', css)

await writeToDisk
