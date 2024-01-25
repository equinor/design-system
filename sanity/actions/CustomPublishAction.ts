import { useState } from 'react'
import {
  DocumentActionComponent,
  DocumentActionConfirmDialogProps,
  DocumentActionDescription,
  DocumentActionProps,
  DocumentActionsContext,
  SanityClient,
} from 'sanity'
import { dataset, apiVersion } from '../sanity.client'
import { useToast } from '@sanity/ui'

const projectId = import.meta.env.SANITY_STUDIO_API_PROJECT_ID || 'h61q9gi9'
/** Secret site already exposes the mutation token. So we can reuse it instead. */
const token = import.meta.env.SANITY_STUDIO_HISTORY_API_TOKEN || import.meta.env.SANITY_STUDIO_MUTATION_TOKEN

const FIRST_PUBLISHED_AT_FIELD_NAME = 'firstPublishedAt'

const requiresConfirm = ['news', 'localNews']
const requiresFirstPublished = ['news', 'localNews', 'magazine']

const shouldAddFirstPublishedAt = async (props: DocumentActionProps) => {
  if (!requiresFirstPublished.includes(props.type)) return false
  let error = false
  // https://github.com/sanity-io/sanity/issues/2179
  const revisions = await fetch(
    `https://${projectId}.api.sanity.io/${apiVersion}/data/history/${dataset}/transactions/${props.id}?excludeContent=true`,
    {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    },
  )
    .then((res) => res.text())
    .catch((err: Error) => {
      console.error(err)
      error = true
    })

  if (error) throw 'Failed retrieving history of document.'

  const hasBeenPublished = !!revisions

  return !hasBeenPublished || !props.published?.[FIRST_PUBLISHED_AT_FIELD_NAME]
}

const addFirstPublishedAtField = async (id: string, client: SanityClient) => {
  await client
    .patch(id)
    .set({ [FIRST_PUBLISHED_AT_FIELD_NAME]: new Date().toISOString() })
    .commit()
    .catch((e) => {
      throw e
    })
}

export function createCustomPublishAction(originalAction: DocumentActionComponent, context: DocumentActionsContext) {
  const client = context.getClient({ apiVersion: apiVersion })
  return (props: DocumentActionProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const originalResult = originalAction(props as DocumentActionProps) as DocumentActionDescription
    const toast = useToast()

    const handlePublish = async () => {
      try {
        if (await shouldAddFirstPublishedAt(props)) {
          await addFirstPublishedAtField(props.draft?._id || props.id, client)
        }
        originalResult.onHandle && originalResult.onHandle()
      } catch (e) {
        console.error(e)
        toast.push({
          duration: 7000,
          status: 'error',
          title: 'Failed to publish, you probably miss the mutation token. Check console for details.',
        })
        setDialogOpen(false)
      }
    }

    const confirmationBox = requiresConfirm.includes(props.type)
      ? {
          onHandle: () => {
            setDialogOpen(true)
          },
          dialog:
            dialogOpen &&
            props.draft &&
            ({
              type: 'confirm',
              onCancel: () => {
                props.onComplete()
                setDialogOpen(false)
              },
              onConfirm: handlePublish,
              message: 'Are you sure you want to publish?',
            } as DocumentActionConfirmDialogProps),
        }
      : {}

    return {
      ...originalResult,
      onHandle: handlePublish,
      ...confirmationBox,
    }
  }
}
