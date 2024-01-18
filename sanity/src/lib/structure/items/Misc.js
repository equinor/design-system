import { FileIcon, NewsDocuments, TopicDocuments } from '../../../../icons'
import { apiVersion } from '../../../../sanity.client'
import { Flags } from '../../datasetHelpers'

const miscPages = (S) =>
  [
    S.listItem()
      .title('404 - Page not found')
      .icon(FileIcon)
      .child(
        S.documentList()
          .apiVersion(apiVersion)
          .id('pageNotFound')
          .title('404')
          .schemaType('pageNotFound')
          .filter('(_id match "*" + $id) && _type == $type')
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
    Flags.HAS_NEWSROOM &&
      S.listItem()
        .title('Newsroom')
        .icon(NewsDocuments)
        .child(
          S.documentList()
            .apiVersion(apiVersion)
            .id('newsroom')
            .title('Newsroom')
            .schemaType('newsroom')
            .filter('(_id match "*" + $id) && _type == $type')
            .params({
              id: 'newsroom',
              type: 'newsroom',
            })
            .menuItems([
              {
                title: 'Create new',
                intent: {
                  type: 'create',
                  params: {
                    id: 'newsroom',
                    type: 'newsroom',
                    template: 'newsroom',
                  },
                },
              },
            ]),
        ),
    Flags.HAS_MAGAZINE_INDEX &&
      S.listItem()
        .title('Magazine Index Page')
        .icon(NewsDocuments)
        .child(
          S.documentList()
            .id('magazineIndex')
            .apiVersion(apiVersion)
            .title('Magazine Index Page')
            .schemaType('magazineIndex')
            .filter('(_id match "*" + $id) && _type == $type')
            .params({
              id: 'magazineIndex',
              type: 'magazineIndex',
            })
            .menuItems([
              {
                title: 'Create new',
                intent: {
                  type: 'create',
                  params: {
                    id: 'magazineIndex',
                    type: 'magazineIndex',
                    template: 'magazineIndex',
                  },
                },
              },
            ]),
        ),
  ].filter((e) => e)

export const Misc = (S) =>
  S.listItem()
    .title('Misc')
    .icon(TopicDocuments)
    .child(S.list('misc').id('misc').title('Misc').items(miscPages(S)))
