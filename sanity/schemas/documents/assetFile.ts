import { EdsIcon } from '../../icons'
import {
  microsoft_excel,
  microsoft_word,
  microsoft_powerpoint,
  library_pdf,
  file,
  calendar_event,
  attach_file,
} from '@equinor/eds-icons'
import type { Rule } from 'sanity'

export const fileIcon = (extension: string) => {
  switch (extension) {
    case 'pdf':
      return EdsIcon(library_pdf)
    case 'xls':
    case 'xlsx':
      return EdsIcon(microsoft_excel)
    case 'doc':
    case 'docx':
      return EdsIcon(microsoft_word)
    case 'pptx':
      return EdsIcon(microsoft_powerpoint)
    case 'ics':
      return EdsIcon(calendar_event)
    default:
      return EdsIcon(file)
  }
}

const acceptedFileTypes = [
  '.pdf',
  '.xls',
  '.xlsx',
  '.csv',
  '.doc',
  '.docx',
  '.pptx',
  '.txt',
  '.zip',
  '.asc',
  '.ics',
  '.mp3',
]

export default {
  title: 'File',
  type: 'document',
  name: 'assetFile',
  icon: () => EdsIcon(attach_file),
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description:
        'The title of the asset file document. This title is used internally and has no impact on the actual file.',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'File attachment',
      name: 'asset',
      type: 'file',
      description:
        'Add the file attachment here. You can replace this file at a later point and all references to this file document will be updated automatically.',
      options: {
        accept: acceptedFileTypes.join(','),
      },
    },
    {
      title: 'Tags',
      name: 'tagReference',
      type: 'array',
      description: 'Adds tags to asset file. These tags are used for internal filtering only.',
      of: [
        {
          type: 'reference',
          title: 'File tag',
          to: [{ type: 'assetTag' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      extension: 'asset.asset.extension',
      filename: 'asset.asset.originalFilename',
    },
    prepare(selection: { title: string; extension: string; filename: any }) {
      const { title, extension, filename } = selection
      const subtitle = extension ? `${extension} | ${filename}` : 'File attachment missing'

      return {
        title: title,
        subtitle: subtitle,
        media: fileIcon(extension),
      }
    },
  },
}
