import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import pkg from './package.json'
import commonjsPkg from './commonjs/package.json'

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: 'index.ts',
    watch: {
      clearScreen: true,
    },
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),
      resolve(),
      typescript({ useTsconfigDeclarationDir: true }),
    ],
    output: [
      {
        file: pkg.module,
        name: pkg.name,
        format: 'es',
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
