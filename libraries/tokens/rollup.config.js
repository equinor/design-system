import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'
import commonjsPkg from './commonjs/package.json'

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: 'index.js',
    watch: {
      clearScreen: true,
    },
    plugins: [resolve()],
    output: [
      {
        file: pkg.module,
        name: pkg.name,
        format: 'esm',
        exports: 'named',
      },
      {
        file: commonjsPkg.main.replace('../', ''),
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
