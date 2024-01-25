import { useCallback } from 'react'
import { Stack, TextArea, Label } from '@sanity/ui'
import { set, unset, Rule } from 'sanity'
import { SchemaType } from '../../types'

export const TextAreaWithChars = (props: any) => {
  const { elementProps, onChange, value = '' } = props

  const handleChange = useCallback(
    (event: any) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange],
  )

  return (
    <Stack space={2}>
      <TextArea {...elementProps} onChange={handleChange} value={value} rows={5} />
      <Label size={1}>Characters: {value.length}</Label>
    </Stack>
  )
}

export default {
  title: 'Fields for title and description meta',
  name: 'titleAndMeta',
  type: 'object',
  validation: (Rule: Rule) => [Rule.required().warning('Please pay attention to SEO')],
  fields: [
    {
      name: 'documentTitle',
      title: 'Document title',
      description: `The HTML title element (<title>) defines the document's title. A <title> tells both users and search
      engines what the topic of a particular page is. You should create a unique title for each page on your site. Choose a
      title that reads naturally and effectively communicates the topic of the page’s content. The frontend will use h1 as a fallback for missing document title.`,
      type: 'string',

      validation: (Rule: SchemaType.ValidationRule) =>
        Rule.required().warning('The document title is very important for SEO'),
    },
    {
      name: 'metaDescription',
      title: 'Meta description',
      validation: (Rule: Rule) => [
        Rule.required().warning('Meta description is important for SEO'),
        Rule.max(160).warning('Google recommends max. 160 chars'),
      ],
      description: `Meta descriptions are HTML attributes that provide concise summaries of webpages.
      It shows up in search results and in social media. Should be max. 160 chars`,
      type: 'text',
      components: {
        input: TextAreaWithChars,
      },
    },
  ],
}
