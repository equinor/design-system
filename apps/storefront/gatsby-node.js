const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)
const { copy } = require('fs-extra')
const { graphql } = require('gatsby')

let gatsbyNodeModules = require('fs').realpathSync('node_modules/gatsby')
gatsbyNodeModules = require('path').resolve(gatsbyNodeModules, '..')

// Method that creates nodes based on the file system that we can use in our templates
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // If the node type (file) is a markdown file
  if (node.internal.type === 'Mdx') {
    const dir = path.resolve(__dirname, '')
    const fileNode = getNode(node.parent)
    const slug = createFilePath({
      node,
      getNode,
      basePath: `content`,
      trailingSlash: false,
    })

    const currentPage = slug.split('/').pop()
    const currentCategory =
      slug
        .split('/')
        .filter((item) => item.length > 0)
        .shift() || 'homepage'

    console.log('currentPage', currentPage)
    console.log('currentCategory', currentCategory)

    // example
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })

    // example: react
    createNodeField({
      node,
      name: `currentPage`,
      value: currentPage,
    })

    createNodeField({
      node,
      name: `currentCategory`,
      value: currentCategory,
    })
  }
}

// Method that creates the pages for our website
exports.createPages = async ({ actions, graphql }) => {
  const { createRedirect, createPage } = actions

  const result = await graphql(`
    {
      allMdx {
        edges {
          node {
            fields {
              slug
              currentPage
              currentCategory
            }
            frontmatter {
              tabs
            }
          }
        }
      }
    }
  `)

  const pages = result.data.allMdx.edges

  pages.map(({ node }) => {
    const slug = node.fields.slug
    const currentPage = node.fields.currentPage
    const tabs = node.frontmatter.tabs === null ? [] : node.frontmatter.tabs

    /**
     * index-pages are called the same as the folder, this removes the last segment
     * so /resources/resources.mdx becomes /resources/
     */
    const currentPath =
      node.frontmatter.tabs === null
        ? slug.slice(0, slug.lastIndexOf(currentPage))
        : slug

    createPage({
      path: currentPath,
      component: path.resolve(`./src/templates/page.jsx`),
      context: {
        slug,
        currentPage,
      },
    })

    /* we have tabs */
    if (tabs.length > 1) {
      const indexFilename = tabs[0]
        .toLowerCase()
        .split(' ')
        .join('-')
      const isIndex = currentPath.lastIndexOf(indexFilename) > 0

      if (isIndex) {
        const pathToParentDir = currentPath.slice(
          0,
          currentPath.lastIndexOf(indexFilename),
        )

        /* create index page for category */
        createPage({
          path: pathToParentDir,
          component: path.resolve(`./src/templates/page.jsx`),
          context: {
            slug,
            currentPage: `${pathToParentDir}${indexFilename}`,
          },
        })

        /**
         * Redirects from parent directory to the first page in tab-group.
         * The first redirect with trailing slash, the second without
         */
        // createRedirect({
        //   fromPath: `${pathToParentDir}`,
        //   redirectInBrowser: true,
        //   toPath: `${pathToParentDir}${indexFilename}`,
        // });

        // createRedirect({
        //   fromPath: `${pathToParentDir.slice(0, pathToParentDir.length - 1)}`,
        //   redirectInBrowser: true,
        //   toPath: `${pathToParentDir}${indexFilename}`,
        // });
      }
    }
  })
}
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: { $components: path.resolve(__dirname, 'src/components') },
      modules: [gatsbyNodeModules, 'node_modules'],
    },
  })
}
