/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

import pkg from './package.json'

const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

const extensions = ['.jsx', '.js', '.tsx', '.ts']

const del = require('rollup-plugin-delete').default

export default [
  {
    input: ['./src/index.ts'],
    external: [
      /@babel\/runtime/,
      'react/jsx-runtime',
      ...Object.keys({
        ...pkg.peerDependencies,
        ...pkg.dependencies,
      }),
    ],
    watch: {
      clearScreen: true,
      include: ['./src/**', './../tokens/**'],
    },
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),
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
    ],
    output: [
      {
        dir: 'dist/esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        format: 'es',
        sourcemap: isDevelopment,
      },
      { file: './dist/eds-lab-react.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
]
