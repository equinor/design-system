// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_API_PROJECT_ID: string
  readonly SANITY_STUDIO_MUTATION_TOKEN: string
  readonly SANITY_STUDIO_PROJECT_URL: string
  readonly SANITY_STUDIO_API_DATASET: string
  readonly SANITY_STUDIO_API_TOKEN: string
  readonly SANITY_API_TOKEN: string
  readonly SANITY_STUDIO_BRANDMASTER_URL: string
  readonly SANITY_STUDIO_PREVIEW_SECRET: string
  readonly SANITY_STUDIO_BRANDMASTER_PLUGIN_SOURCE: string
  readonly SANITY_STUDIO_HISTORY_API_TOKEN: string
  // more env variables...
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
