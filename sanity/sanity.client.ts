import { createClient } from '@sanity/client'

export const projectId = process.env.SANITY_STUDIO_API_PROJECT_ID || 'gimn8p1d'
export const dataset = process.env.SANITY_STUDIO_API_DATASET || 'production'
export const apiVersion = 'v2023-12-06'

export const sanityClient = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: false,
})
