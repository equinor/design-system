require('dotenv').config()
const path = require('path')

module.exports = {
    siteMetadata: {
        title: 'Equinor Design System',
        description:
            'Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.',
        author: '@chrisbiscardi',
    },
    plugins: [
        {
            resolve: `gatsby-mdx`,
            options: {
                defaultLayouts: { default: path.resolve('./src/components/layout.js') },
                globalScope: `
                import ComponentStatus from '${__dirname}/src/components/ComponentStatus';

                export default {
                    ComponentStatus,
                }
                `
            },
        },
        'gatsby-plugin-react-helmet',
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: `${__dirname}/src/content`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`
            }
        },
        'gatsby-transformer-yaml',
        {
          resolve: `gatsby-source-filesystem`,
          options: {
            name: `data`,
            path: `${__dirname}/src/data`
          }
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: 'gatsby-default-mdx-basic',
                short_name: 'starter',
                start_url: '/',
                background_color: '#663399',
                theme_color: '#663399',
                display: 'minimal-ui',
                icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
            },
        },
        {
            resolve: `gatsby-plugin-postcss`,
            options: {
                postCssPlugins: [
                    require('postcss-import'),
                    require('autoprefixer'),
                    require('postcss-custom-media'),
                    require('postcss-nested'),
                ],
            },
        },
        {
            resolve: `gatsby-plugin-prefetch-google-fonts`,
            options: {
                fonts: [
                    {
                        family: 'Roboto',
                        variants: [ `400`, `500`, `700`, `900` ],
                    },
                ],
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ],
}
