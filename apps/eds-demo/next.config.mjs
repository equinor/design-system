/** @type {import('next').NextConfig} */
const nextConfig = {
  // A static site in out/, so the demo can be hosted anywhere without a
  // server. Every page is a folder with an index.html (trailingSlash), which
  // static hosts such as Azure Blob storage serve without extra rules.
  output: 'export',
  trailingSlash: true,
  // Set NEXT_PUBLIC_BASE_PATH when the demo is served from a sub-path, for
  // example /demo.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  devIndicators: false,
  // `next dev` writes an AGENTS.md into the app when it detects an AI coding
  // agent. The repository's own AGENTS.md is the one place for agent
  // conventions, so this turns the generated file off.
  agentRules: false,
}

export default nextConfig
