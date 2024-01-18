import { tag_more } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import { Flags } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const CountryTags = (S) =>
  Flags.HAS_NEWS
    ? S.listItem()
        .icon(() => EdsIcon(tag_more))
        .title('Country tags')
        .schemaType('countryTag')
        .child(S.documentTypeList('countryTag').title('Country tag'))
    : EmptyItem
