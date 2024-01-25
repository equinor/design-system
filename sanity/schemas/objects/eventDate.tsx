import type { Rule, ValidationContext } from 'sanity'
import TimeInput, { EMPTY, INVALID_TIME_FORMAT } from '../components/TimeInput'
import TimezoneInput from '../components/TimezoneInput'

export type EventDate = {
  _type: 'eventDate'
  date: string
  startTime?: string
  endTime?: string
  timezone: string
}

const isValid = (field: string | undefined) => {
  const time = field?.split(':') ?? [EMPTY, EMPTY]
  return !(time.includes(EMPTY) && time[0] !== time[1])
}

export default {
  title: 'Fields for event date',
  name: 'eventDate',
  type: 'object',
  fields: [
    {
      name: 'date',
      type: 'date',
      title: 'Date',
      description: 'DD-MM-YYYY',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Start time',
      name: 'startTime',
      type: 'string',
      components: {
        input: TimeInput,
      },
      validation: (Rule: Rule) =>
        Rule.custom((field: string | undefined, context: ValidationContext) => {
          const { parent } = context as { parent: EventDate }
          if (!isValid(field)) {
            return INVALID_TIME_FORMAT
          } else if (!field && parent.endTime) {
            return 'Start time must not be empty'
          } else if (field && !parent.date) {
            return 'Date must be defined'
          } else {
            return true
          }
        }),
    },
    {
      title: 'End time',
      name: 'endTime',
      type: 'string',
      components: {
        input: TimeInput,
      },
      validation: (Rule: Rule) =>
        Rule.custom((field: string | undefined, context: ValidationContext) => {
          const { parent } = context as { parent: EventDate }
          if (!isValid(field)) {
            return INVALID_TIME_FORMAT
          } else if (!field && parent.startTime) {
            return 'End time must not be empty'
          } else if (parent.startTime && field && field <= parent.startTime) {
            return 'End time must be greather than start time'
          } else if (field && !parent.date) {
            return 'Date must be defined'
          } else {
            return true
          }
        }),
    },
    {
      title: 'Timezone',
      description: 'Timezone in which the event will be held',
      name: 'timezone',
      type: 'string',
      components: {
        input: TimezoneInput,
      },
      initialValue: Intl.DateTimeFormat().resolvedOptions().timeZone,
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
}
