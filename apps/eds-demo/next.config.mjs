/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // `next dev` writes an AGENTS.md into the app when it detects an AI coding
  // agent. The repository's own AGENTS.md is the one place for agent
  // conventions, so this turns the generated file off.
  agentRules: false,
}

export default nextConfig
