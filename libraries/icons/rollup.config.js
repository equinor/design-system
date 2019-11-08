import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import svg from 'rollup-plugin-svg'
import pkg from './package.json'

export default [
  {
    input: 'index.js',
    watch: {
      clearScreen: true,
    },
    plugins: [
      resolve({
        extensions: ['.svg'],
      }),
      commonjs(),
      svg(),
    ],
    output: [
      {
        file: pkg.module,
        name: pkg.name,
        format: 'esm',
        exports: 'named',
      },
      {
        file: pkg.main,
        name: pkg.name,
        format: 'cjs',
        exports: 'named',
      },
    ],
  },
]
