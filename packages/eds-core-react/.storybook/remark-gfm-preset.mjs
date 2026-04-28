import remarkGfm from 'remark-gfm'

export const options = async (existing = {}) => ({
  ...existing,
  mdxPluginOptions: {
    ...existing.mdxPluginOptions,
    mdxCompileOptions: {
      ...existing.mdxPluginOptions?.mdxCompileOptions,
      remarkPlugins: [
        ...(existing.mdxPluginOptions?.mdxCompileOptions?.remarkPlugins ?? []),
        remarkGfm,
      ],
    },
  },
})
