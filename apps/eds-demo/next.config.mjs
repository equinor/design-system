import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  devIndicators: false,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Without options
      "remark-gfm",
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
