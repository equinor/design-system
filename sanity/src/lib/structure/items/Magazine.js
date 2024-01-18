import { TopicDocuments } from '../../../../icons'
import { apiVersion } from '../../../../sanity.client'
import { i18n } from '../../../../schemas/documentTranslation'
import { Flags } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const Magazine = (S) =>
  Flags.HAS_MAGAZINE
    ? S.listItem()
        .title('Magazine')
        .icon(TopicDocuments)
        .schemaType('magazine')
        .child(
          S.documentTypeList('magazine')
            .id('magazines')
            .title('Magazines')
            .apiVersion(apiVersion)
            .filter('_type == "magazine" && (!defined(_lang) || _lang == $baseLang)')
            .params({ baseLang: i18n.base })
            .canHandleIntent((_name, params) => {
              // Assume we can handle all intents (actions) regarding post documents
              return params.type === 'magazine'
            }),
        )
    : EmptyItem
