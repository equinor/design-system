#!/usr/bin/env node
import { main } from './main.js'

process.exitCode = main(process.argv.slice(2), {
  cwd: process.cwd(),
  out: (text) => console.log(text),
  err: (text) => console.error(text),
})
