import { tag } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import { Flags } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const LocalNewsTags = (S) =>
  Flags.HAS_LOCAL_NEWS
    ? S.listItem()
        .icon(() => EdsIcon(tag))
        .title('Local news tags')
        .schemaType('localNewsTag')
        .child(S.documentTypeList('localNewsTag').title('Local news tags').showIcons(false))
    : EmptyItem
