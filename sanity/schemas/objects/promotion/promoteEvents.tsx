import type { Reference, Rule, ValidationContext } from 'sanity'
import { filterByRouteEvents } from '../../../helpers/referenceFilters'
import { Flags } from '../../../src/lib/datasetHelpers'
import routes from '../../routes'
import { EventPromotionInput, EventPromotionPreview } from '../../components/EventPromotion'

export type EventPromotion = {
  _key: string
  _type: 'promoteEvents'
  tags?: string[]
  manuallySelectEvents?: boolean
  promotedEvents?: Reference[]
  promotePastEvents?: boolean
  pastEventsCount?: number
  useTags?: boolean
}

export default {
  title: 'Events promotion',
  name: 'promoteEvents',
  type: 'object',
  components: {
    input: EventPromotionInput,
    preview: EventPromotionPreview,
  },
  fields: [
    {
      name: 'manuallySelectEvents',
      type: 'boolean',
      title: 'Manually select events',
      initialValue: false,
    },
    {
      name: 'promotePastEvents',
      type: 'boolean',
      title: 'Select past events',
      initialValue: false,
    },
    {
      name: 'pastEventsCount',
      title: 'How many number of past events to show?',
      type: 'number',
      description: 'Leave empty to show all the past events (max limit 50).',
      validation: (Rule: Rule) => Rule.integer().positive().greaterThan(0).lessThan(50),
    },
    {
      name: 'useTags',
      type: 'boolean',
      title: 'Select events from tags',
      initialValue: true,
    },
    Flags.HAS_EVENT && {
      title: 'Tags',
      name: 'tags',
      description: 'Select the tags you want to promote events from',
      type: 'array',
      of: [
        {
          title: 'Select the event tag(s) to promote',
          type: 'reference',
          to: [{ type: 'eventTag' }],
          options: { disableNew: true },
        },
      ],
      validation: (Rule: Rule) =>
        Rule.custom((value: string, context: ValidationContext) => {
          const { parent } = context as { parent: EventPromotion }
          if (!parent.useTags || parent?.manuallySelectEvents === true) return true
          if (!value || value.length === 0) return 'You must select at least one tag'
          return true
        }).unique(),
    },
    {
      title: 'Events to be promoted',
      name: 'promotedEvents',
      description: 'Select the events you want to promote',
      type: 'array',
      of: [
        {
          title: 'Add event',
          type: 'reference',
          to: routes,
          options: {
            filter: filterByRouteEvents,
            disableNew: true,
          },
        },
      ],
      validation: (Rule: Rule) =>
        Rule.custom((value: string, context: ValidationContext) => {
          const { parent } = context as { parent: EventPromotion }
          if (!parent.manuallySelectEvents) return true
          if (!value || value.length === 0) return 'You must select at least one event'
          return true
        }).unique(),
    },
  ].filter((e) => e),
  preview: {
    select: {
      useTags: 'useTags',
      tags: 'tags',
      promotedEvents: 'promotedEvents',
      manuallySelectEvents: 'manuallySelectEvents',
      promotePastEvents: 'promotePastEvents',
      pastEventsCount: 'pastEventsCount',
    },
  },
}
