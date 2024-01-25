'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const express = require('express')
const fallback = require('express-history-api-fallback')

const port = process.env.PORT || 3333
const rootDir = process.env.ROOT_DIR || path.join(__dirname, 'dist')

const app = express()
app.use(express.static(rootDir))
app.use(fallback('index.html', { root: rootDir }))

const server = app.listen(port, function () {
  console.log('Sanity studio listening on http://localhost:' + port)
})

module.exports = server
