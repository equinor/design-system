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

const externalDeps = [
  /@babel\/runtime/,
  'react/jsx-runtime',
  ...Object.keys({
    ...pkg.peerDependencies,
    ...pkg.dependencies,
  }),
]

const watchConfig = {
  clearScreen: true,
  include: ['./src/**', './../tokens/**'],
}

const createPlugins = (includeDelete = false) => [
  preserveDirective(),
  ...(includeDelete ? [del({ targets: 'dist/*', runOnce: true })] : []),
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

const createEsmOutput = () => ({
  dir: 'dist/esm',
  preserveModules: true,
  preserveModulesRoot: 'src',
  format: 'es',
  sourcemap: isDevelopment,
})

export default [
  // Stable components (EDS 1.0)
  {
    input: ['./src/index.ts'],
    external: externalDeps,
    watch: watchConfig,
    plugins: createPlugins(true),
    output: [
      createEsmOutput(),
      { file: './dist/eds-core-react.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
  // Beta components (EDS 2.0)
  {
    input: ['./src/index.next.ts'],
    external: externalDeps,
    watch: watchConfig,
    plugins: createPlugins(false),
    output: [
      createEsmOutput(),
      { file: './dist/index.next.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
]
