require('dotenv').config()
const path = require('path')

const emoji = require(`remark-emoji`)

module.exports = {
  siteMetadata: {
    title: 'Equinor Design System',
    description:
      'Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.',
    author: '@chrisbiscardi',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        remarkPlugins: [emoji],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-smartypants`,
            options: {
              dashes: 'oldschool',
            },
          },
        ],
        defaultLayouts: {
          default: path.resolve('./src/components/layout.jsx'),
        },
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    'gatsby-transformer-yaml',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Equinor Design System',
        short_name: 'EDS',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#000',
        display: 'minimal-ui',
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          /* eslint-disable global-require */
          require('postcss-import'),
          require('autoprefixer'),
          require('postcss-custom-media'),
          require('postcss-nested'),
          /* eslint-enable global-require */
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-matomo',
      options: {
        siteId: '5',
        matomoUrl: 'https://matomo.sdpaks.equinor.com',
        siteUrl: 'https://eds.equinor.com/',
      },
    },
    {
      resolve: 'gatsby-plugin-styled-components',
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
