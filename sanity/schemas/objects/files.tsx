import { library_pdf, microsoft_excel, file } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'
import type { Rule, File } from 'sanity'

export type DownloadableFile = {
  _type: 'downloadableFile'
  filename: string
  file: File
}

export default {
  type: 'object',
  name: 'downloadableFile',
  title: 'File',
  fields: [
    {
      name: 'filename',
      type: 'string',
      title: 'Name',
      description: 'The label used for the link',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'fileReference',
      type: 'reference',
      title: 'File asset',
      description: 'Select the asset you want to link to. These can be managed/created in the asset library.',
      to: [{ type: 'assetFile' }],
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: `filename`,
      extension: 'fileReference.asset.asset.extension',
    },
    prepare({ title = '', extension }: { title: string; extension: string }) {
      let Icon
      switch (extension) {
        case 'pdf': {
          Icon = EdsIcon(library_pdf)
          break
        }
        case 'xlsx': {
          Icon = EdsIcon(microsoft_excel)
          break
        }
        case 'xls': {
          Icon = EdsIcon(microsoft_excel)
          break
        }
        default:
          Icon = EdsIcon(file)
          break
      }

      return {
        title,
        media: Icon,
        subtitle: 'File',
      }
    },
  },
}
