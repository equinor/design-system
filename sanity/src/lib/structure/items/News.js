import { NewsDocuments } from '../../../../icons'
import { apiVersion } from '../../../../sanity.client'
import { i18n } from '../../../../schemas/documentTranslation'
import { Flags } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const News = (S) =>
  Flags.HAS_NEWS
    ? S.listItem()
        .title('News')
        .icon(NewsDocuments)
        .schemaType('news')
        .child(
          S.documentTypeList('news')
            .apiVersion(apiVersion)
            .id('news')
            .title('News articles')
            .filter(' _type == "news" && (!defined(_lang) || _lang == $baseLang)')
            .params({ baseLang: i18n.base })
            .canHandleIntent((_name, params) => {
              // Assume we can handle all intents (actions) regarding post documents
              return params.type === 'news'
            }),
        )
    : EmptyItem
