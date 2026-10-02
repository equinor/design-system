import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // `next dev` otherwise writes its own agent rules into AGENTS.md/CLAUDE.md
  // in this folder on every start, which dirties the committed CLAUDE.md.
  agentRules: false,
  async redirects() {
    // The theme builder used to live at /themebuilder and its Share button
    // still emits /themebuilder?... links. Next.js preserves the query string.
    // Temporary (307) while the app is still evolving.
    return [{ source: '/themebuilder', destination: '/', permanent: false }]
  },
}

export default nextConfig
