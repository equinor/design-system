/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import pkg from './package.json'
import createStyledComponentsTransformer from 'typescript-plugin-styled-components'

const styledComponentsTransformer = createStyledComponentsTransformer()

const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

const extensions = ['.jsx', '.js', '.tsx', '.ts']

export default [
  {
    input: ['./src/index.ts'],
    external: [
      /@babel\/runtime/,
      'react/jsx-runtime',
      ...Object.keys({
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
        ...pkg.dependencies,
      }),
    ],
    watch: {
      clearScreen: true,
      include: ['./src/**', './../tokens/**'],
    },
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),
      resolve({ extensions }),
      typescript({
        useTsconfigDeclarationDir: true,
        // transformers: [
        //   () => ({
        //     before: [styledComponentsTransformer],
        //   }),
        // ],
      }),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions,
        plugins: [
          'babel-plugin-styled-components',
          '@babel/plugin-transform-runtime',
        ],
      }),
    ],
    output: [
      {
        dir: 'dist/esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        format: 'es',
        sourcemap: isDevelopment,
      },
      { file: pkg.publishConfig.main, format: 'cjs' },
    ],
  },
]
