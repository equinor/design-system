import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: 'index.js',
    watch: {
      clearScreen: true,
    },
    plugins: [commonjs()],
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
      {
        file: pkg.browser,
        name: pkg.name,
        format: 'umd',
        exports: 'named',
      },
    ],
  },
]
