const remarkEmoji = require('remark-emoji')

module.exports = {
  siteMetadata: {
    title: `Equinor Design System`,
    author: 'EDS Core team',
    description:
      'The EDS is the official design system of Equinor The EDS provides structure, guidance and tools that enable designers and developers to efficiently build consistent, inclusive and flexible solutions.',
    image: '/eds-logo.png',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        // Note: these options are here instead of in doczrc.js
        // because of this bug: https://github.com/doczjs/docz/issues/1191
        mdPlugins: [remarkEmoji],
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
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
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: `gatsby-plugin-algolia-docsearch`,
      options: {
        apiKey: '73fc0edd06a8031c699edfc560eaa013',
        indexName: 'equinor_design-system',
        inputSelector: '#search', // required
        debug: true, // (bool) Optional. Default `false`
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        displayName: false,
      },
    },
    {
      resolve: 'gatsby-plugin-load-script',
      options: {
        src: '/focus-visible.min.js', // Change to the script filename
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
