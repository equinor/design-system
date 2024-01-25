import { apiVersion } from '../../../../sanity.client'

const extensions = [
  {
    title: 'Show all PDF files',
    extensions: ['pdf'],
    id: 'pdfFilter',
  },
  {
    title: 'Show all Excel sheets',
    extensions: ['xls', 'xlsx', 'csv'],
    id: 'excelFilter',
  },
  {
    title: 'Show all Word documents',
    extensions: ['doc', 'docx'],
    id: 'wordFilter',
  },
  {
    title: 'Show all PowerPoint presentations',
    extensions: ['pptx'],
    id: 'powerPointFilter',
  },
  {
    title: 'Show all ZIP files',
    extensions: ['zip'],
    id: 'zipFilter',
  },
  {
    title: 'Files with other extensions',
    extensions: ['txt', 'ics', 'asc'],
    id: 'otherFileTypeFilter',
  },
]

export const AssetExtensionFilters = (S) =>
  S.listItem()
    .title('Filter files by file type')
    .icon()
    .child(S.list().title('Filter by extension').items(filterItems(S)))

const filterItems = (S) =>
  extensions.map((item) => {
    return S.listItem()
      .title(item.title)
      .child(
        S.documentTypeList('assetFile')
          .apiVersion(apiVersion)
          .id(item.id)
          .title(item.title)
          .filter(`_type == "assetFile" && asset.asset->extension in $extensions`)
          .params({ extensions: item.extensions }),
      )
  })
