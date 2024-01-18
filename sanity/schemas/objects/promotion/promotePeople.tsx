import type { Rule, Reference } from 'sanity'
import type { ImageWithAlt } from '../imageWithAlt'
import { contacts } from '@equinor/eds-icons'
import { EdsIcon } from '../../../icons'
import { getLinkSelectorFields } from '../linkSelector'

export type Promotion = {
  image?: ImageWithAlt
  name: string
  title?: string
  department?: string
  isLink: boolean
  reference?: Reference
  url?: string
  anchor?: string
}

export type ReferenceTarget = {
  type: string
}

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default {
  title: 'People promotion',
  name: 'promotePeople',
  type: 'object',
  fields: [
    {
      type: 'array',
      name: 'peopleList',
      title: 'Add the people you want to promote',
      of: [
        {
          type: 'object',
          name: 'people',
          title: 'People',
          fieldsets: [
            {
              name: 'seo',
              title: 'SEO',
              description: 'Enable structured markup to show rich results on Google search',
            },
          ],
          fields: [
            {
              name: 'enableStructuredMarkup',
              type: 'boolean',
              title: 'Show the people card content as rich results',
              description: 'Enable this only if its about a person',
              fieldset: 'seo',
            },
            {
              title: 'Image',
              name: 'image',
              type: 'imageWithAlt',
            },
            {
              title: 'Name',
              name: 'name',
              type: 'string',
              validation: (Rule: Rule) => Rule.required().error('Please provide a name'),
            },
            {
              title: 'Title',
              name: 'title',
              type: 'string',
            },
            {
              title: 'Department',
              name: 'department',
              type: 'string',
            },
            {
              name: 'isLink',
              type: 'boolean',
              title: 'Use a link',
              description: 'Link to another piece of content instead of adding contact information',
              initialValue: false,
            },
            {
              title: 'Email',
              name: 'email',
              type: 'string',
              placeholder: 'abbr@equinor.com',
              hidden: ({ parent }: { parent: Promotion }) => parent?.isLink,
              validation: (Rule: Rule) =>
                Rule.warning().custom((email: string) => {
                  if (!email || email === '') return true
                  if (!emailIsValid(email)) return 'Not a valid email'
                  return true
                }),
            },
            {
              title: 'Telephone number',
              name: 'phone',
              type: 'string',
              placeholder: '+47 999 99 999',
              hidden: ({ parent }: { parent: Promotion }) => parent?.isLink,
            },
            ...getLinkSelectorFields(undefined, 'isLink'),
          ],
          preview: {
            select: {
              name: 'name',
              title: 'title',
              department: 'department',
              image: 'image.asset',
            },
            prepare({
              name,
              title,
              department,
              image,
            }: {
              name: string
              title: string
              department: string
              image: Reference
            }) {
              const departmentText = department ? department : ''
              const titleText = title ? title : ''
              return {
                title: name,
                subtitle: `${titleText} ${departmentText}`,
                media: image,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      people1: 'peopleList.0.name',
      people2: 'peopleList.1.name',
      people3: 'peopleList.2.name',
      people4: 'peopleList.3.name',
    },
    prepare({
      people1,
      people2,
      people3,
      people4,
    }: {
      people1: string
      people2: string
      people3: string
      people4: string
    }) {
      const people = [people1, people2, people3].filter(Boolean)
      const hasMorePeople = Boolean(people4)
      const peopleList = people.length > 0 ? `People: ${people.join(', ')}` : ''

      return {
        title: hasMorePeople ? `${peopleList}...` : peopleList,
        subtitle: `People promotions.`,
        media: EdsIcon(contacts),
      }
    },
  },
}
