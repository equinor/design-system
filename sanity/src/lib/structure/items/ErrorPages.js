import { FileIcon } from '../../../../icons'
import { apiVersion } from '../../../../sanity.client'

export const ErrorPages = (S) => [
  S.listItem()
    .title('404 - Page not found')
    .icon(FileIcon)
    .child(
      S.documentList()
        .id('pageNotFound')
        .title('404')
        .schemaType('pageNotFound')
        .filter('(_id match "*" + $id) && _type == $type')
        .apiVersion(apiVersion)
        .params({
          id: 'pageNotFound',
          type: 'pageNotFound',
        })
        .menuItems([
          {
            title: 'Create new',
            intent: {
              type: 'create',
              params: {
                id: 'pageNotFound',
                type: 'pageNotFound',
                template: 'pageNotFound',
              },
            },
          },
        ]),
    ),
  S.listItem()
    .title('500 - Internal server error')
    .icon(FileIcon)
    .child(
      S.documentList()
        .apiVersion(apiVersion)
        .id('internalServerError')
        .title('500')
        .schemaType('internalServerError')
        .filter('(_id match "*" + $id) && _type == $type')
        .params({
          id: 'internalServerError',
          type: 'internalServerError',
        })
        .menuItems([
          {
            title: 'Create new',
            intent: {
              type: 'create',
              params: {
                id: 'internalServerError',
                type: 'internalServerError',
                template: 'internalServerError',
              },
            },
          },
        ]),
    ),
]
