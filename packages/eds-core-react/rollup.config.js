/* eslint-disable import/no-default-export */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import'
import commonjs from '@rollup/plugin-commonjs'
import { preserveDirective } from 'rollup-preserve-directives'
import { babel } from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'

import pkg from './package.json' with { type: 'json' }

const environment = process.env.NODE_ENV

const isDevelopment = environment === 'development'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

const resolveCssImport = (id, basedir) => {
  try {
    return require.resolve(id, {
      paths: [
        basedir,
        path.resolve(__dirname, 'node_modules'),
        path.resolve(process.cwd(), 'node_modules'),
      ],
    })
  } catch {
    return path.resolve(basedir, id)
  }
}

const createPostcssImportPlugin = () =>
  postcssImport({
    resolve: resolveCssImport,
  })

const extensions = ['.jsx', '.js', '.tsx', '.ts']

const externalDeps = [
  /@babel\/runtime/,
  'react/jsx-runtime',
  ...Object.keys({
    ...pkg.peerDependencies,
    ...pkg.dependencies,
  }),
]

const watchConfig = {
  clearScreen: true,
  include: ['./src/**', './../tokens/**'],
}

const createPlugins = (includeDelete = false) => [
  preserveDirective(),
  ...(includeDelete
    ? [del({ targets: ['dist/*', 'build/*'], runOnce: true })]
    : []),
  resolve({ extensions }),
  commonjs(),
  postcss({
    extensions: ['.css'],
    extract: false,
    inject: false,
  }),
  babel({
    babelHelpers: 'runtime',
    extensions,
    rootMode: 'upward',
  }),
]

const createEsmOutput = (dir = 'dist/esm') => ({
  dir,
  preserveModules: true,
  preserveModulesRoot: 'src',
  format: 'es',
  sourcemap: isDevelopment,
})

export default [
  // Stable components (EDS 1.0)
  {
    input: ['./src/index.ts'],
    external: externalDeps,
    watch: watchConfig,
    plugins: createPlugins(true),
    output: [
      createEsmOutput(),
      { file: './dist/eds-core-react.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
  // Beta components (EDS 2.0)
  // Output to separate directory to prevent overwriting shared files from main bundle
  {
    input: ['./src/index.next.ts'],
    external: externalDeps,
    watch: watchConfig,
    plugins: createPlugins(false),
    output: [
      createEsmOutput('dist/esm-next'),
      { file: './dist/index.next.cjs', format: 'cjs', interop: 'auto' },
    ],
  },
  // EDS 2.0 CSS bundle (unminified)
  {
    input: './src/components/next/index.css',
    plugins: [
      del({ targets: 'build/*', runOnce: true }),
      postcss({
        extensions: ['.css'],
        extract: 'index.css',
        minimize: false,
        sourceMap: false,
        plugins: [createPostcssImportPlugin()],
      }),
    ],
    output: { dir: 'build', format: 'es' },
  },
  // EDS 2.0 CSS bundle (minified)
  {
    input: './src/components/next/index.css',
    plugins: [
      postcss({
        extensions: ['.css'],
        extract: 'index.min.css',
        minimize: true,
        sourceMap: false,
        plugins: [createPostcssImportPlugin()],
      }),
      // Clean up generated JS files - only CSS output is needed
      del({ targets: 'build/*.js', hook: 'writeBundle' }),
    ],
    output: { dir: 'build', format: 'es' },
  },
]
