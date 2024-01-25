import { tag } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import { Flags } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const Tags = (S) =>
  Flags.HAS_NEWS
    ? S.listItem()
        .icon(() => EdsIcon(tag))
        .title('Tags')
        .schemaType('tag')
        .child(S.documentTypeList('tag').title('Tags').showIcons(false))
    : EmptyItem
