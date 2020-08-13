/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')

exports.onCreateWebpackConfig = (args) => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        'styled-components': path.resolve(
          './node_modules',
          'styled-components',
        ),
        react: path.resolve('./node_modules', 'react'),
      },
    },
  })
}
