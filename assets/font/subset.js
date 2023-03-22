import subsetFont from 'subset-font'
import { promises as fs } from 'fs'
import bent from 'bent'

const { writeFile } = fs

const getBuffer = bent(
  'buffer',
  'https://cdn.eds.equinor.com/font/Equinor-Regular.woff',
)

const fontData = await getBuffer()

const subsetString = 'Equinor Design System'

const fontFormat = { targetFormat: 'woff' }

const subsetBuffer = await subsetFont(fontData, subsetString, fontFormat)

const css = `@font-face {
  font-family: Equinor;
  src: url(data:font/woff;charset=utf-8;base64,${subsetBuffer.toString(
    'base64',
  )}) format('woff');
  font-weight: normal;
  font-style: normal;
}`

writeFile('subset.css', css)
