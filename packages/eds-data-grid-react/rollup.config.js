/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'

import pkg from './package.json' with { type: 'json' }

const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

const extensions = ['.jsx', '.js', '.tsx', '.ts']

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
      babel({
        babelHelpers: 'runtime',
        extensions,
        rootMode: 'upward',
      }),
    ],
    output: [
      {
        // Output .js, not .mjs — see ADR-0003
        dir: 'dist/esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        format: 'es',
        sourcemap: isDevelopment,
      },
      {
        file: './dist/eds-data-grid-react.cjs',
        format: 'cjs',
        interop: 'auto',
      },
    ],
  },
]
