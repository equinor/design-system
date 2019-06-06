import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const peerDeps = Object.keys(pkg.peerDependencies || {})

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    external: peerDeps,
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve({
        extensions: ['.jsx'],
      }),
      commonjs(),
    ],
  },
  {
    input: 'src/index.js',
    external: peerDeps,
    plugins: [
      resolve({
        extensions: ['.jsx'],
      }),
      commonjs(),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
]
