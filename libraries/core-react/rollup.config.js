/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import del from 'rollup-plugin-delete'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

import pkg from './package.json'

const peerDeps = Object.keys(pkg.peerDependencies || {})
const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'styled-components': 'styled',
}

const extensions = ['.jsx', '.js', '.tsx', '.ts']

export default [
  {
    input: './src/index.ts',
    external: peerDeps,
    watch: {
      clearScreen: true,
      include: ['./src/**', './../tokens/**'],
    },
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),
      resolve({ extensions }),
      typescript({ useTsconfigDeclarationDir: true }),
      typescriptPaths(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions,
        plugins: ['babel-plugin-styled-components'],
      }),
      commonjs(),
      sizeSnapshot(),
    ],
    output: [
      {
        file: pkg.publishConfig.browser,
        name: pkg.name,
        format: 'umd',
        globals,
      },
      {
        file: pkg.publishConfig.module,
        name: pkg.name,
        format: 'es',
        sourcemap: isDevelopment,
        globals,
      },
      { file: pkg.publishConfig.main, format: 'cjs' },
    ],
  },
]
