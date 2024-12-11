/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import { preserveDirective } from 'rollup-preserve-directives'
import { babel } from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import pkg from './package.json'

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
      { file: './dist/eds-core-react.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
]
