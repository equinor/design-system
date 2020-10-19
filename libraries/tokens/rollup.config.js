import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import commonjsPkg from './commonjs/package.json'
import json from '@rollup/plugin-json'

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: 'index.ts',
    watch: {
      clearScreen: true,
    },
    plugins: [
      json(),
      resolve(),
      typescript({
        tsconfig: 'tsconfig.json',
        typescript: require('typescript'),
        include: ['*.ts+(|x)', '**/*.ts+(|x)', '*.js+(|x)', '**/*.js+(|x)'],
        exclude: ['node_modules/**'],
      }),
    ],
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
