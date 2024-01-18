import { directions } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import flags from '../../../../icons/countries'
import { languages } from '../../../../languages'
import { apiVersion } from '../../../../sanity.client'

const redirects = (S) =>
  languages.map((lang) =>
    S.listItem()
      .title(`${lang.title} Redirects`)
      .id(`redirect-${lang.id}`)
      .icon(flags[lang.id])
      .child(() =>
        S.documentList()
          .apiVersion(apiVersion)
          .title(`${lang.title} Redirects`)
          .schemaType('redirect')
          .filter(`_type == 'redirect' && _lang == '${lang.name}'`)
          .canHandleIntent(S.documentTypeList('redirect').getCanHandleIntent())
          .child((id) =>
            S.documentWithInitialValueTemplate('redirect-with-locale', {
              isoCode: lang.name,
            }).documentId(id),
          ),
      ),
  )

export const ExternalRedirects = (S) =>
  S.listItem()
    .title('External Redirects')
    .icon(() => EdsIcon(directions))
    .schemaType('externalRedirect')
    .child(S.documentTypeList('externalRedirect').title('External Redirects').showIcons(false))

export const Redirects = (S) =>
  S.listItem()
    .icon(() => EdsIcon(directions))
    .title('Redirects')
    .child(S.list().id('redirects').title('Redirects').items(redirects(S)))
