/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import polyfill from 'rollup-plugin-polyfill'
import pkg from './package.json'

const peerDeps = Object.keys(pkg.peerDependencies || {})

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  'styled-components': 'styled',
}

const buildForStorybook = process.env.STORYBOOK

export default [
  {
    input: 'src/index.js',
    external: peerDeps,
    watch: {
      clearScreen: true,
      include: ['./src/**', './../tokens/**'],
    },
    plugins: [
      json(),
      resolve({ extensions: ['.jsx', '.js'] }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react'],
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
        sourcemap: 'inline',
        globals,
      },
      ...(buildForStorybook ? [] : [{ file: pkg.main, format: 'cjs' }]),
    ],
  },
]
