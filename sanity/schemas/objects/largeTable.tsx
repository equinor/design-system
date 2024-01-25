import type { Rule } from 'sanity'

export type LargeFile = {
  _type: 'largeTable'
}

export default {
  type: 'object',
  name: 'largeTable',
  title: 'Imported table',
  description: 'Upload a CSV to be displayed on the website ',
  fields: [
    {
      name: 'fileReference',
      type: 'reference',
      title: 'File asset',
      description: 'Select the asset you want to link to. These can be managed/created in the asset library.',
      to: [{ type: 'assetFile' }],
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
}
