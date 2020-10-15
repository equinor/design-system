/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import polyfill from 'rollup-plugin-polyfill'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const peerDeps = Object.keys(pkg.peerDependencies || {})

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  'styled-components': 'styled',
}

const extensions = ['.jsx', '.js', '.tsx', '.ts']

const buildForStorybook = process.env.STORYBOOK

export default [
  {
    input: './src/index.ts',
    external: peerDeps,
    watch: {
      clearScreen: true,
      include: ['./src/**', './../tokens/**'],
    },
    plugins: [
      json(),
      resolve({ extensions }),
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions,
        plugins: [
          'babel-plugin-styled-components',
          ...(buildForStorybook ? ['babel-plugin-react-docgen'] : []),
        ],
      }),
      commonjs(),
      polyfill(['focus-visible']),
    ],
    output: [
      { file: pkg.browser, name: pkg.name, format: 'umd', globals },
      {
        file: pkg.module,
        name: pkg.name,
        format: 'esm',
        sourcemap: true,
        globals,
      },
      ...(buildForStorybook ? [] : [{ file: pkg.main, format: 'cjs' }]),
    ],
  },
]
