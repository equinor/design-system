/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import { preserveDirective } from 'rollup-preserve-directives'
import { babel } from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'

import pkg from './package.json' with { type: 'json' }

const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

const extensions = ['.jsx', '.js', '.tsx', '.ts']

// Shared configuration
const external = [
  /@babel\/runtime/,
  'react/jsx-runtime',
  ...Object.keys({
    ...pkg.peerDependencies,
    ...pkg.dependencies,
  }),
]

const watch = {
  clearScreen: true,
  include: ['./src/**', './../tokens/**'],
}

const getPlugins = (additionalPlugins = []) => [
  preserveDirective(),
  ...additionalPlugins,
  resolve({ extensions }),
  commonjs(),
  postcss({
    extensions: ['.css'],
    extract: false,
  }),
  babel({
    babelHelpers: 'runtime',
    extensions,
    rootMode: 'upward',
  }),
]

const getOutput = (cjsFile) => [
  {
    dir: 'dist/esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
    format: 'es',
    sourcemap: isDevelopment,
  },
  { file: cjsFile, format: 'cjs', interop: 'auto' },
]

export default [
  {
    input: ['./src/index.ts'],
    external,
    watch,
    plugins: getPlugins([del({ targets: 'dist/*', runOnce: true })]),
    output: getOutput('./dist/eds-core-react.cjs'),
  },
  {
    input: ['./src/index.next.ts'],
    external,
    watch,
    plugins: getPlugins(),
    output: getOutput('./dist/index.next.cjs'),
  },
]
