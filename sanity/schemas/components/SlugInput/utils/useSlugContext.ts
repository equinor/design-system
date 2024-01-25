import { useMemo } from 'react'
import { SlugSourceContext, useCurrentUser, useDataset, useProjectId, useSchema, useClient } from 'sanity'
import { apiVersion } from '../../../../sanity.client'
/**
 * @internal
 */
export type SlugContext = Omit<SlugSourceContext, 'parent' | 'parentPath'>

/**
 * @internal
 */
export function useSlugContext(): SlugContext {
  const client = useClient({ apiVersion: apiVersion })
  const schema = useSchema()
  const currentUser = useCurrentUser()
  const projectId = useProjectId()
  const dataset = useDataset()

  return useMemo(() => {
    return {
      projectId,
      dataset,
      client,
      schema,
      currentUser,
    } as any
  }, [client, schema, currentUser, projectId, dataset])
}
