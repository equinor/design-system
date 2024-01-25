import { defaultLanguage } from '../../languages'
import { EdsIcon } from '../../icons'
import { list } from '@equinor/eds-icons'
import { configureTitleBlockContent } from '../editors'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { Heading, Text, Box } from '@sanity/ui'
import styled from 'styled-components'
import type { Rule } from 'sanity'

const titleContentType = configureTitleBlockContent()

const StyledText = styled(Text)`
  margin: 1em 0;
`

// eslint-disable-next-line react/display-name
const ComponentDescription = () => {
  return (
    <Box>
      <Heading size={1}>How to use</Heading>
      <StyledText>
        This component will automatically generate a list of news articles based on the tags you select.
      </StyledText>
      <StyledText>
        <span role="img" aria-label="warning icon" style={{ marginRight: '5px' }}>
          ⚠️
        </span>
        Please note that there is no limit on this list: it will generate a list of <strong>all</strong> articles that
        match the selected tag(s).
      </StyledText>
    </Box>
  )
}

export default {
  title: 'News list',
  name: 'newsList',
  type: 'object',
  fields: [
    {
      name: 'description',
      type: 'string',
      components: {
        input: ComponentDescription,
      },
    },
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      description: 'The (optional) title/heading shown above the news list.',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
    },
    {
      type: 'promoteNews',
      name: 'selectedTags',
      title: 'News tags',
      description: 'Select which tags should be used to generate the news list.',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      newsTags1: `selectedTags.tags.0.title.${defaultLanguage.name}`,
      newsTags2: `selectedTags.tags.1.title.${defaultLanguage.name}`,
      newsTags3: `selectedTags.tags.2.title.${defaultLanguage.name}`,
      countryTags1: `selectedTags.countryTags.0.title.${defaultLanguage.name}`,
      countryTags2: `selectedTags.countryTags.1.title.${defaultLanguage.name}`,
      countryTags3: `selectedTags.countryTags.2.title.${defaultLanguage.name}`,
      localNewsTags1: `selectedTags.localNewsTags.0.${defaultLanguage.name}`,
      localNewsTags2: `selectedTags.localNewsTags.1.${defaultLanguage.name}`,
      localNewsTags3: `selectedTags.localNewsTags.2.${defaultLanguage.name}`,
    },
    prepare({
      newsTags1,
      newsTags2,
      newsTags3,
      countryTags1,
      countryTags2,
      countryTags3,
      localNewsTags1,
      localNewsTags2,
      localNewsTags3,
    }: {
      newsTags1?: string
      newsTags2?: string
      newsTags3?: string
      countryTags1?: string
      countryTags2?: string
      countryTags3?: string
      localNewsTags1?: string
      localNewsTags2?: string
      localNewsTags3?: string
    }) {
      const topicTags = [newsTags1, newsTags2, newsTags3].map((tag) => tag && `${tag} (topic)`)
      const countryTags = [countryTags1, countryTags2, countryTags3].map((tag) => tag && `${tag} (country)`)
      const localTags = [localNewsTags1, localNewsTags2, localNewsTags3].map((tag) => tag && `${tag} (local)`)

      const tags = [...topicTags, ...countryTags, ...localTags].filter(Boolean)
      const title = tags.length > 0 ? `Tags: ${tags.join(', ')}` : 'No tags selected yet!'

      return {
        title: title,
        subtitle: `News list component`,
        media: <div>{EdsIcon(list)}</div>,
      }
    },
  },
}
