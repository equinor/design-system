// Need to deploy using CLI
import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './sanity.client'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
