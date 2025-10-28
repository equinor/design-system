import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'

const extensions = ['.jsx', '.js', '.tsx', '.ts']

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: './src/index.ts',
    watch: {
      clearScreen: true,
    },
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),
      resolve({ extensions }),
      commonjs(),
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
        entryFileNames: '[name].mjs',
      },
      { file: './dist/tokens.cjs', format: 'cjs' },
    ],
  },
]
