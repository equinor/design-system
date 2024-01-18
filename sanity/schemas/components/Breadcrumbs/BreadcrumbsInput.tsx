import { useEffect, useState } from 'react'
import { MemberField, useClient, useFormValue } from 'sanity'
import type { Reference, SlugValue, ObjectInputProps } from 'sanity'
import { Text, Card, Grid, Stack } from '@sanity/ui'
import { BreadcrumbsPreview } from './BreadcrumbsPreview'
import { getObjectMemberField } from '../utils/getObjectMemberField'
import { constructBreadcrumbs } from './utils/constructBreadcrumbs'
import { apiVersion } from '../../../sanity.client'

type BreadCrumbsInputProps = {
  value?: Reference[]
} & ObjectInputProps

export const BreadcrumbsInput = (props: BreadCrumbsInputProps) => {
  const { value, members, renderField, renderInput, renderItem, renderPreview } = props

  const client = useClient({ apiVersion: apiVersion })
  const slug = useFormValue([`slug`]) as SlugValue
  const parent = useFormValue([`parent`]) as Reference

  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [defaultBreadcrumbs, setDefaultBreadcrumbs] = useState<string[]>(
    constructBreadcrumbs('home', slug?.current || ''),
  )

  useEffect(() => {
    if (slug?.current) {
      setDefaultBreadcrumbs(constructBreadcrumbs('home', slug.current))
    }
  }, [slug, parent, setDefaultBreadcrumbs])

  useEffect(() => {
    const resolveReferences = async (references: Reference[]) => {
      if (!slug.current) return false

      const query = `*[_id in $refs]{ _id, "slug": slug.current }`
      const params = { refs: references.map((ref: Reference) => ref._ref) }

      const results = await client.fetch(query, params)

      if (results && results.length > 0) {
        const orderedResults = references.map((i: Reference) =>
          results.find((j: { _id: string; slug: string }) => j._id === i._ref),
        )

        return setBreadcrumbs(
          constructBreadcrumbs(
            'home',
            slug.current,
            orderedResults.map((item: { slug: string }) => item.slug),
          ),
        )
      }

      return setBreadcrumbs(defaultBreadcrumbs)
    }

    if (value) {
      if (value?.useCustomBreadcrumbs && value?.customBreadcrumbs) {
        const { customBreadcrumbs } = value

        if (customBreadcrumbs.length == 0) return setBreadcrumbs(defaultBreadcrumbs)

        resolveReferences(customBreadcrumbs)
        return
      }
      setBreadcrumbs(defaultBreadcrumbs)
    }
  }, [value, slug, defaultBreadcrumbs])

  const enableBreadcrumbs = getObjectMemberField(members, 'enableBreadcrumbs')
  const useCustomBreadcrumbs = getObjectMemberField(members, 'useCustomBreadcrumbs')
  const customBreadcrumbs = getObjectMemberField(members, 'customBreadcrumbs')

  if (!enableBreadcrumbs || !useCustomBreadcrumbs || !customBreadcrumbs) return null

  return (
    <Card padding={[3, 3, 4]} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={1}>Here you can control the breadcrumbs for this page. Breadcrumbs are disabled by default.</Text>

        <Grid columns={2} gap={3}>
          <MemberField
            member={enableBreadcrumbs}
            renderInput={renderInput}
            renderField={renderField}
            renderItem={renderItem}
            renderPreview={renderPreview}
          />

          {value?.enableBreadcrumbs && (
            <MemberField
              member={useCustomBreadcrumbs}
              renderInput={renderInput}
              renderField={renderField}
              renderItem={renderItem}
              renderPreview={renderPreview}
            />
          )}
        </Grid>

        {value?.enableBreadcrumbs && <BreadcrumbsPreview breadcrumbs={breadcrumbs || defaultBreadcrumbs} />}

        {value?.enableBreadcrumbs && value?.useCustomBreadcrumbs && (
          <MemberField
            member={customBreadcrumbs}
            renderInput={renderInput}
            renderField={renderField}
            renderItem={renderItem}
            renderPreview={renderPreview}
          />
        )}
      </Stack>
    </Card>
  )
}
