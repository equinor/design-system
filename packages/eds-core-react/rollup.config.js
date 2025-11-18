/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import'
import commonjs from '@rollup/plugin-commonjs'
import { preserveDirective } from 'rollup-preserve-directives'
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
      preserveDirective(),
      del({ targets: ['dist/*', 'build/*'], runOnce: true }),
      resolve({ extensions }),
      commonjs(),
      postcss({
        extensions: ['.css'],
        extract: false,
        inject: false,
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
      { file: './dist/eds-core-react.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
  {
    input: './src/styles.css',
    plugins: [
      postcss({
        extensions: ['.css'],
        extract: 'styles.css',
        minimize: false,
        sourceMap: false,
        plugins: [postcssImport()],
      }),
    ],
    output: {
      dir: 'build',
      format: 'es',
    },
  },
  {
    input: './src/styles.css',
    plugins: [
      postcss({
        extensions: ['.css'],
        extract: 'styles.min.css',
        minimize: true,
        sourceMap: false,
        plugins: [postcssImport()],
      }),
      del({ targets: 'build/*.js', hook: 'writeBundle' }),
    ],
    output: {
      dir: 'build',
      format: 'es',
    },
  },
]
