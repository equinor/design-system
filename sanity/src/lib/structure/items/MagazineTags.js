import { tag } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import { Flags } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const MagazineTags = (S) =>
  Flags.HAS_MAGAZINE
    ? S.listItem()
        .icon(() => EdsIcon(tag))
        .title('Magazine tags')
        .schemaType('magazineTag')
        .child(S.documentTypeList('magazineTag').title('Magazine tags'))
    : EmptyItem
