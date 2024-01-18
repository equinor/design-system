import { TopicDocuments } from '../../../../icons'
import { apiVersion } from '../../../../sanity.client'
import { i18n } from '../../../../schemas/documentTranslation'

export const TopicContent = (S) =>
  S.listItem()
    .title('Topic content')
    .icon(TopicDocuments)
    .schemaType('page')
    .child(
      S.documentTypeList('page')
        .id('pages')
        .title('Topic content')
        .apiVersion(apiVersion)
        .filter('_type == "page" && (!defined(_lang) || _lang == $baseLang)')
        .params({ baseLang: i18n.base })
        .canHandleIntent((_name, params) => {
          // Assume we can handle all intents (actions) regarding post documents
          return params.type === 'page'
        }),
    )
