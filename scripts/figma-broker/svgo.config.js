/**
 * @type {import('svgo').Config}
 */
export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill)',
      },
    },
  ],
}
