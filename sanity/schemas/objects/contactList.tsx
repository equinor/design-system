import type { Rule } from 'sanity'

export type ContactList = {
  _type: 'contactList'
  title: string
  ingress?: string
  contacts?: Contact[]
}

export type Contact = {
  location: string
  phone: string
}

export default {
  name: 'contactList',
  type: 'object',
  title: 'Contact list',
  fields: [
    { title: 'Title', type: 'string', name: 'title', validation: (Rule: Rule) => Rule.required() },
    { type: 'text', name: 'ingress', title: 'Ingress' },
    {
      name: 'contacts',
      type: 'array',
      title: 'Contact',
      of: [
        {
          type: 'object',
          name: 'contact',
          fields: [
            {
              type: 'string',
              title: 'Location',
              name: 'location',
              placeholder: 'Norway',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              type: 'string',
              title: 'Number',
              name: 'phone',
              placeholder: '+47 999 99 999',
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
}
